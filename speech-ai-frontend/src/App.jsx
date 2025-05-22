import { Routes, Route } from "react-router-dom";

import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<ChatBot />} />
    </Routes>
  );
}

export default App;
