import jwt from "jsonwebtoken";
   

//  Protected Route Middleware (Only Logged In Users)
   const protect = (req,res,next)=>{
 try {
    const token = req.cookies.token;
    if (!token) {
      return  res.status(401).json({success:false, message: "Not authorised , please login first"});
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = decoded;
     return next();

 } catch (error) {
   return  res.status(401).json({success:false,message : "INVALID TOKEN or TOKEN EXPIRED"});
 }

};





const  isAdmin =  (req,res,next)=>{
    if (req.user && req.user.role==="admin") {
       return next();
    }
    res.status(401).json({success:false , message:"Access denied! Admin rights required"})
};


export  {protect,isAdmin};