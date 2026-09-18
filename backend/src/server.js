import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbs.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.route.js"
import errorhandler from "./middleware/errorMiddleware.js";
import cartRouter from "./routes/cart.routes.js";

dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser());




// Routes
app.use("/api/v1/auth" ,authRouter);
app.use("/api/v1/products" , productRouter);
app.use("/api/v1/cart" , cartRouter);


app.get("/" , (req,res)=>{
    res.send("Backend running")
});




app.use(errorhandler);
connectDB();
  
const Port = process.env.PORT || 3000

app.listen( Port, ()=>{
    console.log(`server is listening on port ${Port}`)
})
