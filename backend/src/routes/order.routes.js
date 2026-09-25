import express from "express";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import { createOrder , verifyPayment } from "../controllers/order.controller.js";


const router  = express.Router();


router.use(protect);

router.post("/create" ,createOrder);
router.post("/verify" ,verifyPayment);


export default router;

