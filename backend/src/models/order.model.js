import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    orderItems :[{
        name:{
            type : String,
            required : true,
        },
        quantity:{
            type : Number,
            required: true,
        },
        image : {
            type : String,
            required : true,
        },
        price:{
             type : Number,
            required: true,
        },
        product : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
            required : true,

        },
    }],
    shippingAddress :{
        street:{
            type: String,
            required : true,
        },
        city :{
            type: String,
            required : true,
        },
        pincode: {
            type: String,
            required : true,
        },
        phone :{
            type: String,
            required : true,
        }
    },
    paymentMethod :{
        type : String,
        enum : ["COD" , "Online"],
        default : "Online",
    },
    paymentResult :{
        id : String,
        status : String,
        update_time : String,
    },
    totalAmount : {
         type : Number,
         required: true,
    },
    isPaid:{
        type : Boolean,
        default : false,
    },
    paidAt :{
        type : Date,
    },
    orderStatus:{
        type: String,
        enum :["Processing", "Shipped" , "Delivered", "Cancelled"],
        default : "Processing",
    }
},{timestamps: true});

const Order =  mongoose.model("Order" ,orderSchema);
module.exports = Order;