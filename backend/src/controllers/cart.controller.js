import  Product  from "../models/product.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Cart from "../models/cart.model.js";




const addToCart = asynchandler(async(req,res)=>{
     let {productId , quantity=1} =  req.body;
     const userId = req.user._id;

     const product = await Product.findById(productId);

     if(!product){
        throw new ApiError(404 , "product not found");
     }


     let cart  =  await Cart.findOne({user : userId});

     if(cart){
        const itemIndex = cart.items.findIndex((item)=> item.product.toString === productId);

        if(itemIndex > -1){
            cart.items[itemIndex].quantity +=Number(quantity);
        }else{
            cart.items.push({
                product : productId,
                quantity : Number(quantity),
                price : product.price,
            });
          }

        }else{
            let cart = new Cart.create({
                user : userId,
                items : [
                    {
                        product : productId ,
                        quantity : Number(quantity),
                        price : product.price,
                    },
                ],
            });
        };

        await cart.save();

      return   res.status(200).json({
            success : true,
            message : "item added in cart successfully",
            cart,
        });

});


// get user cart 

const getCart = asynchandler(async(req,res)=>{
    const cart  = await Cart.findOne({user : req.user._id}).populate(
        "items.product", 
        "name price category images stock"
    );

    if(!cart){
        return res.status(200).json({
            success : true,
            cart : { items : [] ,totalCartPrice : 0 }
        });
    };


    
})