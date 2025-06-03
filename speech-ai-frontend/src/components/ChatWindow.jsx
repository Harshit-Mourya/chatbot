import React, { useState, useEffect, useRef, useContext } from "react";

import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import "./ChatWindow.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatWindow = () => {
  const { messages, setMessages } = useChat();
  // const [userName, setUserName] = useState("");
  const { isLoggedIn, user, isAuthLoading } = useAuth();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isAuthLoading) return;

    const fetchChats = async () => {
      const token = localStorage.getItem("chatBotToken");
      // console.log("token : ", token);
      // const user = JSON.parse(localStorage.getItem("chatBotUser"));
      // setUserName(user?.name || "");
      // console.log("user : ", userName);

      if (token) {
        // Logged-in: fetch from DB
        try {
          const res = await fetch(`${BASE_URL}/chat/history`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // console.log(res);
          if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
          }
          const data = await res.json();

          // console.log("data: ", data);

          setMessages(data); // Set messages from DB
        } catch (err) {
          alert(err);
          console.error("Error loading chats from server:", err);
        }
      } else {
        // Guest: load from localStorage
        try {
          const guestChats = JSON.parse(
            localStorage.getItem("chatMessages") || "[]"
          );
          setMessages(guestChats);
        } catch (e) {
          console.error("Failed to load guest messages:", e);
          setMessages([]);
        }
      }
    };

    fetchChats();
  }, [isAuthLoading, setMessages]);

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
