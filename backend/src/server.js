import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbs.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js"
import errorhandler from "./middleware/errorMiddleware.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import reviewRouter from "./routes/review.routes.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();






const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173" ,
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/orders/webhook", express.raw({type:"application/jscon"}))
app.use(express.json());
app.use(cookieParser());




// Routes
app.use("/api/v1/users" ,authRouter);
app.use("/api/v1/products" , productRouter);
app.use("/api/v1/cart" , cartRouter);
app.use("/api/v1/orders" , orderRouter);
app.use("/api/v1/reviews" , reviewRouter);



app.get("/" , (req,res)=>{
    res.send("Backend running")
});




app.use(errorhandler);
// Pehle Redis + Mongo dono connect, phir server suno
await connectRedis();
connectDB();
  
const Port = process.env.PORT || 3000

app.listen( Port, ()=>{
    console.log(`server is listening on port ${Port}`)
})
