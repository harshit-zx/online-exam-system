import { createContext, useState, useEffect, useContext } from "react";
// Fix: Named import
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

// Custom hook for cleaner code
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const decoded = jwtDecode(token);
        
        // Check if token is still valid
        if (decoded.exp * 1000 > Date.now()) {
          setUser(JSON.parse(savedUser));
        } else {
          handleAutoLogout();
        }
      } catch (err) {
        console.error("Session invalid:", err);
        handleAutoLogout();
      }
    }
    setLoading(false);
  }, []);

  const handleAutoLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    handleAutoLogout();
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: user?.role === "admin", // Helper property
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Show nothing or a spinner until we know if the user is logged in */}
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};