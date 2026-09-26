import asynchandler from "../utils/asynchandler.js";
import Review from "../models/reviews.model.js";
import ApiError from "../utils/ApiError.js";
import Product from "../models/product.model.js";





const createProductReview = asynchandler(async(req,res)=>{
    let {productId} = req.params;
    let {rating ,comment} = req.body;
    const userID = req.user._id;

    if(rating==null|| rating >5 ||rating<0 || !comment){
        throw new ApiError(400 , "oops! rating is not in range of  0 - 5  or comment is missing!")
    };

    const product = await Product.findById(productId);
    if(!product){
         throw new ApiError(404 , "product not found");
    }

    const existingReview = await Review.findOne({
        product : productId,
        user : userID
    } );

    if(existingReview){
        throw new ApiError(400, "You already reviewed tHis product!")
        };

        const review = await Review.create({
            product : productId,
            user : userID,
            rating,
            comment,
        });


        return res.status(201).json({
            success : true,
            message : "review created succesfully",
            review,
        });
 
});


const getProductReviews = asynchandler(async(req,res)=>{
    let {productId} = req.params;
    let {page=1 , limit=10} = req.query;

    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404, "product not found");
    };
    let skip = (Number(page)-1)*Number(limit);


    const reviews=await Review
    .find({product : productId})
    .populate("user" , "name")
    .skip(skip)
    .limit(Number(limit))
    .sort({createdAt :-1});

    const totalReviews = await Review.countDocuments({product : productId});


    return res.status(200).json({
        success : true,
        message : "reviews fetched successfully",
        currentPage : Number(page),
        totalPages : Math.ceil(totalReviews/Number(limit)),
        reviews,
    });
})

export {createProductReview ,getProductReviews};