import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Example of a protected route - verify yours follows this pattern
// Correct: authorize("admin") returns a function that Express can call.
router.get("/admin-check", protect, authorize("admin"), (req, res) => {
    res.json({ message: "You are an admin" });
});

export default router;