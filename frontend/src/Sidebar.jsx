import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import {MyContext} from"./MyContext.jsx";
import {v1 as uuidv1} from "uuid";


function Sidebar() {

const {allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats}=useContext(MyContext);

const getAllThreads= async()=>{
  try{
      const response=await fetch("http://localhost:8080/api/thread");
      const res= await response.json();
      const filteredData=res.map(thread=>({threadId:thread.threadId,title:thread.title}));
      setAllThreads(filteredData);

  }catch(err){
    console.log(err);
  }
};

useEffect(()=>{
  getAllThreads();
},[currThreadId])



const createNewChat=()=>{
  setNewChat(true);
  setPrompt("");
  setReply(null);
  setCurrThreadId(uuidv1());
  console.log("setCurrThreadId:", setCurrThreadId);

  setPrevChats([]);
}



const changeThread= async (newthreadId)=>{
  setCurrThreadId(newthreadId);

  try{
     const response= await fetch(`http://localhost:8080/api/thread/${newthreadId}`);
     const res= await response.json();
     console.log(res);
     setPrevChats(res);
     setReply(null);
     setNewChat(false);
  }catch(err){
    console.log(err);
  }

}


const deleteThread=async (threadId) => {
  try{
       const response=await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"DELETE"});
       const res= await response.json();
       console.log(res);
      setAllThreads(prev=>prev.filter(thread=>thread.threadId !==threadId));


      if(threadId===currThreadId){
        createNewChat();
      }


  }catch(err){
    console.log(err);

  }
}


  return (
    <div >
      <section className="sidebar">
        <button onClick={createNewChat}>
          <span><i className="fa-regular fa-message"></i></span>
           <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>

        <ul className="history">
            {
              allThreads ?.map((thread,idx)=>(
                <li key={idx} onClick={()=>changeThread(thread.threadId)} className={thread.threadId===currThreadId?"highLighted":""}
                >{thread.title}
                <i className="fa-solid fa-trash" onClick={(e)=>{
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}></i></li>
              ))
            }
        </ul>

        <div className="sign">
          <p>
            BY Mansi Bajpai &hearts;
          </p>
        </div>
      </section>
    </div>
  );
}

export default Sidebar;
