import { createContext, useState, useContext } from "react";
import { useChat } from "./ChatContext";

const SpeechToTextContext = createContext();

export const SpeechToTextProvider = ({ children }) => {
  const [transcription, setTranscription] = useState(""); // Store speech-to-text output
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const { sendToAI } = useChat();

  const stopListening = () => {
    if (recognitionInstance) {
      // console.log("Transcription : ", transcription);
      // sendToCohere(transcription);
      sendToAI(transcription);
      setTranscription("");

      recognitionInstance.stop();
      console.log("Stopped listening.");
      setRecognitionInstance(null);
      setIsRecording(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = true; // Continuously listen until stopped automatically
    recognitionInstance.interimResults = true; // Get interim results while speaking

    recognitionInstance.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }

      // const transcript = event.results[0][0].transcript;
      //   console.log(transcript);
      setTranscription(transcript);
    };

    recognitionInstance.onerror = (event) => {
      // if (event.error === "aborted") {
      //   console.log(
      //     "Speech recognition was aborted due to a pause, restarting..."
      //   );
      //   recognitionInstance.stop();

      //   recognitionInstance.start();
      // } else {
      //   console.error("Speech Recognition Error: ", event.error);
      //   alert("Error with speech recognition: " + event.error);
      // }

      console.error("Speech Recognition Error:", event.error);
      alert("Speech recognition error: " + event.error);
    };

    recognitionInstance.onend = () => {
      // console.log("Speech recognition ended. Inside onend");
      // stopListening();

      if (isRecording) {
        console.log("Recognition ended, restarting...");
        recognitionInstance.start(); // safe auto-restart
      }
    };

    recognitionInstance.start();
    setRecognitionInstance(recognitionInstance); // Store recognition instance to stop later
    setIsRecording(true);
  };

  return (
    <SpeechToTextContext.Provider
      value={{
        transcription,
        isRecording,
        setIsRecording,
        setTranscription,
        stopListening,
        startListening,
      }}
    >
      {children}
    </SpeechToTextContext.Provider>
  );
};

export const speechToText = () => useContext(SpeechToTextContext);
