import express from "express";
import { createProduct,updateProduct,getAllProduct,getProductById,deleteProduct } from "../controllers/product.controller.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import {upload} from "../middleware/multerMiddleware.js";



const router = express.Router();




// Public Routes

router.get("/" ,getAllProduct);
router.get("/:id", getProductById);


// Protected routes

// create product maxmimum 5 images
router.post("/" , protect ,isAdmin, upload.array("images" ,5),createProduct);
router.put("/:id" , protect , isAdmin , updateProduct);
router.delete("/:id" , protect , isAdmin , deleteProduct);



export default router ; 


