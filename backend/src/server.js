import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbs.js";

dotenv.config();


const app = express();

app.use(express.json());


app.get("/" , (req,res)=>{
    res.send("Backend running")
});

connectDB();
  
const Port = process.env.PORT || 3000

app.listen( Port, ()=>{
    console.log(`server is listening on port ${Port}`)
})
