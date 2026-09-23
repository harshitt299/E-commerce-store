import express from "express";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import { addToCart,getCart,updateCartQuantity,removeFromCart } from "../controllers/cart.controller.js";


const router = express.Router();

router.get("/" ,protect ,getCart);
router.post ("/" ,protect , addToCart);
router.patch("/update" ,protect , updateCartQuantity);
router.delete("/remove/:productId" ,protect ,removeFromCart);


export default router ; 
