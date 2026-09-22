import  Product  from "../models/product.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import { razorpayInstance } from "../config/razorpay.js";




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
