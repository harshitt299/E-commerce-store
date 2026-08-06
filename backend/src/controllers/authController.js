import user from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { use } from "react";

// helper function to generate jwt token
const generateToken = (userId,role)=>{
     return jwt.sign(
        {id : userId, role : role},
        process.env.JWT_SECRET,
        {expiresIn :"7d"},
     )
} 


// Register User 

exports.registerUser = async(req , res)=>{
    try {
         let {name ,email , password, role } =req.body 
        
    const existUser = await User.findOne({email})
    if(existUser){
       return res.status(400).json({success:false , message : "Email already exists!"})
    }

    // create hash pass 
    const salt = await bcrypt.genSalt(10);
    const hashedPass =await bcrypt.hash(password,salt);
   

    // create new User
    const newUser = await User.create({
        name : name,
        email : email,
        password : hashedPass,
        role: role || "customer"
    });

    const token = generateToken(newUser._id,newUser.role);


    res.cookie("token", token, {
        httpOnly : true,
        secure : process.env.NODE_ENV==="production",
        sameSite: "strict",
        maxAge : 7*24*60*60*1000
    });

    res.status(201).json({
        success:true,
        message: "User register successfully",
        user:{
            _id : newUser._id,
            role : newUser.role,
            email : newUser.email,
            name : newUser.name,
        }
    });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
   
    };



    // login User

    exports.loginUser = async (req,res)=>{
        try {
            const {email,password}= req.body;
            const user = await User.findOne({email});
            if (!user) {
               return  res.status(400).json({success:false, message:"INVALID EMAIL or PASSWORD"})
            }
            const isPassworMatch = await bcrypt.compare(password,user.password)
            if(!isPassworMatch){
                 return  res.status(400).json({success:false, message:"INVALID EMAIL or PASSWORD"})
            }

//    generate jwt token

            const token = generateToken(user._id,user.role);

            // set token in htpp cookie
            res.cookie("token" ,token, {
                httpOnly :true,
                secure : process.env.NODE_ENV==="production",
                sameSite : "strict",
                maxAge : 7*24*60*60*1000,
            });

            res.status(200).json({
                success:true,
                message : "Login successfully",
                user : {
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    role: user.role,
                }
            });

        } catch (error) {
            res.status(500).json({success:false, message:"server Error" , error: error.message})
        }
    };



    // logout user 
    exports.logoutUser = (req,res)=>{
    // for logout clear all cokkies immediately
    res.cookie("token" , "",{
        httpOnly :true,
        expires : new Date(0)
    })   
    res.status(200).json({success:true, message: "Logout succcessfully!"});
};