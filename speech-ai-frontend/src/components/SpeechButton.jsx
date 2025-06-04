import React, { useState, useContext, useEffect } from "react";
import { speechToText } from "../context/SpeechToTextContext";
import "./SpeechButton.css";

const SpeechButton = ({ setUserInput }) => {
  const {
    isRecording,
    setIsRecording,
    startListening,
    stopListening,
    transcription,
    setTranscription,
  } = speechToText();

  useEffect(() => {
    if (isRecording && transcription) {
      setUserInput(transcription);
    }
  }, [transcription, setUserInput, isRecording]);

  const clearTranscription = () => {
    setTranscription(""); // Clear transcription manually
    setUserInput(""); // Clear input box
  };

  // Function to start or stop listening
  const toggleRecording = () => {
    if (
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (!isRecording) {
      startListening();
    } else {
      stopListening();
      clearTranscription();
    }

    setIsRecording(!isRecording);
  };

  return (
    <button
      onClick={toggleRecording}
      className={`speech-button ${isRecording ? "active" : ""}`}
    >
      {isRecording ? (
        <i className="fa-solid fa-microphone"></i>
      ) : (
        <i className="fa-solid fa-microphone-lines"></i>
      )}
    </button>
  );
};

export default SpeechButton;
