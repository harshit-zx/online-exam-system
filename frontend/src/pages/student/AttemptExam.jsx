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

  const warningsRef = useRef(0);
  const answersRef = useRef({});
  const timeLeftRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const fullscreenRef = useRef(false);

  const MAX_WARNINGS = 3;

  useEffect(() => { answersRef.current = answers }, [answers]);
  useEffect(() => { timeLeftRef.current = timeLeft }, [timeLeft]);
  useEffect(() => { isSubmittingRef.current = isSubmitting }, [isSubmitting]);

  // ================= INITIALIZE EXAM =================

  useEffect(() => {

    const initializeExam = async () => {

      try {

        const { data } = await API.get(`/exams/${id}`);
        setExam(data.exam);

        await API.post("/results/start", { examId: id });

        // FULLSCREEN
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          fullscreenRef.current = true;
        }

        let start = sessionStorage.getItem(`exam_${id}_start`);

        if (!start) {
          start = Date.now();
          sessionStorage.setItem(`exam_${id}_start`, start);
        }

        const elapsed = Math.floor((Date.now() - start) / 1000);
        const duration = data.exam.duration * 60;
        const remaining = duration - elapsed;

        if (remaining <= 0) {

          toast.error("Time expired");

          submitExam(answersRef.current, true, duration);

        } else {

          setTimeLeft(remaining);

        }

      } catch (err) {

        toast.error("Cannot load exam");
        navigate("/student/dashboard");

      } finally {

        setLoading(false);

      }

    };

    initializeExam();

  }, [id, navigate]);

  // ================= SUBMIT EXAM =================

  const submitExam = useCallback(async (currentAnswers, auto = false, timeTaken) => {

    if (isSubmittingRef.current) return;

    setIsSubmitting(true);
    isSubmittingRef.current = true;

    try {

      await API.post("/results/submit", {
        examId: id,
        answers: currentAnswers,
        warnings: warningsRef.current,
        timeTaken
      });

      sessionStorage.removeItem(`exam_${id}_start`);

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      toast.success(auto ? "Exam auto submitted" : "Exam submitted");

      navigate("/student/allresults");

    } catch {

      toast.error("Submission failed");

      setIsSubmitting(false);
      isSubmittingRef.current = false;

    }

  }, [id, navigate]);

  // ================= TIMER =================

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

  }, [timeLeft, exam, isSubmitting, submitExam]);

  // ================= TAB SWITCH DETECTION =================

  useEffect(() => {

    const handleVisibility = () => {

      if (document.hidden && !isSubmittingRef.current) {

        registerWarning("Tab switch detected");

      }

    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => document.removeEventListener("visibilitychange", handleVisibility);

  }, []);

  // ================= WINDOW BLUR =================

  useEffect(() => {

    const handleBlur = () => {

      if (!isSubmittingRef.current) {

        registerWarning("Window focus lost");

      }

    };

    window.addEventListener("blur", handleBlur);

    return () => window.removeEventListener("blur", handleBlur);

  }, []);

  // ================= FULLSCREEN EXIT =================

  useEffect(() => {

    const handleFullscreenExit = () => {

      if (!document.fullscreenElement && fullscreenRef.current && !isSubmittingRef.current) {

        registerWarning("Exited fullscreen");

        document.documentElement.requestFullscreen();

      }

    };

    document.addEventListener("fullscreenchange", handleFullscreenExit);

    return () => document.removeEventListener("fullscreenchange", handleFullscreenExit);

  }, []);

  // ================= KEYBOARD BLOCK =================

  useEffect(() => {

    const blockKeys = (e) => {

      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "C") ||
        (e.ctrlKey && e.key === "V") ||
        (e.ctrlKey && e.key === "W") ||
        e.altKey
      ) {

        e.preventDefault();

        toast.error("Keyboard shortcut blocked");

      }

    };

    window.addEventListener("keydown", blockKeys);

    return () => window.removeEventListener("keydown", blockKeys);

  }, []);

  // ================= DEVTOOLS DETECTION =================

  useEffect(() => {

    const detectDevTools = () => {

      const threshold = 160;

      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {

        registerWarning("Developer tools detected");

      }

    };

    const interval = setInterval(detectDevTools, 2000);

    return () => clearInterval(interval);

  }, []);

  // ================= COPY / RIGHT CLICK BLOCK =================

  useEffect(() => {

    const prevent = (e) => e.preventDefault();

    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("contextmenu", prevent);

    return () => {

      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("contextmenu", prevent);

    };

  }, []);

  // ================= WARNING SYSTEM =================

  const registerWarning = (message) => {

    const newWarnings = warningsRef.current + 1;

    warningsRef.current = newWarnings;

    setWarnings(newWarnings);

    if (newWarnings >= MAX_WARNINGS) {

      toast.error("Exam terminated due to cheating");

      const taken = (exam.duration * 60) - (timeLeftRef.current || 0);

      submitExam(answersRef.current, true, taken);

    } else {

      toast.error(`Warning ${newWarnings}/${MAX_WARNINGS}: ${message}`);

    }

  };

  // ================= ANSWER SELECT =================

  const handleOptionSelect = (qId, option) => {

    setAnswers(prev => ({
      ...prev,
      [qId]: option
    }));

  };

  // ================= MANUAL SUBMIT =================

  const handleManualSubmit = () => {

    if (window.confirm("Submit exam?")) {

      const taken = (exam.duration * 60) - (timeLeftRef.current || 0);

      submitExam(answersRef.current, false, taken);

    }

  };

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <Loader2 className="animate-spin text-indigo-600" size={48} />

      </div>

    );

  }

  if (!exam) return null;

  const minutes = Math.floor((timeLeft || 0) / 60);
  const seconds = (timeLeft || 0) % 60;

  return (

    <div className="min-h-screen bg-slate-50 pb-24">

      {/* HEADER */}

      <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">

        <h1 className="font-bold text-lg">{exam.title}</h1>

        <div className="font-mono font-bold text-lg">

          <Clock className="inline mr-2" size={18} />

          {String(minutes).padStart(2,"0")}:{String(seconds).padStart(2,"0")}

        </div>

      </div>

      {/* QUESTIONS */}

      <div className="max-w-4xl mx-auto mt-8 space-y-8 px-6">

        {exam.questions.map((q, idx) => {

          const qId = q._id;

          return (

            <div key={qId} className="bg-white p-8 rounded-3xl shadow">

              <h3 className="font-bold text-xl mb-6">

                Question {idx+1}. {q.questionText}

              </h3>

              <div className="space-y-3">

                {q.options.map((opt,i)=>{

                  const selected = answers[qId] === opt;

                  return(

                    <div
                      key={i}
                      onClick={()=>handleOptionSelect(qId,opt)}
                      className={`p-4 rounded-xl border cursor-pointer ${
                        selected
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200"
                      }`}
                    >

                      {opt}

                    </div>

                  )

                })}

              </div>

            </div>

          )

        })}

      </div>

      {/* SUBMIT */}

      <div className="max-w-4xl mx-auto mt-10 px-6">

        <button
          onClick={handleManualSubmit}
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold text-lg flex justify-center items-center gap-3"
        >

          {isSubmitting
            ? <Loader2 className="animate-spin"/>
            : <><CheckCircle2/> Submit Exam</>
          }

        </button>

      </div>

    </div>

  );

};

export default AttemptExam;
