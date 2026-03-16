import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardPath = "/"; // Land on home

  return (
    <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              ExamPro
            </span>
          </div>

          {/* Dynamic Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 font-medium text-sm">
            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Standard Links */}
            <Link to="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="text-center text-sm border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} ExamPro Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Lock size={14} className="text-emerald-500" /> Security
            in mind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
