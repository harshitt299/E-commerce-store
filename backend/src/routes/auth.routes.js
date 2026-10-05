import express from "express";
import  {registerUser,loginUser,logoutUser, forgotPassword, resetPassword, getCurrentUser} from "../controllers/auth.controller.js";
import {protect} from "../middleware/authMiddleware.js"
import { loginLimiter, registerLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";

 const router = express.Router();

// public routes (brute-force / spam se bachne ke liye Redis rate-limit)
router.post("/register", registerLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password" , forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token" , resetPassword);
router.get("/me", protect , getCurrentUser);


export default router;

