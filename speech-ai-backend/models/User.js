const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date when the user is created
  },
  isActive: {
    type: Boolean,
    default: true, // By default, the account is active
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
