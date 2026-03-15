import Result from "../models/Result.js";
import Exam from "../models/Exam.js";

// @desc    Submit an exam and calculate score
// @route   POST /api/results/submit
export const submitExam = async (req, res) => {
  try {
    const { examId, answers, timeTaken, warnings } = req.body;
    const userId = req.user._id;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    let score = 0;
    let totalMarks = 0;
    const processedAnswers = [];

    // 1. Calculate score and format answers array for the Schema
    exam.questions.forEach((question) => {
      totalMarks += question.marks || 0;
      const userAnswer = answers[question._id] || "Not Answered";
      
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) score += question.marks || 0;

      processedAnswers.push({
        questionId: question._id,
        submittedAnswer: userAnswer,
        correctAnswer: question.correctAnswer, 
        isCorrect: isCorrect
      });
    });

    // 2. Determine Status (Cheat Detection)
    let finalStatus = "Completed";
    if (warnings > 0) {
      finalStatus = "Flagged / Cheating Detected";
    }

    // 3. Find the 'in-progress' attempt created by startExamAttempt and update it
    const result = await Result.findOneAndUpdate(
      { user: userId, exam: examId, status: "in-progress" },
      {
        score,
        totalMarks,
        answers: processedAnswers,
        timeTaken,
        warnings: warnings || 0,
        status: finalStatus,
      },
      // ✅ FIXED WARNING: Changed 'new: true' to 'returnDocument: "after"'
      { returnDocument: 'after', upsert: true } 
    );

    res.status(201).json({
      message: warnings > 0 ? "Exam submitted with security warnings." : "Exam submitted successfully",
      score,
      totalMarks,
    });
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get logged-in user's results
// @route   GET /api/results/my-results
export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate("exam", "title")
      .sort("-createdAt");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all results (Admin)
// @route   GET /api/results/all
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("user", "name email")
      .populate("exam", "title")
      .sort("-createdAt");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get single result by ID
// @route   GET /api/results/:id
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("exam"); 

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    if (result.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this result" });
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Start or Resume an exam attempt
// @route   POST /api/results/start
export const startExamAttempt = async (req, res) => {
  try {
    const { examId } = req.body;
    
    // 1. Fetch the exam
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // 2. Look for an ALREADY ACTIVE session
    let activeAttempt = await Result.findOne({ 
      user: req.user._id, 
      exam: examId,
      status: 'in-progress'
    });

    if (activeAttempt) {
      return res.status(200).json({ success: true, startTime: activeAttempt.startTime });
    }

    // 3. Check completed attempts against the limit
    const completedAttemptsCount = await Result.countDocuments({
      user: req.user._id,
      exam: examId,
      status: { $ne: 'in-progress' }
    });

    if (completedAttemptsCount >= (exam.allowedAttempts || 1)) {
      return res.status(403).json({ 
        message: `Limit reached. You have used all ${exam.allowedAttempts || 1} attempt(s) for this exam.` 
      });
    }

    const calculatedTotalMarks = exam.questions.reduce((sum, q) => sum + (q.marks || 0), 0);

    // 5. Create a BRAND NEW attempt
    const newAttempt = await Result.create({
      user: req.user._id,
      exam: examId,
      startTime: new Date(),
      status: 'in-progress',
      answers: [],
      score: 0,
      totalMarks: calculatedTotalMarks, 
      warnings: 0   
    });

    res.status(200).json({ success: true, startTime: newAttempt.startTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete result
// @route   DELETE /api/results/:id
// @access  Private/Admin
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });

    await result.deleteOne();
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};