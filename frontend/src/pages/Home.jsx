import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ExamCard from "../components/ExamCard";
import {
  ShieldCheck,
  Zap,
  Award,
  ArrowRight,
  Users,
  Laptop,
  BarChart3,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  const sampleExams = [
    {
      _id: "demo1",
      title: "Full-Stack Web Development Basics",
      description:
        "Test your knowledge on React, Node.js, and MongoDB fundamentals. Perfect for beginners looking to validate their skills.",
      duration: 45,
      questions: new Array(20),
    },
    {
      _id: "demo2",
      title: "Advanced System Design",
      description:
        "Evaluate your understanding of scalable architectures, microservices, and database optimization techniques.",
      duration: 60,
      questions: new Array(15),
    },
    {
      _id: "demo3",
      title: "Data Structures & Algorithms",
      description:
        "A comprehensive assessment covering arrays, trees, graphs, and algorithmic time complexities.",
      duration: 90,
      questions: new Array(30),
    },
  ];

  const handleExamClick = () => {
    if (user) {
      navigate(dashboardPath);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* 1. HERO SECTION WITH MODERN DOT GRID */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 overflow-hidden border-b border-slate-200/60">
        {/* Background Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] opacity-50"></div>
        {/* Glowing Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-linear-to-tr from-indigo-500/10 via-blue-500/10 to-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm mb-8 shadow-sm hover:shadow-md transition-shadow">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ExamPro 2.0 is now live — Smarter, Faster, Secure.
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Master your skills with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-300% animate-gradient">
              ExamPro
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            The most reliable platform for online examinations. Experience
            bank-grade security, instant grading, and seamless assessment
            management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                to={dashboardPath}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/30 active:scale-95 text-lg flex items-center justify-center gap-2 group"
              >
                Enter Dashboard{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-lg flex items-center justify-center gap-2"
                >
                  Get Started for Free <ArrowRight size={20} />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 text-lg shadow-sm"
                >
                  Student Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF / STATS STRIP */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900">
                50K+
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Assessments Taken
              </p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900">
                99.9%
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Platform Uptime
              </p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900">
                100+
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Topics Covered
              </p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900">
                24/7
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Automated Grading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (NEW) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Simplicity First
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900">
              How ExamPro Works
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-indigo-100 via-indigo-300 to-indigo-100 z-0"></div>

            {[
              {
                step: "01",
                title: "Create an Account",
                desc: "Sign up in seconds. Admins can create exams, students can browse them.",
                icon: Users,
              },
              {
                step: "02",
                title: "Take Secure Exams",
                desc: "Experience our locked-down assessment environment to prove your skills.",
                icon: Laptop,
              },
              {
                step: "03",
                title: "Get Certified",
                desc: "Receive instant AI grading and download your high-resolution certificate.",
                icon: Award,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 bg-white rounded-full border-8 border-slate-50 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon size={32} className="text-indigo-600" />
                </div>
                <span className="text-indigo-600 font-black text-lg mb-2">
                  {item.step}
                </span>
                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-500 font-medium max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED EXAMS */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                Featured Assessments
              </h2>
              <p className="text-slate-500 font-medium text-lg">
                Preview our top-rated exams. Create an account to unlock full
                access, track your progress, and earn completion certificates.
              </p>
            </div>
            <Link
              to="/signup"
              className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-2 shrink-0 group"
            >
              View All Exams{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {sampleExams.map((exam) => (
              <div
                key={exam._id}
                className="h-full transition-transform hover:-translate-y-2 duration-300"
              >
                <ExamCard
                  exam={exam}
                  onClick={handleExamClick}
                  buttonText={user ? "Enter Dashboard" : "Login to Take Exam"}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BENTO BOX FEATURES STRIP */}
      <section className="py-24 bg-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Engineered for Integrity.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to run high-stakes online examinations
              securely and efficiently.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-linear-to-br from-indigo-900/50 to-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-slate-700/50 group hover:border-indigo-500/50 transition-colors">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Military-Grade Proctoring
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                Our strict anti-cheat engine detects tab switching, prevents
                copy-pasting, and locks down the environment to ensure absolute
                academic integrity.
              </p>
            </div>

            <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 group hover:border-amber-500/50 transition-colors">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Award size={28} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Verified Certificates
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Automatically generate gorgeous, high-resolution PDF
                certificates for students who pass their exams.
              </p>
            </div>

            <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 group hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Instant AI Grading
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Zero wait time. Students get their score immediately after
                submission with detailed analytics.
              </p>
            </div>

            <div className="md:col-span-2 bg-linear-to-br from-blue-900/40 to-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center gap-8 group hover:border-blue-500/50 transition-colors">
              <div className="flex-1">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 size={28} className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Deep Analytics
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Review question-by-question performance breakdowns to identify
                  strengths and areas for improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
