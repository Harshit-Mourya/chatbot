const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (who is chatting with AI)
    required: true, // User is required
  },
  message: {
    type: String,
    required: true, // Message content is required
  },
  sender: {
    type: String,
    enum: ["user", "ai"], // Can be 'user' or 'ai'
    required: true, // Sender is required
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date and time
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
