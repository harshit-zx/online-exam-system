import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Clock, 
  Save, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateExam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    duration: 30,
    allowedAttempts: 1, // ✅ Added allowedAttempts to initial state
    preventTabSwitch: true,
    disableCopyPaste: true,
    isPublished: false,
    questions: [
      { questionText: "", options: ["", "", "", ""], correctAnswer: "", marks: 1 }
    ]
  });

  // ✅ FIXED: Enforces Numbers for number inputs so the database saves them correctly
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setExamData({ 
      ...examData, 
      [name]: type === "number" ? Number(value) : value 
    });
  };

  // Question Management Logic
  const addQuestion = () => {
    setExamData({
      ...examData,
      questions: [...examData.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "", marks: 1 }]
    });
  };

  const removeQuestion = (index) => {
    if (examData.questions.length === 1) {
      return toast.error("An exam must have at least one question.");
    }
    const updated = examData.questions.filter((_, i) => i !== index);
    setExamData({ ...examData, questions: updated });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[index][field] = value;
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setExamData({ ...examData, questions: updatedQuestions });
  };

  // Final Submission Logic (Handles both Save Draft and Publish)
  const handleSubmit = async (publishStatus) => {
    // Basic Validation
    if (!examData.title.trim()) return toast.error("Exam title is required");
    if (examData.questions.some(q => !q.questionText.trim() || !q.correctAnswer)) {
      return toast.error("Please complete all questions and select correct answers");
    }

    setLoading(true);
    try {
      const payload = { ...examData, isPublished: publishStatus };
      await API.post("/exams", payload);
      
      toast.success(publishStatus ? "Exam Published Successfully!" : "Exam Saved as Draft");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto pb-24">
        
        {/* TOP ACTION BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-sm font-bold mb-4 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Exam</h1>
            <p className="text-slate-500 mt-1">Configure automated evaluation & cheating prevention.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              <Save size={18} className="text-slate-400" />
              Save Draft
            </button>
            
            <button 
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              Publish Now
            </button>
          </div>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* SECTION 1: CORE DETAILS */}
          <div className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <FileText size={20} />
              </div>
              <h2 className="font-bold uppercase tracking-widest text-xs">General Configuration</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Exam Title</label>
                <input 
                  name="title" 
                  autoComplete="off"
                  value={examData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Final Term: Data Structures"
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Allowed Attempts Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  <ShieldAlert size={16} className="text-slate-400" /> Allowed Attempts
                </label>
                <input 
                  name="allowedAttempts" 
                  type="number"
                  min="1"
                  value={examData.allowedAttempts}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  <Clock size={16} className="text-slate-400" /> Duration (Mins)
                </label>
                <input 
                  name="duration" 
                  type="number"
                  min="1"
                  value={examData.duration}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-sm font-bold text-slate-700">Exam Instructions</label>
              <textarea 
                name="description" 
                rows="3"
                value={examData.description}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="List the rules for the students..."
              ></textarea>
            </div>
          </div>

          {/* SECTION 2: SECURITY CONTROLS */}
          <div className="bg-slate-900 p-8 rounded-4xl text-white shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 mb-6">
              <ShieldAlert size={20} />
              <h2 className="font-bold uppercase tracking-widest text-xs">Anti-Cheating Enforcement</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${examData.preventTabSwitch ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={examData.preventTabSwitch}
                    onChange={(e) => setExamData({...examData, preventTabSwitch: e.target.checked})}
                    className="w-5 h-5 accent-indigo-400"
                  />
                  <span className="font-medium">Tab Switching Protection</span>
                </div>
                <AlertCircle size={16} className="text-slate-500" />
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${examData.disableCopyPaste ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={examData.disableCopyPaste}
                    onChange={(e) => setExamData({...examData, disableCopyPaste: e.target.checked})}
                    className="w-5 h-5 accent-indigo-400"
                  />
                  <span className="font-medium">Disable Copy/Paste</span>
                </div>
                <AlertCircle size={16} className="text-slate-500" />
              </label>
            </div>
          </div>

          {/* SECTION 3: QUESTION BUILDER */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-bold text-slate-900">Questions List</h2>
              <button 
                type="button" 
                onClick={addQuestion}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 transition-colors"
              >
                <Plus size={18} /> Add New
              </button>
            </div>

            {examData.questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white p-6 md:p-8 rounded-4xl border border-slate-200 relative group transition-all hover:border-indigo-200">
                <button 
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={20} />
                </button>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Question {qIndex + 1}</span>
                    <input 
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                      placeholder="Type your question here..."
                      className="w-full text-xl font-bold border-b-2 border-slate-50 focus:border-indigo-500 outline-none pb-3 transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="relative group/opt">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 group-focus-within/opt:text-indigo-400">
                          {String.fromCharCode(65 + oIndex)}
                        </div>
                        <input 
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="w-full bg-slate-50 pl-10 pr-4 py-4 rounded-2xl text-sm font-medium border border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 pt-6 border-t border-slate-50">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Correct Answer</label>
                      <select 
                        value={q.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
                        className="w-full bg-slate-50 p-4 rounded-2xl outline-none border border-transparent focus:border-indigo-100 font-bold text-slate-700 cursor-pointer appearance-none"
                      >
                        <option value="">Choose the correct option...</option>
                        {q.options.map((opt, i) => (
                          <option key={i} value={opt}>{opt || `Empty Option ${i+1}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marks</label>
                      <input 
                        type="number"
                        min="1"
                        value={q.marks}
                        onChange={(e) => handleQuestionChange(qIndex, "marks", parseInt(e.target.value) || 0)}
                        className="w-full md:w-32 bg-slate-50 p-4 rounded-2xl outline-none border border-transparent focus:border-indigo-100 font-bold text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;