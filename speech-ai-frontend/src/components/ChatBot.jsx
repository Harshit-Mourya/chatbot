import { useEffect, useState, useContext } from "react";
import { speechToText } from "../context/SpeechToTextContext";
import axios from "axios";
import InputBox from "./InputBox";
import UserMenu from "./UserMenu";
import ChatWindow from "./ChatWindow";
import { useChat } from "../context/ChatContext";
import "../App.css";

export default function ChatBot() {
  const { transcription, setTranscription } = speechToText();
  const [message, setMessage] = useState("");
  const [userInput, setUserInput] = useState("");

  const { messages, sendToAI, loading, chatEndRef, response } = useChat();

  useEffect(() => {
    setUserInput(transcription);
  }, [transcription]);

  //  Function to send message
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    sendToAI(userInput); // Send message to AI
    setUserInput(""); // Clear input field
  };

  // Allow "Enter" key to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="ChatBot">
      <h1 className="Heading">AI Chatbot</h1>
      {/* <p>{message}</p> */}
      {/* <div>
        <input
          type="text"
          placeholder="Type a message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress} // Allow Enter key
        />
        <button onClick={handleSendMessage}>Send</button>
        <SpeechButton />
      </div> */}
      <UserMenu />
      <ChatWindow />
      <InputBox />
      {/* <p>
        <strong>Transcribed Text:</strong> {transcription}
      </p>
      <p>
        <strong>Response:</strong> {response}
      </p> */}
      {/* <button onClick={() => speakResponse(response)} disabled={isSpeaking}>
        {isSpeaking ? "Speaking..." : "🔊 Read Aloud"}
      </button> */}
    </div>
  );
}
