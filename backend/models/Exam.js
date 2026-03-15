import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, "Options are required"],
    validate: [arrayLimit, "A question must have at least 2 options"],
  },
  correctAnswer: {
    type: String,
    required: [true, "Correct answer is required"],
  },
  marks: {
    type: Number,
    default: 1,
  },
});

// Validator to ensure at least 2 options exist
function arrayLimit(val) {
  return val.length >= 2;
}

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Exam title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration in minutes is required"],
    },
    // ✅ NEW: Added allowedAttempts to enforce limits
    allowedAttempts: {
      type: Number,
      default: 1, 
      min: [1, "An exam must allow at least 1 attempt"],
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to your User model
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    preventTabSwitch: {
      type: Boolean,
      default: false,
    },
    disableCopyPaste: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

examSchema.pre("save", async function () {
  if (this.questions && this.questions.length > 0) {
    this.totalMarks = this.questions.reduce(
      (sum, q) => sum + (q.marks || 0),
      0,
    );
  }
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;