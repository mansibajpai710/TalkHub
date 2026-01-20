import"./Chatwindow.css";
import Chat from "./Chat.jsx";
import {MyContext} from"./MyContext.jsx";
import { useContext,useState,useEffect } from "react"; 
import{ScaleLoader} from "react-spinners";


import { useRef } from "react";




const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;



function Chatwindow() {
  const {prompt,setPrompt,reply,setReply,currThreadId,prevChats,setPrevChats ,setNewChat}=useContext(MyContext);
  const [loading,setLoading]=useState(false);
  const [isOpen,setIsOpen]=useState(false);


  const recognitionRef = useRef(null);




  


  const getReply=async () => {


    console.log("SEND CLICKED");
    
    if (recognitionRef.current) {
    recognitionRef.current.stop();
    recognitionRef.current = null;
  } 

   

  setLoading(true);
  setNewChat(false);



    if (!prompt.trim()) return;

  if (!currThreadId) {
    console.error("Thread ID is missing");
    return;
  }  const options={
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        message:prompt,
        threadId:currThreadId
      })
    };
    try{
       const response=await fetch("http://localhost:8080/api/chat",options);
       const data = await response.json();
       console.log(data);
       setReply(data.reply);

    }catch(err){
      console.log(err);
    }
     finally{
      setLoading(false);}
  };


  useEffect(() => {
  if (prompt && reply) {
    setPrevChats(prev => ([
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: reply }
    ]));

    setPrompt(""); // input clear AFTER reply
  }
}, [reply]);


 const handleProfileClick=()=>{
    setIsOpen(!isOpen);
 }





 const startListening = () => {

  console.log("MIC CLICKED");
  
  if (!SpeechRecognition) {
    alert("Speech Recognition not supported");
    return;
  }

  // 🛑 Agar already mic on hai to pehle stop karo
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }

  const recog = new SpeechRecognition();
  recog.lang = "en-IN";
  recog.continuous = false;
  recog.interimResults = false;

  recog.onresult = (event) => {
    const text = event.results[0][0].transcript;
    setPrompt(text);
  };

  recog.onerror = (e) => {
    console.error("Mic error:", e);
  };

  recog.onend = () => {
    console.log("🎤 Mic stopped");
    recognitionRef.current = null;
  };

  recognitionRef.current = recog;
  recog.start();
};




 
 


  return (
    <div className="Chatwindow">
      <div className="navbar">
        <span>TalkHub  <i className="fa-solid fa-angle-down"></i></span>
        <div className="usericondiv" onClick={handleProfileClick}>
             <span className="usericon"><i className="fa-solid fa-user"></i></span>
        </div>
      </div>
      {
        isOpen &&
        <div className="dropdown">
          <div className="dropdownitems" > <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plans</div>
          <div className="dropdownitems"> <i className="fa-solid fa-gear"></i>Settings</div>
          <div className="dropdownitems"> <i className="fa-solid fa-right-from-bracket"></i>LogOut</div>
        </div>
      }


      <Chat></Chat>

      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>


      <div className="chatInput">
        <div className="inputbox">
          <input placeholder="Ask anything " 
          value={prompt}
          onChange={(e)=> setPrompt(e.target.value)}
          onKeyDown={(e) => {
              if (e.key === "Enter") {
               e.preventDefault();
               getReply();}}}>
          
          </input>





          
          <div className="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
          <div className="submit">
            <i
              className="fa-solid fa-microphone microphone"
              onClick={(e) => {
              e.stopPropagation();   // 🔥 stops bubbling
              startListening();
               }}
             ></i>
          </div>
        </div>
        <p className="info">
          TalkHub can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default Chatwindow;