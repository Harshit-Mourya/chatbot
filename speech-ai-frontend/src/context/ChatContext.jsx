import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [response, setResponse] = useState("");
  const { isLoggedIn } = useAuth();

  // const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    // console.log(saved);
    return saved ? JSON.parse(saved) : [];
  });

  //  Auto-scroll chat to the latest message
  useEffect(() => {
    const MAX_MESSAGES = 20;

    const trimmedMessages =
      messages.length > MAX_MESSAGES ? messages.slice(-MAX_MESSAGES) : messages;

    if (!isLoggedIn) {
      localStorage.setItem("chatMessages", JSON.stringify(trimmedMessages));
    }

    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // console.log(messages);
  }, [messages]);

  const sendToAI = async (text) => {
    if (!text.trim()) return;
    setLoading(true);

    setMessages((prev) => [...prev, { text: text, sender: "user" }]);

    let fullPrompt;

    //  Check if chat history exists
    if (messages.length > 0) {
      const chatHistory = messages
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");
      fullPrompt = `${chatHistory}\nUser: ${text}\nAI:`; //  Send full chat history
    } else {
      fullPrompt = text; //  First message, send only the user's input
    }

    // console.log("fullPrompt: ", fullPrompt);

    try {
      const token = localStorage.getItem("chatBotToken");

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message: text, // Send transcribed speech as message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        { text: res.data.response, sender: "ai" },
      ]);

      setResponse(res.data.response); // Store AI response
    } catch (error) {
      console.error("Error sending to Cohere:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error getting AI response.", sender: "ai" },
      ]);
      setResponse("Error getting AI response."); // Display error if API fails
    }
    setLoading(false);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        sendToAI,
        loading,
        chatEndRef,
        response,
        setResponse,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the Chat Context
export const useChat = () => useContext(ChatContext);
