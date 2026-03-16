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
  Star,
  CheckCircle2,
  HelpCircle,
  Quote
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  // Dummy Data for Exams
  const sampleExams = [
    {
      _id: "demo1",
      title: "Full-Stack Web Development Basics",
      description: "Test your knowledge on React, Node.js, and MongoDB fundamentals. Perfect for beginners looking to validate their skills.",
      duration: 45,
      questions: new Array(20),
    },
    {
      _id: "demo2",
      title: "Advanced System Design",
      description: "Evaluate your understanding of scalable architectures, microservices, and database optimization techniques.",
      duration: 60,
      questions: new Array(15),
    },
    {
      _id: "demo3",
      title: "Data Structures & Algorithms",
      description: "A comprehensive assessment covering arrays, trees, graphs, and algorithmic time complexities.",
      duration: 90,
      questions: new Array(30),
    },
  ];

  // Dummy Data for FAQs
  const faqs = [
    { q: "Is the anti-cheat system really secure?", a: "Yes. Our engine detects tab-switching, prevents copy-pasting, and issues automatic warnings to ensure complete academic integrity." },
    { q: "Can I take exams on my mobile phone?", a: "Absolutely! The platform is 100% responsive, meaning you can take assessments seamlessly on desktops, tablets, or mobile devices." },
    { q: "How do I get my certificate?", a: "Once you achieve a passing score, a high-resolution PDF certificate is instantly generated and available for download in your Results dashboard." },
    { q: "What happens if my internet drops during an exam?", a: "We use local session storage to anchor your timer. If you disconnect or accidentally refresh, your timer and progress will pick right back up where you left off." }
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

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 overflow-hidden border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-blue-500/10 to-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm mb-8 shadow-sm hover:shadow-md transition-shadow">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ExamPro 2.0 is now live — Smarter, Faster, Secure.
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Master your skills with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 animate-gradient">
              ExamPro
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            The most reliable platform for online examinations. Experience
            bank-grade security, instant grading, and seamless assessment management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {user ? (
              <Link
                to={dashboardPath}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/30 active:scale-95 text-lg flex items-center justify-center gap-2 group"
              >
                Enter Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-lg flex items-center justify-center gap-2 group"
                >
                  Get Started for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
            <div className="flex -space-x-2 mr-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-indigo-${i}00 flex items-center justify-center text-xs text-white`}>
                   {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex text-amber-400"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
            <span>Trusted by 10,000+ students</span>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY LOGOS */}
      <section className="py-10 bg-white border-b border-slate-100 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Powering assessments for top institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
               {['TECHCORP', 'EDUSPHERE', 'ACADEMIA', 'NEXUS EDU', 'GLOBAL LEARN'].map((name, idx) => (
                  <span key={idx} className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">{name}</span>
               ))}
            </div>
         </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Simplicity First</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900">How ExamPro Works</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-300 to-indigo-100 z-0"></div>

            {[
              { step: "01", title: "Create an Account", desc: "Sign up in seconds. Admins can create exams, students can browse them.", icon: Users },
              { step: "02", title: "Take Secure Exams", desc: "Experience our locked-down assessment environment to prove your skills.", icon: Laptop },
              { step: "03", title: "Get Certified", desc: "Receive instant AI grading and download your high-resolution certificate.", icon: Award },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white rounded-full border-8 border-slate-50 shadow-xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  <item.icon size={32} className="text-indigo-600" />
                </div>
                <span className="text-indigo-600 font-black text-lg mb-2">{item.step}</span>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-500 font-medium max-w-xs">{item.desc}</p>
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
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Featured Assessments</h2>
              <p className="text-slate-500 font-medium text-lg">Preview our top-rated exams. Create an account to unlock full access, track your progress, and earn completion certificates.</p>
            </div>
            <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-2 shrink-0 group">
              View All Exams <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {sampleExams.map((exam) => (
              <div key={exam._id} className="h-full transition-transform hover:-translate-y-2 duration-300">
                <ExamCard exam={exam} onClick={handleExamClick} buttonText={user ? "Enter Dashboard" : "Login to Take Exam"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BENTO BOX FEATURES STRIP */}
      <section className="py-24 bg-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Engineered for Integrity.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to run high-stakes online examinations securely and efficiently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-900/50 to-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-slate-700/50 group hover:border-indigo-500/50 transition-colors">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Military-Grade Proctoring</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">Our strict anti-cheat engine detects tab switching, prevents copy-pasting, and locks down the environment to ensure absolute academic integrity.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 group hover:border-amber-500/50 transition-colors">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Award size={28} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verified Certificates</h3>
              <p className="text-slate-400 leading-relaxed">Automatically generate gorgeous, high-resolution PDF certificates for students who pass their exams.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 group hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant AI Grading</h3>
              <p className="text-slate-400 leading-relaxed">Zero wait time. Students get their score immediately after submission with detailed analytics.</p>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-blue-900/40 to-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-slate-700/50 group hover:border-blue-500/50 transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 size={28} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Deep Analytics</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">Review question-by-question performance breakdowns to identify strengths and areas for improvement globally.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h3 className="text-3xl md:text-4xl font-black text-slate-900">Loved by Admins & Students</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
               {[
                  { name: "Sarah J.", role: "University Professor", review: "The anti-cheat features are incredible. It completely eliminated the tab-switching issues we had during midterm evaluations." },
                  { name: "Michael T.", role: "Bootcamp Student", review: "The interface is so clean and distraction-free. Getting my certificate immediately as a PDF after passing felt incredibly rewarding." },
                  { name: "David L.", role: "HR Recruiter", review: "We use ExamPro to assess technical candidates. The instant analytics save our team dozens of hours of manual grading." }
               ].map((t, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative">
                     <Quote className="absolute top-6 right-8 text-indigo-100" size={40} />
                     <div className="flex text-amber-400 mb-4"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                     <p className="text-slate-600 font-medium mb-6 relative z-10">"{t.review}"</p>
                     <div>
                        <h5 className="font-bold text-slate-900">{t.name}</h5>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{t.role}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-24 bg-white">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 justify-center mb-12">
               <HelpCircle className="text-indigo-600" size={32} />
               <h3 className="text-3xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-6">
               {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                     <h4 className="font-bold text-slate-900 text-lg mb-2 flex items-start gap-2">
                        <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                        {faq.q}
                     </h4>
                     <p className="text-slate-500 font-medium pl-7">{faq.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 8. BOTTOM CTA */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to upgrade your assessments?</h2>
            <p className="text-indigo-100 text-xl font-medium mb-10">Join thousands of users who have already switched to ExamPro for a secure, seamless testing experience.</p>
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
