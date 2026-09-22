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
    const userId = req.user_id;


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
        await Product.findByIdAndUpdate(items.product.id, {
            $inc : {stock : -items.quantity},
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
    reciept : `reciept_${Date.now()}`,
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
    .diges("hex");
    
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

    await Cart.findOneAndDelete({user: req.user_id});

    res.status(201).json({
        success:true,
        message : "Payment verified and order placed successfully!",
        order,
    });

});

export {createOrder ,verifyPayment};