import { createContext, useState, useContext } from "react";
import { useChat } from "./ChatContext";

const SpeechToTextContext = createContext();

export const SpeechToTextProvider = ({ children }) => {
  const [transcription, setTranscription] = useState(""); // Store speech-to-text output
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const { sendToAI } = useChat();

  // Function to send transcribed text to backend for AI response
  // const sendToCohere = async (text) => {
  //   if (!text.trim()) return;

  //   try {
  //     const res = await axios.post("http://localhost:5000/api/chat", {
  //       message: text, // Send transcribed speech as message
  //     });

  //     setResponse(res.data.response); // Store AI response
  //   } catch (error) {
  //     console.error("Error sending to Cohere:", error);
  //     setResponse("Error getting AI response."); // Display error if API fails
  //   }
  // };

  const stopListening = () => {
    if (recognitionInstance) {
      // console.log("Transcription : ", transcription);
      // sendToCohere(transcription);
      sendToAI(transcription);
      recognitionInstance.stop();
      console.log("Stopped listening.");
      setRecognitionInstance(null);
      setIsRecording(false);
    }
  };

  const startListening = () => {
    const recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new recognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = true; // Continuously listen until stopped automatically
    recognitionInstance.interimResults = true; // Get interim results while speaking

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      //   console.log(transcript);
      setTranscription(transcript);
    };

    recognitionInstance.onerror = (event) => {
      if (event.error === "aborted") {
        console.log(
          "Speech recognition was aborted due to a pause, restarting..."
        );
        // If the recognition was aborted due to pause, restart it
        recognitionInstance.stop();

        recognitionInstance.start();
      } else {
        console.error("Speech Recognition Error: ", event.error);
        alert("Error with speech recognition: " + event.error);
      }
    };

    recognitionInstance.onend = () => {
      console.log("Speech recognition ended. Inside onend");
      stopListening();
    };

    recognitionInstance.start();
    setRecognitionInstance(recognitionInstance); // Store recognition instance to stop later
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
