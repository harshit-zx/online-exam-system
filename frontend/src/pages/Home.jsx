import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { 
  ShieldCheck, 
  Zap, 
  Users, 
  Award, 
  BarChart3, 
  Star, 
  HelpCircle, 
  ArrowRight,
  Quote,
  CheckCircle2,
  ChevronDown,
  Trophy,
  Loader2
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ExamCard from "../components/ExamCard";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(null);

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : "/student/dashboard";

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Featured Exams
        const examRes = await API.get("/exams");
        setExams(examRes.data.exams ? examRes.data.exams.slice(0, 3) : examRes.data.slice(0, 3));

        // Fetch Leaderboard
        const resultRes = await API.get("/results/all");
        const top = resultRes.data
          .map(r => ({
            name: r.user?.name || "Anonymous",
            exam: r.exam?.title || "Assessment",
            percent: Math.round((r.score / r.totalMarks) * 100)
          }))
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 5);
          
        setLeaderboard(top);
      } catch(err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ---------------- EXAM CLICK ---------------- */
  const handleExamClick = (exam) => {
    if(user){
      navigate(`/exam/attempt/${exam._id}`);
    } else {
      navigate("/login");
    }
  };

  /* ---------------- STATIC DATA ---------------- */
  const faqs = [
    { q: "Is the exam environment secure?", a: "Yes. Our anti-cheat engine blocks tab switching, prevents copy-pasting, and issues automatic warnings to ensure complete academic integrity." },
    { q: "Can I take exams on mobile?", a: "Yes, the entire platform is fully responsive. You can take assessments on any device, anywhere." },
    { q: "How do certificates work?", a: "Once you achieve a passing score, a beautiful, high-resolution PDF certificate is instantly generated and available for download." },
    { q: "What if my internet disconnects?", a: "We use local session storage to anchor your timer. If you disconnect or accidentally refresh, your progress picks right back up where you left off." }
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "University Professor", text: "ExamPro completely transformed our digital examinations. The anti-cheat features are incredible." },
    { name: "Rahul Mehta", role: "Bootcamp Student", text: "The UI is super clean and distraction-free. Getting my certificate immediately as a PDF felt highly rewarding." },
    { name: "Michael Lee", role: "HR Recruiter", text: "We use ExamPro to evaluate developer candidates. The instant analytics save our team dozens of hours." },
    { name: "Emily Chen", role: "IT Instructor", text: "The reliability of the timers and the auto-submission features give me total peace of mind during high-stakes finals." }
  ];

  const categories = [
    "Web Development", "Data Structures", "System Design", "Cyber Security", 
    "Machine Learning", "DevOps", "Cloud Computing", "UI/UX"
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 overflow-hidden border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] opacity-50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-linear-to-tr from-indigo-500/10 via-blue-500/10 to-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

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
            Secure online examinations with real-time grading, bank-grade anti-cheat protection, and powerful global analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {user ? (
              <Link to={dashboardPath} className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/30 active:scale-95 text-lg flex items-center justify-center gap-2 group">
                Enter Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-lg flex items-center justify-center gap-2 group">
                  Get Started for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 text-lg shadow-sm">
                  Student Login
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* 2. STATS WITH COUNTUP */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
          {[
            { icon: Users, label: "Active Students", value: 10000, suffix: "+" },
            { icon: ShieldCheck, label: "Exams Conducted", value: 2000, suffix: "+" },
            { icon: BarChart3, label: "Average Pass Rate", value: 98, suffix: "%" },
            { icon: Award, label: "Partner Institutions", value: 150, suffix: "+" }
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center group">
              <s.icon className="text-indigo-500 mb-3 group-hover:scale-110 transition-transform duration-300" size={28} />
              <h3 className="text-3xl md:text-4xl font-black text-slate-900">
                <CountUp end={s.value} duration={2.5} />
                {s.suffix}
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED EXAMS (DYNAMIC) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Featured Assessments</h2>
              <p className="text-slate-500 font-medium text-lg">Preview our top-rated exams. Create an account to unlock full access and track your progress.</p>
            </div>
            <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-2 shrink-0 group">
              View All Exams <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                <p className="text-slate-500 font-bold tracking-wide">Loading latest exams...</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {exams.map((exam) => (
                <div key={exam._id} className="h-full transition-transform hover:-translate-y-2 duration-300">
                  <ExamCard exam={exam} onClick={() => handleExamClick(exam)} buttonText={user ? "Start Exam" : "Login to Take Exam"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. CATEGORIES & LEADERBOARD GRID */}
      <section className="py-24 bg-white border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-start">
            
            {/* Left: Popular Categories */}
            <div>
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">Popular Categories</h2>
               <div className="flex flex-wrap gap-3">
                  {categories.map((cat, i) => (
                     <span key={i} className="px-5 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer shadow-sm active:scale-95">
                        {cat}
                     </span>
                  ))}
               </div>
            </div>

            {/* Right: Leaderboard Widget */}
            <div className="bg-slate-900 rounded-4xl p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
               <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-3 bg-indigo-500/20 rounded-xl"><Trophy className="text-amber-400" size={24} /></div>
                  <h2 className="text-2xl font-black text-white">Global Top Performers</h2>
               </div>
               
               <div className="space-y-4 relative z-10">
                  {loading ? (
                     <div className="text-indigo-300 text-center py-10 animate-pulse font-bold">Fetching leaderboard...</div>
                  ) : leaderboard.length > 0 ? (
                     leaderboard.map((u, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
                           <div className="flex items-center gap-4">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-amber-400 text-amber-900' : i === 1 ? 'bg-slate-300 text-slate-800' : i === 2 ? 'bg-amber-700/80 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                 {i + 1}
                              </span>
                              <div>
                                 <p className="font-bold text-white leading-tight">{u.name}</p>
                                 <p className="text-xs font-medium text-slate-400 line-clamp-1">{u.exam}</p>
                              </div>
                           </div>
                           <span className="font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg">
                              {u.percent}%
                           </span>
                        </div>
                     ))
                  ) : (
                     <div className="text-slate-400 text-center py-10 font-medium">No results recorded yet.</div>
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* 5. PREMIUM BENTO FEATURES */}
      <section className="py-24 bg-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Engineered for Integrity.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to run high-stakes online examinations securely and efficiently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-linear-to-br from-indigo-900/50 to-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-slate-700/50 group hover:border-indigo-500/50 transition-colors">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6"><ShieldCheck size={28} className="text-indigo-400" /></div>
              <h3 className="text-2xl font-bold text-white mb-4">Military-Grade Proctoring</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">Our strict anti-cheat engine detects tab switching, prevents copy-pasting, and locks down the environment to ensure absolute academic integrity.</p>
            </div>

            <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 group hover:border-amber-500/50 transition-colors">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6"><Award size={28} className="text-amber-400" /></div>
              <h3 className="text-xl font-bold text-white mb-3">Verified Certificates</h3>
              <p className="text-slate-400 leading-relaxed">Automatically generate gorgeous, high-resolution PDF certificates for students who pass their exams.</p>
            </div>

            <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 group hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6"><Zap size={28} className="text-emerald-400" /></div>
              <h3 className="text-xl font-bold text-white mb-3">Instant AI Grading</h3>
              <p className="text-slate-400 leading-relaxed">Zero wait time. Students get their score immediately after submission with detailed analytics.</p>
            </div>

            <div className="md:col-span-2 bg-linear-to-br from-blue-900/40 to-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center gap-8 group hover:border-blue-500/50 transition-colors">
              <div className="flex-1">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6"><BarChart3 size={28} className="text-blue-400" /></div>
                <h3 className="text-2xl font-bold text-white mb-4">Deep Analytics</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">Review question-by-question performance breakdowns to identify strengths and areas for improvement globally.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SWIPER TESTIMONIALS */}
      <section className="py-24 bg-slate-50 border-b border-slate-100 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h3 className="text-3xl md:text-4xl font-black text-slate-900">Loved by Admins & Students</h3>
            </div>
            
            <Swiper 
              modules={[Autoplay, Pagination]}
              spaceBetween={30} 
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="pb-14"
            >
               {testimonials.map((t, idx) => (
                  <SwiperSlide key={idx} className="h-auto">
                     <div className="bg-white h-full p-8 rounded-4xl shadow-sm border border-slate-100 relative hover:-translate-y-2 transition-transform duration-300 cursor-grab active:cursor-grabbing">
                        <Quote className="absolute top-6 right-8 text-indigo-50" size={60} />
                        <div className="flex text-amber-400 mb-6 relative z-10"><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/></div>
                        <p className="text-slate-600 font-medium mb-8 relative z-10 text-lg leading-relaxed">"{t.text}"</p>
                        <div className="mt-auto relative z-10">
                           <h5 className="font-black text-slate-900">{t.name}</h5>
                           <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{t.role}</p>
                        </div>
                     </div>
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>
      </section>

      {/* 7. INTERACTIVE FAQ */}
      <section className="py-24 bg-white">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 justify-center mb-12">
               <HelpCircle className="text-indigo-600" size={36} />
               <h3 className="text-3xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-4">
               {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                     <button
                        onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                     >
                        <h4 className="font-bold text-slate-900 text-lg flex items-center gap-3">
                           <CheckCircle2 className={`shrink-0 transition-colors ${openFAQ === idx ? 'text-emerald-500' : 'text-slate-300'}`} size={22} />
                           {faq.q}
                        </h4>
                        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${openFAQ === idx ? 'rotate-180' : ''}`} size={20} />
                     </button>
                     <AnimatePresence>
                       {openFAQ === idx && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.3 }}
                           className="px-6 pb-6 pt-0"
                         >
                           <p className="text-slate-500 font-medium pl-8">{faq.a}</p>
                         </motion.div>
                       )}
                     </AnimatePresence>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 8. BOTTOM CTA */}
      <section className="py-28 bg-indigo-600 relative overflow-hidden text-center">
         <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-size-[20px_20px] opacity-30"></div>
         <div className="max-w-4xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">Ready to start learning?</h2>
            <p className="text-indigo-100 text-xl font-medium mb-10">Join thousands of students and educators already using ExamPro.</p>
            <Link to="/signup" className="inline-flex items-center justify-center px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl shadow-indigo-900/20 active:scale-95 text-lg group">
               Create Free Account <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;