const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const app = express();

// Define allowed origins
const allowedOrigins = [
  "https://aichatbot03.netlify.app",
  "http://localhost:5173",
  "https://hoppscotch.io",
];

// const corsOptions = {
//   origin: allowedOrigins,
//   // origin: "*",
//   credentials: true, // Allow cookies (useful for authentication)
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
// };

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");

app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Speech-to-Text AI Chatbot Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening to port ${PORT}...`));
