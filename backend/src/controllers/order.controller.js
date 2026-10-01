import  Product  from "../models/product.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import { razorpayInstance } from "../config/razorpay.js";
import crypto from "crypto";





const createOrder = asynchandler(async(req,res)=>{
    let {shippingAddress ,paymentMethod} = req.body;
    const userId = req.user._id;


    const cart =  await Cart.findOne({user : userId}).populate("items.product");

    if(!cart || cart.items.length === 0){
        throw new ApiError(404, "Cart is Empty!");
    }


    // create snapshot of orderitems

    const orderItems = cart.items.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    image: item.product.images[0], // First image snapshot
    price: item.price,
    product: item.product._id,
     }));

     const totalAmount = cart.totalCartPrice;


    //  if payment === COD

    if(paymentMethod === "COD"){
        const newOrder = await Order.create({

        user : userId,
        orderItems ,
        shippingAddress,
        paymentMethod,
        totalAmount,
        isPaid : false,
    });

    for(const item of cart.items){
        await Product.findByIdAndUpdate(item.product.id, {
            $inc : {stock : -item.quantity},
        });
    }
    await  Cart.findOneAndDelete({user :userId});

    return res.status(201).json({
      success: true,
      message: "Order placed successfully with COD!",
      order: newOrder,
    });

}

//  if payment === online (through razorpay)
 const options = {
    amount : Math.round(totalAmount*100),
    currency : "INR",
    receipt : `receipt_${Date.now()}`,
 };

 const razorpayOrder = await razorpayInstance.orders.create(options);

//  save pending orders in dbs
const newOrder = await Order.create({
    user : userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    isPaid: false,
    paymentResult :{
        razorpay_order_id : razorpayOrder.id,
        status : "created",
    },
});

 res.status(201).json({
    success : true,
    message : "Razorpay Order created successfully!",
    razorpayOrder,
    orderId : newOrder._id,
 });


});



//  verify Razorpay payment

const verifyPayment = asynchandler(async(req,res)=>{
    const {razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    dbOrderId, } = req.body;

    // HMAC Signature Check (Cryptographic Verification)
    const body = razorpay_order_id + "|" + razorpay_payment_id ;
    const expectedSignature = crypto
    .createHmac("sha256" ,process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
    
    if(expectedSignature !=razorpay_signature){
        throw new ApiError(400 ,"Paymewnt verfication failed! Invalid Signature.")
    };

    const order = await Order.findById(dbOrderId);
    if(!order){
        throw new ApiError(404, "Order not found!");
    }

    order.isPaid =true;
    order.paidAt = Date.now();
    order.paymentResult = {
        razorpay_payment_id ,
        razorpay_order_id,
        razorpay_signature,
        status : "Paid",
    }

    await order.save();


    for(const item of order.orderItems){
        await Product.findByIdAndUpdate(item.product  ,{
            $inc : {stock : -item.quantity}
        })
    }

    await Cart.findOneAndDelete({user: req.user._id});

    res.status(201).json({
        success:true,
        message : "Payment verified and order placed successfully!",
        order,
    });

});

const paymentWebhook = asynchandler(async (req, res) => {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify signature
    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (expectedSignature !== webhookSignature) {
        return res.status(400).json({
             success: false,
              message: "Invalid webhook signature"
             });
    }

    const event = req.body;
    console.log("Webhook received:", event.event, event.payload?.payment?.entity?.id);

    try {
        switch (event.event) {
            case "payment.captured": {
                const payment = event.payload.payment.entity;
                const orderId = payment.notes?.order_id || payment.order_id;
                
                if (!orderId) {
                    console.warn("No order_id in payment notes", payment.id);
                    break;
                }

                const order = await Order.findById(orderId);
                if (!order) {
                    console.warn("Order not found for webhook", orderId);
                    break;
                }

                // Idempotency: skip if already paid
                if (order.isPaid) {
                    console.log("Order already paid, skipping", orderId);
                    break;
                }

                // Verify amount matches (in paise)
                if (payment.amount !== Math.round(order.totalAmount * 100)) {
                    console.error("Amount mismatch", { expected: order.totalAmount * 100, received: payment.amount });
                    break;
                }

                // Update order
                order.isPaid = true;
                order.paidAt = new Date();
                order.paymentResult = {
                    razorpay_payment_id: payment.id,
                    razorpay_order_id: payment.order_id,
                    razorpay_signature: webhookSignature,
                    status: "Paid",
                };
                await order.save();

                // Decrement stock
                for (const item of order.orderItems) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: -item.quantity }
                    });
                }

                // Clear cart
                await Cart.findOneAndDelete({ user: order.user });
                console.log("Order completed via webhook", orderId);
                break;
            }

            case "payment.failed": {
                const payment = event.payload.payment.entity;
                const orderId = payment.notes?.order_id || payment.order_id;
                
                if (orderId) {
                    const order = await Order.findById(orderId);
                    if (order && !order.isPaid) {
                        order.paymentResult = {
                            ...order.paymentResult,
                            status: "Failed",
                            razorpay_payment_id: payment.id,
                        };
                        await order.save();
                        console.log("Payment failed for order", orderId);
                    }
                }
                break;
            }

            case "refund.created":
            case "refund.processed": {
                const refund = event.payload.refund.entity;
                const paymentId = refund.payment_id;
                
                // Find order by payment_id
                const order = await Order.findOne({
                    "paymentResult.razorpay_payment_id": paymentId
                });
                
                if (order) {
                    order.paymentResult = {
                        ...order.paymentResult,
                        status: refund.status === "processed" ? "Refunded" : "Refund Initiated",
                        refund_id: refund.id,
                        refund_amount: refund.amount / 100,
                    };
                    await order.save();
                    
                    // Restore stock on refund
                    if (refund.status === "processed") {
                        for (const item of order.orderItems) {
                            await Product.findByIdAndUpdate(item.product, {
                                $inc: { stock: item.quantity }
                            });
                        }
                    }
                    console.log("Refund processed for order", order._id);
                }
                break;
            }

            default:
                console.log("Unhandled webhook event:", event.event);
        }

        // Always return 200 to acknowledge receipt
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        // Still return 200 to prevent Razorpay retries for processing errors
        // Log for manual investigation
        res.status(200).json({ success: true, message: "Received but processing failed" });
    }
});

