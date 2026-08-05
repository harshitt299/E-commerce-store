import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
     name : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
    },
    description :{
         type : String,
        required : true,
    },
    price: {
        type: Number,
        required : true,
        min : 0,
    },
    category:{
        type: String,
        required : true,
    },
    brand:{
        type: String
    },
    stock :{
        type: Number,
        required : true,
        default: 0,
    },
    images: [{
        type: String,
        required:true,
    }],
    ratings :{
        average :{
            type : Number,
            default: 0,

        },
        count :{
           type : Number,
           default: 0,
        },
    },
    isFeatured :{
        type : Boolean,
        default: false,
    }
},{timestamps:true})

 const Product = mongoose.model("Product",productSchema);
 module.exports = Product;