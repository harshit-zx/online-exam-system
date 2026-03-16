import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  ClipboardCheck,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  // Add a subtle shadow when scrolling down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 font-bold text-sm transition-all duration-300 group"
    >
      <Icon
        size={18}
        className="group-hover:scale-110 transition-transform duration-300"
      />
      <span>{children}</span>
    </Link>
  );

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200/50" : "bg-white border-b border-slate-100"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* LOGO */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-indigo-600 p-2.5 rounded-xl group-hover:rotate-12 group-hover:scale-105 transition-all duration-300 shadow-md shadow-indigo-600/20">
                <ShieldCheck
                  className="text-white"
                  size={22}
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-600">
                ExamPro
              </span>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <NavLink to="/" icon={LayoutDashboard}>
                  Home
                </NavLink>

                {isAdmin ? (
                  <NavLink to="/admin/createexam" icon={PlusCircle}>
                    Create Exam
                  </NavLink>
                ) : (
                  <NavLink to="/student/allresults" icon={ClipboardCheck}>
                    My Results
                  </NavLink>
                )}

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-slate-200 mx-3" />

                {/* User Profile Pill */}
                <div className="flex items-center gap-3 pl-2">
                  <div className="flex flex-col items-end lg:flex">
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      {user.role}
                    </p>
                  </div>

                  {/* Gradient Avatar */}
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-200 ring-2 ring-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="ml-2 p-2.5 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                    title="Logout"
                  >
                    <LogOut
                      size={20}
                      className="group-hover:-translate-x-0.5 transition-transform"
                    />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3 items-center">
                <Link
                  to="/login"
                  className="px-6 py-2.5 font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV MENU */}
      <div
        className={`md:hidden absolute w-full bg-white border-b border-slate-100 shadow-2xl transition-all duration-300 origin-top ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}
      >
        <div className="p-4 space-y-3">
          {user ? (
            <>
              {/* Mobile Profile Card */}
              <div className="flex items-center gap-4 p-4 mb-4 bg-linear-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100/50">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-200 ring-4 ring-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-0.5">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <NavLink to="/" icon={LayoutDashboard}>
                  Home
                </NavLink>
                {isAdmin ? (
                  <NavLink to="/admin/createexam" icon={PlusCircle}>
                    Create Exam
                  </NavLink>
                ) : (
                  <NavLink to="/student/allresults" icon={ClipboardCheck}>
                    My Results
                  </NavLink>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-6 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all active:scale-95"
              >
                <LogOut size={18} /> Sign Out Securely
              </button>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-3 pt-2">
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="text-center py-3.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center py-3.5 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
              >
                Student Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
