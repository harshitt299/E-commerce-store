import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
    },
    email : {
         type : String,
        unique : true,
        required : true,
        lowercase : true,
    },
    password:{
        type :String,
        required : true,

    },
    role :{
        type : String ,
        enum : ["customer" ,"admin"],
        default: "customer",
    },
    address:[{
        street : String,
        city: String,
        state : String,
        pincode : String,
        phone : String,
        isDefault: {
            type: Boolean,
            default :false,
        }
    }]
},{timestamps:true});

 const User = mongoose.model("User",userSchema);
 module.exports = User;