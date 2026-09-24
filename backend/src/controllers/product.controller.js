import  Product  from "../models/product.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// create product
const createProduct = asynchandler(async (req,res)=>{
    let {name, price,description,category , brand ,stock ,isFeatured} = req.body;
    if (!name || !description || stock==null || !price || !category ) {
        throw  new ApiError (400, "All fields must be provided");
    };
    // file upload 
    let imageLocalPaths = req.files?.map(file=> file.path);
    if (!imageLocalPaths || imageLocalPaths.length ===0) {
        throw new ApiError (400, "At least one product image is required!")
    }
    //cloudinary upload
    let imageUrls = await Promise.all(
        imageLocalPaths.map(async(path)=> await uploadOnCloudinary(path))
    );
    let product = await  Product.create ({
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
    let {search ,category , minPrice ,maxPrice,page = 1, limit = 10} = req.query;

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
        filterQuery.price = {};
        if(minPrice)filterQuery.price.$gte = Number(minPrice);
        if(maxPrice)filterQuery.price.$lte = Number(maxPrice);
    }


    let skip = (Number(page)-1)*Number(limit);



    let products  =  await Product
    .find(filterQuery)
    .skip(skip)
    .limit(Number(limit))
    .sort({createdAt : -1});

    let totalProduct = await Product.countDocuments(filterQuery);


    res.status(200).json({
        success : true,
        totalProduct ,
         currentPage : Number(page),
         totalPages : Math.ceil(totalProduct / Number(limit)),
         products ,
    });

    
});


// Get single Product 

const getProductById = asynchandler(async(req,res)=>{
    let {id} =  req.params;
    let product = await Product.findById(id);
    
    if(!product){
        throw new ApiError(404, "Product not found");
    };

    res.status(200).json({
        success : true,
        product ,
    });
});




const updateProduct = asynchandler (async(req,res)=>{
    let {id} = req.params;


    let  product  = await Product.findById(id);



     if(!product){
        throw new ApiError(404, "Product not fond");
     }



     let imageUrls = product.images;

     if(req.files && req.files.length>0){
        let  imageLocalPath =req.files.map((file)=>file.path);
    
         imageUrls = await Promise.all(
        imageLocalPath.map(async(path)=> await uploadOnCloudinary(path))
     )
    }


     let updatedData = {
        ...req.body,
        images : imageUrls,
     };




     product = await Product.findByIdAndUpdate(id,updatedData,{
        new : true,
        runValidators : true,
     });



     res.status(200).json({
        success: true,
        message : "product updated duccessfully",
        product,
     });



});

const deleteProduct = asynchandler (async(req,res)=>{
    let {id} = req.params;


     let product  = await Product.findById(id);



     if(!product){
        throw new ApiError(404, "Product not fond");
     }

     await Product.findByIdAndDelete(id);


      res.status(200).json({
        success: true,
        message : "product deleted successfully",
       
     });

});

export{getAllProduct, getProductById , createProduct ,updateProduct , deleteProduct};