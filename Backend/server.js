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


// ✅ Gemini client (API key auto-read from GEMINI_API_KEY)
// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// });


// app.post("/test", async (req, res) => {
//   try {
//     const userMessage = req.body.messages;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [
//         {
//           parts: [{ text: userMessage }],
//         },
//       ],
//     });

//     // ✅ Clean response
//     const cleanText = response.text
//   .replace(/\*\*/g, "")   // remove bold **
//   .replace(/\n+/g, " ")   // remove new lines
//   .trim();

// res.json({
//   reply: cleanText,
// });


//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Gemini API call failed" });
//   }
// });

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();
});




