import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true,
    },
    user : {
         type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    rating:{
        type : Number,
        required: true,
        min : 0,
        max : 5,
        default : 3,
    },
    comment :{
        type : String,
        required : true,
    }
},{timestamps: true});
reviewSchema.index({product :1,user:1},{unique :true});
 const Review = mongoose.model("Review" ,reviewSchema);
export default Review;