import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();
  const { scrollY } = useScroll();

  // Parallax effect for background elements
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 px-4 overflow-hidden bg-slate-50">
      {/* --- Dynamic Background Effects --- */}
      <div className="absolute inset-0 z-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Floating Orbs */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-[10%] w-72 h-72 bg-indigo-400/20 rounded-full blur-[120px]"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto text-center relative z-10"
      >
        {/* --- Top Badge --- */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          ExamPro 2.0: The Gold Standard in Assessment
        </motion.div>

        {/* --- Animated Headline --- */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 tracking-tight mb-8 leading-[0.9]"
        >
          Master Your <br />
          <span className="relative inline-block mt-2">
            <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-blue-500 to-purple-600">
              Future.
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-2 left-0 h-3 bg-indigo-100 -z-10"
            />
          </span>
        </motion.h1>

        {/* --- Description --- */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 font-medium leading-relaxed px-4"
        >
          Secure examinations powered by AI. Experience
          <span className="text-slate-900 font-bold">
            {" "}
            real-time proctoring
          </span>{" "}
          and
          <span className="text-slate-900 font-bold">
            {" "}
            instant global insights
          </span>{" "}
          in one unified platform.
        </motion.p>

        {/* --- Action Buttons --- */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          {user ? (
            <Link
              to={dashboardPath}
              className="group relative px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20"
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2 text-lg">
                Enter Dashboard{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/25 active:scale-95 text-lg flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-200 hover:border-indigo-600 transition-all active:scale-95 text-lg"
              >
                Student Login
              </Link>
            </>
          )}
        </motion.div>

        {/* --- Trust Markers --- */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-slate-200 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-slate-500 font-semibold">
            <ShieldCheck className="text-indigo-500" size={20} />
            <span>ISO Certified</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-500 font-semibold">
            <Zap className="text-amber-500" size={20} />
            <span>Zero Latency</span>
          </div>
          <div className="hidden md:flex items-center justify-center gap-2 text-slate-500 font-semibold">
            <Globe className="text-blue-500" size={20} />
            <span>Global Analytics</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
