import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";
import axios from "axios";
import Loader from "./Loader";
import { use } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserMenu = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { setMessages } = useChat();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    setLoading(true);

    setDropdownOpen(false);

    setTimeout(() => {
      logout();

      setLoading(false);
      navigate("/");
    }, 2000);
  };

  const handleClearChat = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your chat history?"
    );
    if (!confirmClear) return;

    // console.log(isLoggedIn);

    if (isLoggedIn) {
      try {
        console.log("trying to clear chat...");

        await axios.delete(`${BASE_URL}/chat/clear`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("chatBotToken")}`,
          },
        });
        setMessages([]);
      } catch (err) {
        console.error("Failed to clear chat", err);
      }
    } else {
      localStorage.removeItem("chatMessages");
      setMessages([]);
    }

    setDropdownOpen(false); // Close dropdown after action
  };

  const handleNavigate = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-icon" onClick={toggleDropdown}>
        {isLoggedIn ? (
          user?.name?.[0]?.toUpperCase()
        ) : (
          <i className="fa-solid fa-circle-user"></i>
        )}
      </div>

      {dropdownOpen && (
        <div className="dropdown">
          {isLoggedIn ? (
            <>
              <div className="dropdown-item hi-user">Hi {user.name}</div>
              <div className="dropdown-item" onClick={handleClearChat}>
                Clear Chat
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </>
          ) : (
            <>
              <div
                className="dropdown-item"
                onClick={() => handleNavigate("/login")}
              >
                Login
              </div>
              <div
                className="dropdown-item"
                onClick={() => handleNavigate("/signup")}
              >
                Signup
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
