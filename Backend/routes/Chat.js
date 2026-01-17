 import express from "express";
 import Thread from "../models/Thread.js";
 import getGeminiResponse from "../utils/Gemini.js";


 const router=express.Router();



 

 router.get("/thread",async(req ,res)=>{
    try{
        const threads=await Thread.find({}).sort({updatedAt:-1});
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to fetch threads"});
    }
 });



 router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;

    try{
         const thread=await Thread.findOne({threadId});
         if(!thread){
          res.status(404).json({error:"Thread us not found"});
         }

         res.json(thread.messages);
    }catch(err){
        console.log(err);
          res.status(500).json({error:"failed to fetch chat"});
    }
 });




 router.delete("/thread/:threadId",async(req ,res)=>{
     const  {threadId}=req.params;

    try{
        const deletedthread=await Thread.findOneAndDelete({threadId});

        if(!deletedthread){
             return res.status(404).json({error:"thread not found"});
        }
        res.status(200).json({success:"thread deleted  successfully"})
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to delete thread"});
    }
 });



 router.post("/chat",async(req ,res)=>{
    const {threadId,message}=req.body;
    if(!threadId|| !message){
         return res.status(400).json({error:"missing required fields"});
    }
    try{
         let thread=await Thread.findOne({threadId});
         if(!thread){
            thread=new Thread({
                threadId,
                title: message,
                messages:[{role:"user",content:message}]
            });
         }else{
            thread.messages.push({role:"user",content:message});
         }

         const assistantReply= await getGeminiResponse(message);

         thread.messages.push({role:"assistant",content:assistantReply});
         thread.updatedAt=new Date();
         await thread.save();
         res.json({reply:assistantReply});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
 });

 export default router;