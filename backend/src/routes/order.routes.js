import express from "express";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import { createOrder , getAllOrders, getMyOrderById, getMyOrders, verifyPayment } from "../controllers/order.controller.js";


const router  = express.Router();


router.use(protect);

router.post("/create" ,createOrder);
router.post("/verify" ,verifyPayment);
router.get("/myorders" , getMyOrders);
router.get("/myorder/:id" , getMyOrderById);
router.get("/allorders" , isAdmin , getAllOrders);

export default router;

