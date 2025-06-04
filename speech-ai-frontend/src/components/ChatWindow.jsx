import React, { useState, useEffect, useRef, useContext } from "react";

import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import "./ChatWindow.css";
import Loader from "./Loader";

const ChatWindow = () => {
  const { messages, setMessages, messagesLoading } = useChat();
  // const [userName, setUserName] = useState("");
  const { isLoggedIn, user, isAuthLoading } = useAuth();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {isAuthLoading || messagesLoading ? (
        // <p className="chat-placeholder">Loading...</p>
        <Loader />
      ) : messages.length === 0 ? (
        <p className="chat-placeholder">
          Hey {isLoggedIn ? user.name : "there"}, how can I assist you today?
        </p>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "ai"}`}
          >
            {msg.text}
          </div>
        ))
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;
