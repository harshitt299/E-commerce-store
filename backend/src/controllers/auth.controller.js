import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { redisClient } from "../config/redis.js";

// helper function to generate jwt token
const generateToken = (userId,role)=>{
     return jwt.sign(
        {_id : userId, role : role},
        process.env.JWT_SECRET,
        {expiresIn :"7d"},
     )
} 


// Register User 

 const registerUser =asynchandler( async(req , res)=>{
         let {name ,email , password } =req.body 
        if(!email || !password){
            throw new ApiError(400, "please enter valid credentials!")
        };


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
        role: "customer"
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
    })
    });


    const getCurrentUser = asynchandler(async(req,res)=>{
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            throw new ApiError(404, "user not found")
        };

        return res.status(200).json({
            success : true,
            message : "user fetched succesfuuly",
            user,
        })
    });



    // login User
const loginUser = asynchandler(async (req,res)=>{
        
            const {email,password}= req.body;

             if(!email || !password){
            throw new ApiError(400, "please enter valis credentials!")
        }; 

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

       
    });



    // logout user 
const logoutUser = async (req,res)=>{
    // JWT ko server pe expire nahi kar sakte, isliye Redis blacklist me dal do (7 din = token expiry)
    try {
        const token = req.cookies?.token;
        if (token && redisClient?.isOpen) {
            const decoded = jwt.decode(token);
            const expInSec = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 7*24*60*60;
            if (expInSec > 0) {
                await redisClient.setEx(`blacklist:${token}`, expInSec, "1");
            }
        }
    } catch (err) {
        console.log("Blacklist set failed:", err.message);
    }
    // for logout clear all cokkies immediately
    res.cookie("token" , "",{
        httpOnly :true,
        expires : new Date(0)
    })   
    res.status(200).json({success:true, message: "Logout succcessfully!"});
};

const forgotPassword = asynchandler (async(req,res)=>{
    let {email} = req.body;


    if(!email) {
        throw new ApiError(400, "email required")
    };
    const user = await User.findOne({email});

    if(!user){
       return res.status(200).json({
        success : true,
        message : "If this email exists, a password reset link has been sent"
       });
    };

    // Same email pe 2 min me dobara mail mat bhejo (Redis cooldown — DB bachata hai + spam rokta hai)
    try {
        if (redisClient?.isOpen) {
            const cooldown = await redisClient.get(`forgot:${email}`);
            if (cooldown) {
                return res.status(429).json({ success: false, message: "Reset link already sent, 2 min baad try karo" });
            }
        }
    } catch (err) {
        console.log("Cooldown check failed:", err.message);
    }

    const rawToken  = crypto.randomBytes(32).toString("hex");
    const hashed  = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashed ;
    user.resetPasswordExpires = Date.now() + 10*60*1000;
    await user.save({validateBeforeSave : false});


    const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
   try {
      await sendEmail({
        to : user.email,
        subject : "Reset your password",
        html :  `
                <h2>Password Reset</h2>

                <p>Hello ${user.name},</p>

                <p>
                    You requested to reset your password.
                </p>

                <p>
                    Click the button below:
                </p>

                <a href="${resetURL}">
                    Reset Password
                </a>

                <p>
                    This link will expire in 10 minutes.
                </p>

                <p>
                    If you did not request this,
                    please ignore this email.
                </p>
            `
    });
    
   } catch (error) {
     user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({validateBeforeSave : false});
        throw new ApiError(500, "Failed to send reset email, try again later");
    };

  

    // Cooldown set karo taaki user turant dobara request na maar sake (return se PEHLE!)
    try {
        if (redisClient?.isOpen) {
            await redisClient.setEx(`forgot:${email}`, 120, "1");
        }
    } catch (err) {
        console.log("Cooldown set failed:", err.message);
    }

    return res.status(200).json({
        success : true,
        message : "Password reset link set successfully to your email"
    });

});



 const resetPassword = asynchandler (async (req,res)=>{
        const {token} =req.params;
        const {newPassword} = req.body;

        const hashed = crypto.createHash("sha256").update(token).digest("hex");

        const user= await User.findOne({
            resetPasswordToken : hashed,
            resetPasswordExpires : { $gt : Date.now() },
        }) ;

        if(!user){
            throw new ApiError(404 , "Invalid or expired reset Token")
        };


        const hashPassword = await bcrypt.hash(newPassword , 10);

        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined ;

        await user.save();

        return res.status(200).json({
            success : true,
            message : "Password reset successfully"
        });
         
    });

export {registerUser,getCurrentUser,loginUser,logoutUser , forgotPassword , resetPassword};