import  Product  from "../models/product.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Cart from "../models/cart.model.js";
import { getOrSetCache, delCache } from "../utils/cache.js";

// Cart badalne ke baad us user ka cache uda do (warna purana total dikhega)
const invalidateCartCache = async (userId) => {
    await delCache(`cart:user:${userId}`);
};




const addToCart = asynchandler(async(req,res)=>{
    
     let {productId , quantity=1} =  req.body;
     const userId = req.user?._id;
    
     const product = await Product.findById(productId);

     if(!product){
       
        throw new ApiError(404 , "product not found");
     }
    

     let cart  =  await Cart.findOne({user : userId});

     if(cart){
        const itemIndex = cart.items.findIndex((item)=> item.product.toString() === productId);

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
              cart = await Cart.create({
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
      await invalidateCartCache(userId);

      return   res.status(200).json({
            success : true,
            message : "item added in cart successfully",
            cart,
        });

});


// get user cart 

const getCart = asynchandler(async(req,res)=>{
    // User ka cart 30 sec cache — bar-bar same user same cart mangta hai
    const { data: cart, fromCache } = await getOrSetCache(`cart:user:${req.user._id}`, 30, async () => {
        const cart = await Cart.findOne({user : req.user._id}).populate(
            "items.product",
            "name price category images stock"
        ).lean();
        return cart || { items : [] , totalCartPrice : 0 };
    });

     return res.status(200).json({
            success : true,
            fromCache,
            cart,
     });

});




// update product quantity

const updateCartQuantity = asynchandler(async(req,res)=>{
    let {productId , quantity }  = req.body;

    if(quantity < 1){
        throw new ApiError(400 ,"Quantity must be at least 1!");
    }

    const  cart  = await Cart.findOne({user : req.user._id});

    if(!cart){
         throw new ApiError(404 ,"Cart no found!");
    };

    const item = cart.items.find((item)=>item.product.toString()===productId);

    if(!item){
         throw new ApiError(404 ,"Product not found in cart!");
    };

    item.quantity = Number(quantity);

    await cart.save();
    await invalidateCartCache(req.user._id);
    res.status(200).json({
        success : true,
        message: "Cart updated successfully!",
        cart,
    });
});

// Remove items in cart

const removeFromCart = asynchandler(async(req,res)=>{
    const {productId } = req.params;

   const cart  = await Cart.findOne({user: req.user._id});

   if(!cart){
    throw new ApiError(404 , "Cart not found")
   }

   cart.items = cart.items.filter((item) =>item.product.toString()!=productId);
   await cart.save();
   await invalidateCartCache(req.user._id);


   res.status(200).json({
    success:true,
    message : "item remove succesfully",
    cart,
   })
});


export {addToCart , updateCartQuantity , getCart , removeFromCart};