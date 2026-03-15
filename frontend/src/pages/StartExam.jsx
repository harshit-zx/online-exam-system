import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Timer from '../components/Timer';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const StartExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/exams/${examId}`);
        setExam(res.data.exam);
        setStartTime(Date.now());
      } catch (error) {
        console.error("Failed to fetch exam", error);
        // Handle error (e.g., show a message and redirect)
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  const handleAnswerSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000); // in seconds

    try {
      const payload = {
        examId,
        answers,
        timeTaken,
      };
      const res = await API.post('/results/submit', payload);
      // Redirect to a result page
      navigate(`/result/${res.data.resultId}`);
    } catch (error) {
      console.error("Failed to submit exam", error);
      // Handle submission error
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!exam) {
    return <div>Exam not found or failed to load.</div>;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <Timer duration={exam.duration} onTimeUp={handleSubmit} />
        </div>

        {/* Question Area */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="mb-4">
            <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
            <h2 className="text-xl font-semibold mt-1">{currentQuestion.questionText}</h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answers[currentQuestion._id] === option
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  value={option}
                  checked={answers[currentQuestion._id] === option}
                  onChange={() => handleAnswerSelect(currentQuestion._id, option)}
                  className="hidden"
                />
                <span className="font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-300 text-slate-800 rounded-lg font-semibold disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            Previous
          </button>
          
          {currentQuestionIndex === exam.questions.length - 1 ? (
             <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                Submit Exam
              </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
            >
              Next
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartExam;
