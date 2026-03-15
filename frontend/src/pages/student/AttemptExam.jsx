import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";
import { Clock, ShieldAlert, AlertTriangle, CheckCircle2, Loader2, Info } from "lucide-react";

const AttemptExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [warnings, setWarnings] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // CRITICAL: Refs ensure our auto-submit functions always have the latest data
  const warningsRef = useRef(0);
  const answersRef = useRef({});
  const timeLeftRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const MAX_WARNINGS = 3;

  // Keep Refs synced with React State
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { isSubmittingRef.current = isSubmitting; }, [isSubmitting]);

  // 1. Initialize Exam and Timer
  useEffect(() => {
    const initializeExam = async () => {
      try {
        const { data: examData } = await API.get(`/exams/${id}`);
        setExam(examData.exam);
        
        // Register the attempt with the backend
        await API.post(`/results/start`, { examId: id });
        
        // TIMER FIX: Use sessionStorage to prevent Server/Client clock drift
        let localStartTime = sessionStorage.getItem(`exam_${id}_start`);
        if (!localStartTime) {
          localStartTime = Date.now();
          sessionStorage.setItem(`exam_${id}_start`, localStartTime);
        }
        
        const elapsedSeconds = Math.floor((Date.now() - parseInt(localStartTime)) / 1000);
        const durationSeconds = examData.exam.duration * 60;
        const remainingSeconds = durationSeconds - elapsedSeconds;

        if (remainingSeconds <= 0) {
          toast.error("Time has expired for this exam.");
          submitExam(answersRef.current, true, durationSeconds);
        } else {
          setTimeLeft(remainingSeconds);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not load exam or limit reached.");
        navigate("/student/dashboard");
      } finally {
        setLoading(false);
      }
    };

    initializeExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  // 2. Submission Logic
  const submitExam = useCallback(async (currentAnswers, isAuto = false, timeTaken) => {
    if (isSubmittingRef.current) return; 
    
    setIsSubmitting(true);
    isSubmittingRef.current = true;
    
    try {
      await API.post("/results/submit", { 
        examId: id, 
        answers: currentAnswers, // The backend expects an object like { "questionId": "Option A" }
        timeTaken: timeTaken || 0,
        warnings: warningsRef.current
      });
      
      // Clear the local timer so they start fresh if they are allowed another attempt later
      sessionStorage.removeItem(`exam_${id}_start`);
      
      toast.success(isAuto ? "Time expired! Exam auto-submitted." : "Exam submitted successfully!");
      navigate("/student/allresults", { replace: true }); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed. Please contact admin.");
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  }, [id, navigate]);

  // 3. Timer Countdown Effect
  useEffect(() => {
    if (timeLeft === null || isSubmitting) return;
    
    if (timeLeft <= 0) {
      submitExam(answersRef.current, true, exam.duration * 60);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting, exam, submitExam]);

  // 4. Anti-Cheating Features
  useEffect(() => {
    if (!exam) return;

    const handleVisibilityChange = () => {
      if (document.hidden && exam.preventTabSwitch && !isSubmittingRef.current) {
        const newWarnings = warningsRef.current + 1;
        warningsRef.current = newWarnings;
        setWarnings(newWarnings);
        
        if (newWarnings >= MAX_WARNINGS) {
          toast.error("Exam terminated due to multiple security violations!");
          const taken = (exam.duration * 60) - (timeLeftRef.current || 0);
          submitExam(answersRef.current, true, taken);
        } else {
          toast.error(`Warning ${newWarnings}/${MAX_WARNINGS}: Please do not switch tabs!`, {
            icon: '⚠️',
            duration: 5000
          });
        }
      }
    };

    const preventAction = (e) => {
      if (exam.disableCopyPaste && !isSubmittingRef.current) {
        e.preventDefault();
        toast.error("Action disabled during exam", { id: 'security' });
      }
    };

    if (exam.preventTabSwitch) document.addEventListener("visibilitychange", handleVisibilityChange);
    if (exam.disableCopyPaste) {
      document.addEventListener("copy", preventAction);
      document.addEventListener("paste", preventAction);
      document.addEventListener("contextmenu", preventAction);
    }
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("paste", preventAction);
      document.removeEventListener("contextmenu", preventAction);
    };
  }, [exam, submitExam]);

  // ✅ ANSWER FIX: Directly triggers state update on div click
  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleManualSubmit = () => {
    if (window.confirm("Are you sure you want to submit? You cannot change your answers after submission.")) {
      const timeTaken = (exam.duration * 60) - (timeLeftRef.current || 0);
      submitExam(answersRef.current, false, timeTaken);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold tracking-wide animate-pulse">Initializing Secure Environment...</p>
      </div>
    );
  }

  if (!exam) return null;

  // Formatting Timer
  const minutes = Math.floor((timeLeft || 0) / 60);
  const seconds = (timeLeft || 0) % 60;
  const isTimeLow = timeLeft < 300; // Under 5 minutes

  // Progress calculations
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam.questions?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 select-none pb-24 font-sans">
      
      {/* SECURE HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 hidden md:block">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 md:text-lg leading-tight line-clamp-1 max-w-50 md:max-w-md">{exam.title}</h1>
            <p className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Secure Session
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Answered</span>
            <span className="text-sm font-black text-indigo-600">{answeredCount} / {totalQuestions}</span>
          </div>

          <div className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-2xl font-mono font-bold text-lg md:text-xl shadow-sm border transition-colors ${
            isTimeLow ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <Clock size={20} className={isTimeLow ? "text-red-500" : "text-slate-400"} />
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* WARNING NOTIFICATION AREA */}
      {warnings > 0 && (
        <div className="max-w-4xl mx-auto mt-6 px-4 md:px-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-start gap-4 shadow-sm">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800">Security Warning ({warnings}/{MAX_WARNINGS})</h4>
              <p className="text-sm mt-1 font-medium">We detected a tab switch or window focus change. If you exceed the maximum warnings, your exam will be automatically terminated.</p>
            </div>
          </div>
        </div>
      )}

      {/* EXAM INSTRUCTIONS */}
      {exam.description && (
        <div className="max-w-4xl mx-auto mt-8 px-4 md:px-6">
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex items-start gap-4">
            <Info className="text-indigo-500 shrink-0 mt-1" />
            <p className="text-sm text-indigo-900 font-medium leading-relaxed">{exam.description}</p>
          </div>
        </div>
      )}

      {/* QUESTIONS LIST */}
      <div className="max-w-4xl mx-auto mt-8 px-4 md:px-6 space-y-8">
        {exam.questions.map((q, idx) => {
          const qId = q._id || q.id; // Safely gets ID regardless of backend naming
          
          return (
            <div key={qId} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              
              <div className="flex justify-between items-center mb-6">
                <span className="bg-slate-50 text-slate-500 border border-slate-100 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-xl">
                  Question {idx + 1}
                </span>
                <span className="text-sm font-bold text-slate-400">
                  {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
                {q.questionText}
              </h3>
              
              <div className="grid gap-3">
                {q.options.map((opt, oIdx) => {
                  const isSelected = answers[qId] === opt;
                  
                  return (
                    <div 
                      key={oIdx} 
                      onClick={() => handleOptionSelect(qId, opt)}
                      className={`flex items-center p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected 
                        ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                        : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${
                        isSelected ? 'border-indigo-600 bg-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                      </div>
                      
                      <span className={`font-medium text-base md:text-lg leading-snug ${isSelected ? 'text-indigo-900 font-bold' : 'text-slate-700'}`}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="max-w-4xl mx-auto mt-12 px-4 md:px-6">
        <button 
          onClick={handleManualSubmit}
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-5 rounded-4xl font-black text-xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <><CheckCircle2 size={24} /> Final Submit Assessment</>
          )}
        </button>
      </div>

    </div>
  );
};

export default AttemptExam;