import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Layout,
  LogOut,
  Loader2,
  AlertCircle,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ExamCard from "../components/ExamCard";
import Navbar from "../components/Navbar";

const StudentDashboard = () => {
  const [availableExams, setAvailableExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Available Exams
        const examRes = await API.get("/exams");
        if (examRes.data && examRes.data.exams) {
          setAvailableExams(examRes.data.exams);
        } else {
          setAvailableExams(Array.isArray(examRes.data) ? examRes.data : []);
        }

        // 2. Fetch User's Results (By Auth ID)
        const resultRes = await API.get("/results/my-results");
        setRecentResults(resultRes.data || []);
      } catch (err) {
        setError(
          "Could not load dashboard data. Please ensure you are logged in.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleExamClick = (examId) => {
    navigate(`/exam/attempt/${examId}`);
  };

  // Helper function to calculate attempts taken vs allowed
  const getAttemptsInfo = (examId, allowed) => {
    const attemptsTaken = recentResults.filter(
      (r) => r.exam?._id === examId,
    ).length;
    const remaining = allowed - attemptsTaken;
    return { taken: attemptsTaken, remaining: Math.max(0, remaining) };
  };

  return (
    <div className="s">
      <Navbar/>
      <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 hidden lg:flex flex-col text-white p-6 sticky top-0 h-screen shadow-2xl">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/40">
              <Layout size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">ExamPro</span>
          </div>

          <nav className="space-y-2 flex-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
              <BookOpen size={20} /> Dashboard
            </button>
            <button
              onClick={() => navigate("/student/allresults")}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl font-bold transition-all"
            >
              <FileText size={20} /> My Results
            </button>
          </nav>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl font-bold transition-all mt-auto"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto">
          {/* HEADER */}
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.name || "Student"}! 👋
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Ready to excel in your assessments today?
              </p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 px-4 w-max">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-lg border border-indigo-200">
                {user?.name?.charAt(0) || "S"}
              </div>
              <div className="text-sm pr-2">
                <p className="font-bold text-slate-800 leading-none">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Student Account
                </p>
              </div>
            </div>
          </header>

          {/* EXAM SECTION */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                Available Assessments
              </h2>
              <span className="text-xs font-black text-slate-500 bg-slate-200/50 px-4 py-1.5 rounded-full uppercase tracking-widest hidden sm:inline-block">
                {availableExams.length} Exams Found
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <Loader2
                  className="animate-spin text-indigo-500 mb-4"
                  size={40}
                />
                <p className="text-slate-500 font-bold tracking-wide">
                  Fetching your dashboard...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h3 className="text-red-900 font-black text-xl mb-2">
                  {error}
                </h3>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
                >
                  Retry Connection
                </button>
              </div>
            ) : availableExams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                {availableExams.map((exam) => {
                  const { remaining } = getAttemptsInfo(
                    exam._id,
                    exam.allowedAttempts || 1,
                  );
                  const isLocked = remaining <= 0;

                  return (
                    // ✅ FIX 1: Added h-full and flex flex-col to prevent grid squashing/overlapping
                    <div
                      key={exam._id}
                      className="relative h-full flex flex-col transition-transform hover:-translate-y-1 duration-300"
                    >
                      <ExamCard
                        exam={exam}
                        onClick={
                          isLocked
                            ? () => toast.error("No attempts remaining")
                            : handleExamClick
                        }
                        buttonText={isLocked ? "Limit Reached" : "Enter Exam"}
                      />

                      {/* ✅ FIX 2: Moved badge to top-center (left-1/2 -translate-x-1/2) so it NEVER overlaps the inner ExamCard badges! */}
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border backdrop-blur-md shadow-sm ${
                            isLocked
                              ? "bg-red-50/95 text-red-600 border-red-100"
                              : remaining === 1
                                ? "bg-amber-50/95 text-amber-600 border-amber-100"
                                : "bg-indigo-50/95 text-indigo-600 border-indigo-100"
                          }`}
                        >
                          {remaining} {remaining === 1 ? "Attempt" : "Attempts"}{" "}
                          Left
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-10 sm:p-20 text-center border border-dashed border-slate-200 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <FileText size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">
                  No Exams Assigned
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">
                  You don't have any pending assessments right now. Check back
                  later!
                </p>
              </div>
            )}
          </section>

          {/* RECENT RESULTS PREVIEW */}
          <section className="mt-12 bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
              <h2 className="text-2xl font-black text-slate-800">
                Recent Activity
              </h2>
              <button
                onClick={() => navigate("/student/allresults")}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
              >
                View All
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
              </div>
            ) : recentResults.length > 0 ? (
              <div className="grid gap-4">
                {recentResults.slice(0, 3).map((result) => {
                  const percentage =
                    result.totalMarks > 0
                      ? (result.score / result.totalMarks) * 100
                      : 0;
                  const isPassing = percentage >= 40;

                  return (
                    // ✅ FIX 3: Changed from 'flex items-center justify-between' to 'flex flex-col sm:flex-row' to fix mobile overlapping
                    <div
                      key={result._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all cursor-pointer group gap-4"
                      onClick={() => navigate(`/results/${result._id}`)}
                    >
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div
                          className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-xl shadow-sm ${isPassing ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
                        >
                          <Award size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base sm:text-lg line-clamp-2 sm:line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {result.exam?.title || "Completed Assessment"}
                          </h4>
                          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                            {new Date(result.createdAt).toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0 bg-white px-5 py-3 rounded-xl border border-slate-100 shadow-sm w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest sm:hidden">
                          Final Score
                        </p>
                        <div>
                          <p
                            className={`text-xl font-black leading-none ${isPassing ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {result.score} / {result.totalMarks}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 hidden sm:block">
                            Final Score
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Award size={32} />
                </div>
                <p className="text-slate-500 font-bold text-lg mb-1">
                  No Completed Exams
                </p>
                <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">
                  Your automatic evaluation results will appear here after
                  submission.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
