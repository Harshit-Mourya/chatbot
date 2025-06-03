import { useEffect, useState, useContext } from "react";
import { speechToText } from "../context/SpeechToTextContext";
import InputBox from "./InputBox";
import UserMenu from "./UserMenu";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import SessionExpiredPopup from "./SessionExpiredPopup.jsx";

export default function ChatBot() {
  const { transcription, setTranscription } = speechToText();
  const [userInput, setUserInput] = useState("");
  const { isLoggedIn, logout } = useAuth();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    setUserInput(transcription);
  }, [transcription]);

  useEffect(() => {
    // Check if session expired flag is set in sessionStorage
    if (sessionStorage.getItem("sessionExpired") === "true") {
      setShowSessionExpired(true);
      sessionStorage.removeItem("sessionExpired"); // clean up
      logout(); // ensure user is logged out
    }
  }, [logout]);

  const handleLogin = () => {
    setShowSessionExpired(false);
    window.location.href = "/login";
  };

  const handleContinue = () => {
    setShowSessionExpired(false);
    // Let user continue without login, e.g., just close popup and let them use guest mode
  };

  return (
    <div className="ChatBot">
      <h1 className="Heading">AI Chatbot</h1>
      {showSessionExpired && (
        <SessionExpiredPopup
          onLogin={handleLogin}
          onContinue={handleContinue}
        />
      )}

      {/* <SessionExpiredPopup onLogin={handleLogin} onContinue={handleContinue} /> */}

      <UserMenu />
      <ChatWindow />
      <InputBox />
    </div>
  );
}
