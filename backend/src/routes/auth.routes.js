import express from "express";
import  {registerUser,loginUser,logoutUser, forgotPassword, resetPassword, getCurrentUser} from "../controllers/auth.controller.js";
import {protect} from "../middleware/authMiddleware.js"

 const router = express.Router();

// public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password" , forgotPassword);
router.post("/reset-password/:token" , resetPassword);
router.get("/me", protect , getCurrentUser);


// protected routes

router.get("/me", protect,(req,res)=>{
    res.status(200).json({ success: true, user: req.user })
})

export default router;

