import Product from "./models/product.model.js";
import asynchandler from "./utils/asynchandler.js";
import ApiError from "./utils/ApiEror.js";
import uploadOnCloudinary from "./utils/cloudinary.js";

// create product
const createProduct = asynchandler(async (req,res)=>{
    let {name, price,description,category , brand ,stock ,isFeatured} = req.body;
    if (!name || !description || !stock || !price || !category ) {
        throw  new ApiError (400, "All fields must be provided");
    };
    // file upload 
    const imageLocalPaths = req.files?.map(file=> file.path);
    if (!imageLocalPaths || imageLocalPaths.length ===0) {
        throw new ApiError (400, "At least one product image is required!")
    }

    //cloudinary upload
    const imageUrls = await Promise.all(
        imageLocalPaths.map(async(path)=> await uploadOnCloudinary(path))
    );

    const product = new Product.create ({
        name,
        description,
        stock,
        brand,
        price,
        category,
        isFeatured : isFeatured || false,
        images  : imageUrls
    });

    res.status(201).json({
        success : true,
        message: "Product created successfully!",
        product
    })

});
