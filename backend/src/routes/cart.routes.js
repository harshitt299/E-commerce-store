import express from "express";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import { addToCart,getCart,updateCartQuantity,removeFromCart } from "../controllers/cart.controller.js";


const router = express.Router();

router.use(protect);

router.get("/" ,getCart);
router.post ("/" , addToCart);
router.patch("/update" , updateCartQuantity);
router.delete("/remove/:productId" ,removeFromCart);


export default router ; 
