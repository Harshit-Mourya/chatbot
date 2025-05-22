import { useState } from "react";
import { useChat } from "../context/ChatContext";
import SpeechButton from "./SpeechButton";
import "./InputBox.css";
import useSpeech from "../hooks/useSpeech.js";

export default function InputBox() {
  const [userInput, setUserInput] = useState("");

  const { isSpeaking, speak, stop } = useSpeech();

  const { messages, sendToAI, loading, chatEndRef, response } = useChat();

  //Allow "Enter" key to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  // Function to send message
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    sendToAI(userInput); // Send message to AI
    setUserInput(""); // Clear input field
  };

  // const speakResponse = (text) => {
  //   if ("speechSynthesis" in window) {
  //     const speech = new SpeechSynthesisUtterance(text);
  //     speech.lang = "en-US";
  //     speech.rate = 1; // Speed of speech (1 is normal)
  //     speech.pitch = 1; // Pitch level
  //     speech.onstart = () => setIsSpeaking(true);
  //     speech.onend = () => setIsSpeaking(false);

  //     window.speechSynthesis.speak(speech);
  //   } else {
  //     alert("Speech synthesis is not supported in your browser.");
  //   }
  // };

  // const speakResponse = (text) => {
  //   if (!("speechSynthesis" in window)) {
  //     alert("Speech synthesis is not supported in your browser.");
  //     return;
  //   }

  //   if (window.speechSynthesis.speaking) {
  //     // Stop speech if already speaking
  //     window.speechSynthesis.cancel();
  //     setIsSpeaking(false);
  //     return;
  //   }

  //   const speech = new SpeechSynthesisUtterance(text);
  //   speech.lang = "en-US";
  //   speech.rate = 1;
  //   speech.pitch = 1;
  //   speech.onstart = () => setIsSpeaking(true);
  //   speech.onend = () => setIsSpeaking(false);

  //   window.speechSynthesis.speak(speech);
  // };

  return (
    <div className="InputBox">
      <input
        type="text"
        placeholder="Type a message..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyPress} // Allow Enter key
        className="ChatInput"
      />
      <SpeechButton setUserInput={setUserInput} />
      <button
        className={`read-aloud-button ${isSpeaking ? "speaking" : ""}`}
        onClick={() => (isSpeaking ? stop() : speak(response))}
      >
        {isSpeaking ? (
          <i className="fa-solid fa-volume-high"></i>
        ) : (
          <i className="fa-solid fa-volume-low"></i>
        )}
      </button>
      <button onClick={handleSendMessage} className="send-button">
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
}
