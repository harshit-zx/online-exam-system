import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { toast } from "react-hot-toast";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Page not found! Redirecting to home...", { id: "404-toast" });
    const timer = setTimeout(() => navigate("/"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
        <div className="w-24 h-24 bg-red-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <div className="text-red-500 text-4xl">404</div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Redirecting in 3 seconds...
        </p>
      </div>
    </div>
  );
};

export default NotFound;
