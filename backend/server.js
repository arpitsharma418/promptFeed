// Main server file - entry point for the backend
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ---- Middleware ----
// Allow requests from the frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// ---- Routes ----
const authRoutes = require("./routes/authRoutes");
const promptRoutes = require("./routes/promptRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/prompts", promptRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.json({ message: "Prompt Directory API is running!" });
});

// ---- Connect to MongoDB and Start Server ----
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
