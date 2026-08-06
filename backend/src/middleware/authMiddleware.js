import jwt from "jsonwebtoken";
   

//  Protected Route Middleware (Only Logged In Users)
exports.protected = (req,res,next)=>{
 try {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({success:false, message: "Not authorised , please login first"});
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = decoded;
    next();

 } catch (error) {
    res.status(401).json({success:false,message : "INVALID TOKEN or TOKEN EXPIRED"});
 }

};





// Admin Authorize Middleware (Only Admin Allowed)

exports.isAdmin =  (req,res,next)=>{
    if (req.user && req.user.role==="admin") {
        next();
    }
    req.status(401).json({success:false , message:"Access denied! Admin rights required"})
}