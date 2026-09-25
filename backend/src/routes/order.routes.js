import express from "express";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import { cancelOrder, createOrder , getAllOrders, getMyOrderById, getMyOrders, updateOrderStatus, verifyPayment } from "../controllers/order.controller.js";


const router  = express.Router();


router.use(protect);

router.post("/create" ,createOrder);
router.post("/verify" ,verifyPayment);
router.get("/myorders" , getMyOrders);
router.get("/myorder/:id" , getMyOrderById);
router.get("/allorders" , isAdmin , getAllOrders);
router.patch("/allorders/:id/status" , isAdmin , updateOrderStatus);
router.patch("/myorder/:id/cancel" ,cancelOrder);

export default router;

