import React, { useState, useEffect, useRef, useContext } from "react";

import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import "./ChatWindow.css";

const ChatWindow = () => {
  const { messages, setMessages } = useChat();
  // const [userName, setUserName] = useState("");
  const { isLoggedIn, user, isAuthLoading } = useAuth();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("chatBotToken");
      console.log("token : ", token);
      // const user = JSON.parse(localStorage.getItem("chatBotUser"));
      // setUserName(user?.name || "");
      // console.log("user : ", userName);

      if (token) {
        // Logged-in: fetch from DB
        try {
          const res = await fetch("http://localhost:5000/api/chat/history", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(res);

          const data = await res.json();

          console.log("data: ", data);

          setMessages(data); // Set messages from DB
        } catch (err) {
          console.error("Error loading chats from server:", err);
        }
      } else {
        // Guest: load from localStorage
        const guestChats = JSON.parse(
          localStorage.getItem("chatMessages") || "[]"
        );
        setMessages(guestChats); // Set guest messages
      }
    };

    fetchChats();
  }, [setMessages]);

  return (
    <div className="chat-window">
      {isAuthLoading ? (
        <p className="chat-placeholder">Loading...</p> // wait for auth check
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
