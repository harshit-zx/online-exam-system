import Exam from "../models/Exam.js";


// @desc    Create a new exam
// @route   POST /api/exams
export const createExam = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      duration, 
      allowedAttempts, // ✅ ADDED: Now extracts from req.body
      questions, 
      preventTabSwitch, 
      disableCopyPaste, 
      isPublished 
    } = req.body;

    const exam = await Exam.create({
      title,
      description,
      duration,
      allowedAttempts: allowedAttempts || 1, // ✅ ADDED: Saves to database
      questions,
      preventTabSwitch,
      disableCopyPaste,
      isPublished,
      createdBy: req.user._id, 
    });

    res.status(201).json({ success: true, exam });
  } catch (error) {
    console.error("CREATE EXAM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing exam
// @route   PUT /api/exams/:id
export const updateExam = async (req, res) => {
  try {
    // 1. Make sure allowedAttempts is destructured from req.body!
    const { 
      title, 
      description, 
      duration, 
      allowedAttempts, // ✅ THIS MUST BE HERE
      preventTabSwitch, 
      disableCopyPaste, 
      isPublished, 
      questions 
    } = req.body;

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // 2. Assign the new values to the exam document
    exam.title = title;
    exam.description = description;
    exam.duration = duration;
    exam.allowedAttempts = allowedAttempts || 1; // ✅ AND ASSIGNED HERE
    exam.preventTabSwitch = preventTabSwitch;
    exam.disableCopyPaste = disableCopyPaste;
    exam.isPublished = isPublished;
    exam.questions = questions;

    const updatedExam = await exam.save();

    res.json({ message: "Exam updated successfully", exam: updatedExam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all exams (Filtered by role)
// @route   GET /api/exams
export const getExams = async (req, res) => {
  try {
    let query = {};
    // Students only see published and active exams
    if (req.user.role !== 'admin') {
      query = { isPublished: true, isActive: true };
    }

    const exams = await Exam.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: exams.length,
      exams 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single exam by ID (SECURE)
// @route   GET /api/exams/:id
export const getExamById = async (req, res) => {
  try {
    // .lean() converts the Mongoose document to a plain JavaScript object
    // This allows us to easily delete properties from it before sending
    const exam = await Exam.findById(req.params.id).lean(); 

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // 🛡️ SECURITY FIX: Strip correct answers if user is a student
    if (req.user && req.user.role === 'student') {
      exam.questions.forEach(q => {
        delete q.correctAnswer;
      });
    }

    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    await exam.deleteOne();
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};