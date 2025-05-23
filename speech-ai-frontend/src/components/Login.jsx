import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./LoginSignup.css";
import BackButton from "./BackButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // localStorage.setItem("chatBotToken", res.data.token);
      // localStorage.setItem("chatBotUser", JSON.stringify(res.data.user));

      login(res.data.user, res.data.token);

      navigate("/"); // Redirect to chatbot
    } catch (err) {
      if (!err.response) {
        alert("Network error. Please check your connection.");
      } else {
        const msg =
          err.response?.data?.error || "Login failed. Please try again.";
        setLoginError(msg);
        console.error(err);
      }
    }
  };

  return (
    <div className="login-container">
      <BackButton />

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {loginError && <p className="login-error">*&nbsp;{loginError}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}
