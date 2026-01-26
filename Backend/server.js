import express from "express";
import "dotenv/config";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import chatRoutes from "./routes/Chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/api",chatRoutes);


const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with database");
  }
  catch(err){
    console.log("failed to connect with db",err);
  }
}

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();
});




