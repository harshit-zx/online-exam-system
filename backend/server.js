import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect database
connectDB();

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",                 // For local development
    "https://exampro-yqyt.onrender.com"      // For live production
  ],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Online Examination API Running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);

// ✅ FIXED 404 handler for Express 5.0 / path-to-regexp compatibility
// Use :anyName followed by the wildcard in parentheses
// app.all('/:pathMatch(*)', (req, res) => {
//   res.status(404).json({ message: `Route ${req.originalUrl} not found` });
// });

// 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
