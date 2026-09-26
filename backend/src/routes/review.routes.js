import express from "express";
import {
     createProductReview, 
    deleteProductReview,
     getProductReviews,
      updateProductReview 
    } from "../controllers/review.controller.js";
    
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/product/:productId",getProductReviews );
router.post("/:productId" , protect, createProductReview);
router.patch("/:reviewId" , protect , updateProductReview);
router.delete("/:reviewId", protect , deleteProductReview);

export default router ;