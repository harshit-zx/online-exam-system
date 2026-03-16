import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ChevronLeft, AlertCircle, Rocket } from "lucide-react";
import { toast } from "react-hot-toast";

const NotFound = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5); // Increased to 5 for better UX

  useEffect(() => {
    toast.error("Lost in space? Redirecting you home...", {
      id: "404-toast",
      icon: "🚀",
      style: {
        borderRadius: '16px',
        background: '#1e293b',
        color: '#fff',
      },
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 overflow-hidden relative">
      {/* --- Animated Background Elements --- */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, y: Math.random() * 100 }}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1] 
            }}
            transition={{ 
              duration: Math.random() * 5 + 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 4 + 'px',
              height: Math.random() * 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full relative z-10"
      >
        {/* --- Main Glass Card --- */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-10 md:p-16 shadow-2xl text-center overflow-hidden">
          
          {/* Animated 404 Illustration */}
          <div className="relative mb-12">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <h1 className="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-white/20 select-none">
                404
              </h1>
            </motion.div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-indigo-500/30 rounded-full"
            />
            <Rocket className="absolute top-0 right-4 text-indigo-400 animate-bounce" size={32} />
          </div>

          <div className="space-y-4 mb-10">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Houston, we have a problem.
            </h2>
            <p className="text-slate-400 text-lg">
              The coordinates you entered don't exist in our system. 
              Let's get you back to base camp.
            </p>
          </div>

          {/* --- Action Buttons --- */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <Home size={20} />
              Return Home
            </Link>
            
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95"
            >
              <ChevronLeft size={20} />
              Go Back
            </button>
          </div>

          {/* --- Circular Redirect Timer --- */}
          <div className="mt-12 flex items-center justify-center gap-3 text-slate-500 text-sm font-medium">
            <div className="relative w-6 h-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  className="text-slate-800"
                />
                <motion.circle
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray="62.8"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 62.8 }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="text-indigo-500"
                />
              </svg>
            </div>
            Automatic redirection in <span className="text-white font-mono">{timeLeft}s</span>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest">
            <AlertCircle size={14} />
            Error Code: 0x404_NOT_FOUND
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;