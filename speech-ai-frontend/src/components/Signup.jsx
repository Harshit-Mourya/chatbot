import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // if you use react-router for navigation
import axios from "axios";
import BackButton from "./BackButton";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState("");
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      // Save token from backend response
      localStorage.setItem("chatBotToken", res.data.token);
      localStorage.removeItem("chatMessages");
      login(res.data.user, res.data.token);

      // Redirect user after successful signup
      navigate("/");
    } catch (err) {
      setSignupError(err.response?.data?.error || "Signup failed! Try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="signup-container">
      <BackButton />

      <h2>Create Account</h2>
      <form onSubmit={handleSignup}>
        <input
          className="signup-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          placeholder="Name"
        />

        <input
          className="signup-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="Email"
        />

        <input
          className="signup-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Password"
        />
        {signupError && <p className="signup-error">*&nbsp;{signupError}</p>}

        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
}
