import express from "express";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import { cancelOrder, createOrder , getAllOrders, getMyOrderById, getMyOrders, paymentWebhook, updateOrderStatus, verifyPayment } from "../controllers/order.controller.js";


const router  = express.Router();


// Webhook PUBLIC hai - Razorpay ke paas JWT cookie nahi hoti
// raw body server.js se already aa rahi hai, isliye yaha duplicate raw nahi chahiye
router.post("/webhook", paymentWebhook);

router.use(protect);

router.post("/create" ,createOrder);
router.post("/verify" ,verifyPayment);
router.get("/myorders" , getMyOrders);
router.get("/myorder/:id" , getMyOrderById);
router.get("/allorders" , isAdmin , getAllOrders);
router.patch("/allorders/:id/status" , isAdmin , updateOrderStatus);
router.patch("/myorder/:id/cancel" ,cancelOrder);

export default router;

