import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; 
import { User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck, GraduationCap } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleRole = (selectedRole) => {
    setForm({ ...form, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      
      // We pass the whole response data (which contains user and token) to our auth context
      login(res.data); 
      
      toast.success(
        `Welcome, ${form.name}! Account created as ${form.role.toUpperCase()}`,
      );

      // ROLE-BASED REDIRECT (Strict PDF Requirement 2)
      setTimeout(() => {
        if (form.role === "admin") {
          navigate("/admin/dashboard"); // Ensure these routes match your App.jsx
        } else {
          navigate("/student/dashboard");
        }
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration Failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans">
      

      <div className="bg-white shadow-[0_20px_50px_rgba(8,112,184,0.1)] rounded-[2.5rem] grid md:grid-cols-2 w-full max-w-6xl overflow-hidden border border-slate-100">
        
        {/* LEFT SIDE: DESIGN & INFO */}
        <div className="hidden md:flex bg-slate-900 text-white items-center justify-center p-16 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-indigo-900/50 to-slate-900 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-md">
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
                Smart Examination System
              </span>
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-[1.1]">
              Shape your <span className="text-indigo-400">Future</span> with us.
            </h2>

            <p className="text-slate-300 text-lg leading-relaxed mb-10">
              Join a community of educators and learners using the most secure exam environment.
            </p>

            <div className="space-y-4">
              {[
                { title: "Secure Exams", desc: "Anti-cheating browser lock", icon: <ShieldCheck size={20} /> },
                { title: "Instant Result", desc: "Get feedback in real-time", icon: <GraduationCap size={20} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: SIGNUP FORM */}
        <div className="p-10 md:p-20 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2">Join to begin your examination journey.</p>
          </div>

          {/* ROLE SELECTOR */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => toggleRole("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${
                form.role === "student" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
              }`}
            >
              <GraduationCap size={18} /> Student
            </button>
            <button
              type="button"
              onClick={() => toggleRole("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${
                form.role === "admin" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
              }`}
            >
              <ShieldCheck size={18} /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><User size={18} /></div>
                <input name="name" type="text" placeholder="John Doe" onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Mail size={18} /></div>
                <input name="email" type="email" placeholder="name@example.com" onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Lock size={18} /></div>
                <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 pl-11 pr-12 py-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account? <Link to="/login" className="text-indigo-600 font-extrabold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;