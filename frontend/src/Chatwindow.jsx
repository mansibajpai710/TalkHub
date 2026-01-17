import"./Chatwindow.css";
import Chat from "./Chat.jsx";
import {MyContext} from"./MyContext.jsx";
import { useContext,useState,useEffect } from "react"; 
import{ScaleLoader} from "react-spinners";


function Chatwindow() {
  const {prompt,setPrompt,reply,setReply,currThreadId,prevChats,setPrevChats ,setNewChat}=useContext(MyContext);
  const [loading,setLoading]=useState(false);
  const [isOpen,setIsOpen]=useState(false);

  const getReply=async () => {
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
        </div>
        <p className="info">
          TalkHub can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default Chatwindow;