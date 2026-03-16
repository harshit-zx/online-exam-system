import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 overflow-hidden border-b border-slate-200/60">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] opacity-50"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-152 bg-linear-to-tr from-indigo-500/10 via-blue-500/10 to-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-5xl mx-auto text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm mb-8 shadow-sm hover:shadow-md transition-shadow">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          ExamPro 2.0 is now live — Smarter, Faster, Secure.
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
          The Future of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-blue-600 to-indigo-600 animate-gradient">
            Online Exams
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Secure online examinations with real-time grading, bank-grade
          anti-cheat protection, and powerful global analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
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
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-lg flex items-center justify-center gap-2 group"
              >
                Get Started for Free{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
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
      </motion.div>
    </section>
  );
};

export default HeroSection;
