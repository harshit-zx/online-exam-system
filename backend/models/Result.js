import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  timeTaken: { type: String }, 
  status: { type: String, default: "Completed" },
  answers: [
    {
      questionId: String,
      submittedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
    }
  ],
  // Track total number of violations
  warnings: {
    type: Number,
    default: 0
  },
  // ✅ NEW: Store the specific CAUSE of cheating
  cheatingLogs: [
    {
      reason: String, // e.g., "Tab Switched", "Copy-Paste Attempt"
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Result", resultSchema);