import { createContext, useState } from "react";

export const MyContext = createContext();

export function MyContextProvider({ children }) {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");

  const [allThreads, setAllThreads] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(null);
  const [newChat, setNewChat] = useState(false);
  const [prevChats, setPrevChats] = useState([]);

  return (
    <MyContext.Provider
      value={{
        prompt,
        setPrompt,
        reply,
        setReply,
        allThreads,
        setAllThreads,
        currThreadId,
        setCurrThreadId,
        newChat,
        setNewChat,
        prevChats,
        setPrevChats
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
