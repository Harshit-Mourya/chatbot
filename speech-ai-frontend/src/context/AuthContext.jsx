// context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // NEW

  useEffect(() => {
    const token = localStorage.getItem("chatBotToken");
    if (token) {
      axios
        .get(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data.user);
          setUser(res.data.user);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error("Auth check failed:", err);
          sessionStorage.setItem("sessionExpired", "true");
          logout();
        })
        .finally(() => {
          setIsAuthLoading(false); // Always update this
        });
    } else {
      setIsAuthLoading(false); // No token, still mark done
    }

    // const storedUser = JSON.parse(localStorage.getItem("chatBotUser"));

    // if (token && storedUser) {
    //   setIsLoggedIn(true);
    //   setUser(storedUser);
    // }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("chatBotToken", token);
    // localStorage.setItem("chatBotUser", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("chatBotToken");
    // localStorage.removeItem("chatMessages");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        isAuthLoading,
        setIsAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