// Get My orders

const getMyOrders = asynchandler(async(req,res)=>{
    let userId = req.user._id;
    if(!userId){
        throw new  ApiError(404, "Opps can't find any orders!")
    };

    let{page =1 , limit=10} = req.query;
    let skip = (Number(page)-1)*Number(limit);


    const myOrders = await Order
    .find({user : userId})
    .sort({createdAt :-1})
    .skip(skip)
    .limit(Number(limit));

    const totalOrders = await Order.countDocuments({user:userId});

    return res.status(200).json({
        success : true,
        message : "orders fetched succesfully",
        myOrders,
        totalOrders,
        currentPage : Number(page),
        totalPages: Math.ceil(totalOrders/Number(limit))
    });

});



// Get my order by id
const getMyOrderById = asynchandler(async(req,res)=>{
    let {id} = req.params;
    const order  = await Order.findById(id).populate("user" , "name email")

    if(!order){
        throw new ApiError(404 , "order not found!")
    };
    if(order.user._id.toString() !==req.user._id && req.user.role!="admin"){
        throw new ApiError(403, "you are unauthorised")
    };

    return res.status(200).json({
        success : true,
        order,
        message : "order feteched successfully",
    });

});



// get all orders by admin 
const getAllOrders = asynchandler(async(req,res)=>{
    const { page = 1 , limit =10, status} = req.query;
     
    let skip = (Number(page)-1)*Number(limit);

    let filterQuery = {};

    if(status){
        filterQuery.orderStatus = status
    };

    const allOrders = await Order
    .find(filterQuery)
    .populate("user" , "name email")
    .sort({createdAt :-1})
    .skip(skip)
    .limit(Number(limit));

    let totalOrders = await Order.countDocuments(filterQuery);

    return res.status(200).json({
        success : true,
        message : "orders fetched succesfully",
        allOrders,
        currentPage : Number(page),
        totalPages : Math.ceil(totalOrders/Number(limit)),
        totalOrders,

    })
});


const updateOrderStatus =asynchandler(async(req,res)=>{
    const {id} = req.params;
    const {status} = req.body;
    if(!status || !["Shipped" , "Delivered" , "Cancelled"].includes(status)){
        throw new ApiError(400, "Invalid status!")
    };


    let order = await Order.findById(id);
    if(!order){
        throw new ApiError(404, "order not found!")
    };

    if(order.orderStatus === "Delivered"){
        throw new ApiError (400, "Order is already Delivered");
    };
    if(order.orderStatus === "Cancelled"){
        throw new ApiError (400, "Cancelled Order can't be updated!");
    };




    if(order.orderStatus ==="Processing" && status ==="Delivered"){
        throw new ApiError(400, "First Shipped the Order then Deliver It")
    };

    if(status == "Delivered"){
        order.isDelivered=true;
        order.deliveredAt=Date.now();
        if(order.paymentMethod==="COD"){
            order.isPaid =true,
            order.paidAt = Date.now();
        }
    };

    if(status==="Cancelled"){
        for(const item of order.orderItems){
            await Product.findByIdAndUpdate(item.product,{
                $inc : {stock : item.quantity}
            });
        }
    }
    order.orderStatus = status;
    await order.save();

    return res.status(200).json({
        success : true,
        message : "order status updated successfully",
        order,
    });

    
});



const cancelOrder = asynchandler(async(req,res)=>{
    let {id} =req.params;
   let order = await Order.findById(id);


   if(!order){
        throw new ApiError(404, "Order not found")
    };

    if( order.user.toString()!=req.user._id.toString()){
        throw new ApiError(403, "unauthorised request!")
    };




    if(order.orderStatus!="Processing"){
        throw new ApiError(400, "Order is Cancelled only in Processing state! ")
    };

    

    for(const item of order.orderItems){
        await Product.findByIdAndUpdate(item.product, {
            $inc :{stock : item.quantity}
        });
    }
    order.orderStatus = "Cancelled";
    await order.save();

    return res.status(200).json({
        success :true,
        message : "Order Cancelled!",
        order,
    });

})

export {createOrder ,
    verifyPayment ,
    getMyOrders , 
    getMyOrderById ,
    getAllOrders ,
    updateOrderStatus,
    cancelOrder,
    paymentWebhook,
};

