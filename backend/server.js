import express from "express";
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import promptRoutes from "./routes/promptRoutes.js";
import cookieParser from "cookie-parser";


dotenv.config();

// Dynamic CORS origin for production
const corsOrigin = process.env.NODE_ENV === "production" 
  ? process.env.FRONTEND_URL 
  : "http://localhost:5173";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/prompts", promptRoutes);

//test route
app.get("/", (req, res) => {
  res.json({ message: "PromptFeed API is working!" });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");

    app.listen(PORT, () => {
      console.log("Server started on port ", PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed: ", err.message);
    process.exit(1);
  });
