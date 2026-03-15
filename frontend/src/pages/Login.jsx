import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  LogIn,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      // Use context for auth state (persistence handled there)
      login(res.data);

      toast.success(`Welcome back, ${res.data.user.name}!`);

      // ROLE-BASED REDIRECT
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans">
      

      <div className="bg-white shadow-[0_20px_50px_rgba(8,112,184,0.1)]rounded-[2.5rem] grid md:grid-cols-2 w-full max-w-6xl overflow-hidden border border-slate-100">
        {/* LEFT SIDE: DESIGN & BRANDING (Reversed from Signup for Visual Variety) */}
        <div className="hidden md:flex bg-linear-to-br from-indigo-600 via-blue-600 to-indigo-800 text-white items-center justify-center p-16 relative">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg
              className="absolute top-0 right-0"
              width="400"
              height="400"
              viewBox="0 0 400 400"
              fill="none"
            >
              <circle cx="400" cy="0" r="400" stroke="white" strokeWidth="2" />
              <circle cx="400" cy="0" r="300" stroke="white" strokeWidth="2" />
              <circle cx="400" cy="0" r="200" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          <div className="relative z-10 max-w-md text-center">
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
              <ShieldCheck size={40} className="text-indigo-100" />
            </div>

            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Ready to excel?
            </h2>

            <p className="text-indigo-100 text-lg opacity-90 leading-relaxed mb-10">
              Log in to access your secure exam environment and track your
              academic progress.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-indigo-200 uppercase tracking-widest">
                  Secure
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-indigo-200 uppercase tracking-widest">
                  Support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="p-10 md:p-20 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 mt-2">
              Enter your credentials to access your portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@university.edu"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  size="sm"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-12 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  Sign In <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              New here?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-extrabold hover:text-indigo-700 transition-colors underline-offset-4 hover:underline"
              >
                Create a free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
