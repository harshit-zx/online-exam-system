import express from "express";
import { 
  startExamAttempt,
  submitExam, 
  getUserResults, 
  getAllResults,
  getResultById,
  deleteResult 
} from "../controllers/resultController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------------------------------------------------
// ⚠️ SPECIFIC ROUTES MUST GO FIRST
// ---------------------------------------------------

// @route   POST /api/results/start
router.post("/start", protect, startExamAttempt);

// @route   POST /api/results/submit
router.post("/submit", protect, submitExam);

// @route   GET /api/results/my-results
router.get("/my-results", protect, getUserResults);

// @route   GET /api/results/all (Admin Only)
router.get("/all", protect, authorize("admin"), getAllResults);


// ---------------------------------------------------
// ⚠️ DYNAMIC ROUTES (/:id) MUST GO LAST
// ---------------------------------------------------

// @route   GET /api/results/:id
router.get("/:id", protect, getResultById);

// @route   DELETE /api/results/:id (Admin Only)
router.delete("/:id", protect, authorize("admin"), deleteResult);


export default router;