import express from "express";
import { 
  createExam, 
  getExams,      // ✅ FIXED: Changed from getAllExams to getExams
  getExamById, 
  deleteExam,
  updateExam 
} from "../controllers/examController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / Student Routes (Students can only see published/active exams)
router.get("/", protect, getExams); // ✅ FIXED: Use getExams here
router.get("/:id", protect, getExamById);

// Admin Only Routes
router.post("/", protect, authorize("admin"), createExam);
router.delete("/:id", protect, authorize("admin"), deleteExam);
router.put("/:id", protect, authorize("admin"), updateExam); 

export default router;