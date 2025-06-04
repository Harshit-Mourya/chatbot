import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./LoginSignup.css";
import BackButton from "./BackButton";
import Loader from "./Loader";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      console.log("Login success:", res.data);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

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
        {/* <button onClick={() => setLoginError("Testing error...")}>
          Test Error
        </button> */}
      </form>
    </div>
  );
}
