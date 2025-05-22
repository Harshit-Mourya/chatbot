const express = require("express");
const axios = require("axios");
const router = express.Router();

const Chat = require("../models/Chat");
const optionalAuth = require("../middlewares/optionalAuth");
const requireUser = require("../middlewares/requireUser");

// Cohere API key stored in .env file
const COHERE_API_KEY = process.env.COHERE_API_KEY;

// Route to handle chat requests
router.post("/", optionalAuth, async (req, res) => {
  const { message } = req.body; // Get message from request body
  const userId = req.user?.id; // only set if logged in

  console.log(message);
  console.log("userid: ", userId);
  if (!message) {
    return res.status(400).json({ error: "Message is required!" });
  }

  try {
    // Make request to Cohere API to generate response
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command-light", // Model for text generation
        prompt: message, // User's input message
        // max_tokens: 100, // You can adjust the max tokens as needed
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(response);

    // Send the AI response back to the client
    const aiResponse =
      response.data?.generations?.[0]?.text?.trim() || "No response from AI!";
    // console.log("AI response : ", aiResponse);

    // Save to DB only if logged in
    if (userId) {
      await Chat.create({ user: userId, message, sender: "user" });
      await Chat.create({ user: userId, message: aiResponse, sender: "ai" });
    }

    return res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error generating response:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while generating response." });
  }
});

// GET chat history
router.get("/history", optionalAuth, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.json([]); // Guest: return empty history
  }

  try {
    const chats = await Chat.find({ user: userId }).sort({ createdAt: 1 }); // oldest to newest
    const formatted = chats.map(({ message, sender }) => ({
      text: message,
      sender,
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ error: "Failed to fetch chat history." });
  }
});

router.delete("/clear", optionalAuth, requireUser, async (req, res) => {
  try {
    await Chat.deleteMany({ user: req.user.id });
    return res.json({ message: "Chat history cleared successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to clear chat history." });
  }
});

module.exports = router;
