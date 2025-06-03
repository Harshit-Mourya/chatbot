import { Routes, Route } from "react-router-dom";

import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatBot from "./components/ChatBot";
import Loader from "./components/Loader";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthLoading } = useAuth();
  if (isAuthLoading) return <Loader />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<ChatBot />} />
    </Routes>
  );
}

export default App;
