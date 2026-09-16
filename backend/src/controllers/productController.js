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


//  Get All products (with search,filter&pagination)

const getAllProduct = asynchandler(async(req,res)=>{
    let {search ,category , minPrice ,maxPrice,page = 1, limit = 10} = req.body;

    let filterQuery = {};

    if(search){
        filterQuery.$or = [
            {name : {$regex : search , $options : "i"}},
            {description : { $regex : search , $options : "i"}}
        ];
    };


    if(category) {
        filterQuery.category = category;
    }

    if(minPrice || maxPrice){
        if(minPrice)filterQuery.price.$gte = Number(minPrice);
        if(maxPrice)filterQuery.price.$lte = Number(maxPrice);
    }


    const skip = (Number(page)-1)*Number(limit);



    const products  =  await Product
    .find(filterQuery)
    .skip(skip)
    .limit(Number(limit))
    .sort({createdAt : -1});

    const totalProduct = await Product.countDocuments(filterQuery);


    res.status(200).json({
        success : true,
        totalProduct ,
         currentPage : Number(page),
         totaPages : Math.ceil(totalProduct / Number(limit)),
         products ,
    });

    
});


// Get single Product 

const getProductById = asynchandler(async(req,res)=>{
    let {id} =  req.params;
    const product = await Product.findById(id);
    
    if(!product){
        throw new ApiError(404, "Product not found");
    };

    res.status(200).json({
        success : true,
        product ,
    });
});

export{getAllProduct, getProductById , createProduct};