import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import { connect } from "mongoose";
import authRouter from "./routes/authRoutes.js";
import contentRouter from "./routes/contentRoutes.js";
import seminarRouter from "./routes/seminarRoutes.js";
import doubtRouter from "./routes/doubtRoutes.js";
import responseRouter from "./routes/responseRoutes.js";
import { createTransport } from "nodemailer";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, ".env") });

console.log("Environment check:");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);

const app = express();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("ERROR: MONGO_URI is not defined in environment variables!");
  console.error(
    "Please set MONGO_URI in your .env file or Vercel environment variables"
  );
}

console.log(
  "Using MongoDB URI:",
  mongoUri?.includes("mongodb+srv") ? "Atlas Cloud Database" : "Local Database"
);

connect(mongoUri)
  .then(() => {
    console.log("MongoDB Connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
    console.log("Server will continue without database connection");
  });

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:5000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.includes("vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(json());

app.use((req, res, next) => {
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api/seminars", seminarRouter);
app.use("/api/doubts", doubtRouter);
app.use("/api/responses", responseRouter);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PhilosophyHub API is running!",
    version: "1.0.0",
    endpoints: {
      test: "/api/test",
      auth: "/api/auth",
      content: "/api/content",
      seminars: "/api/seminars",
      doubts: "/api/doubts",
      responses: "/api/responses",
    },
  });
});

// Test route
app.get("/api/test", (req, res) => {
  console.log("Test route called");
  res.json({
    success: true,
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
    env: {
      mongoExists: !!process.env.MONGO_URI,
      jwtExists: !!process.env.JWT_SECRET,
      port: process.env.PORT,
      nodeEnv: process.env.NODE_ENV,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
