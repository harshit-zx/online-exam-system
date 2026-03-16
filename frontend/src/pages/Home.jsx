import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

// --- Components ---
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import FeaturedExamsSection from "../components/FeaturedExamsSection";
import CategoriesSection from "../components/CategoriesSection";
import LeaderboardSection from "../components/LeaderboardSection";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import CTABottomSection from "../components/CTABottomSection";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Featured Exams
        const examRes = await API.get("/exams");
        setExams(
          examRes.data.exams
            ? examRes.data.exams.slice(0, 3)
            : examRes.data.slice(0, 3),
        );

        // Fetch Leaderboard
        const resultRes = await API.get("/results/all");
        const top = resultRes.data
          .map((r) => ({
            name: r.user?.name || "Anonymous",
            exam: r.exam?.title || "Assessment",
            percent: Math.round((r.score / r.totalMarks) * 100),
          }))
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 5);

        setLeaderboard(top);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ---------------- EXAM CLICK ---------------- */
  const handleExamClick = (exam) => {
    if (user) {
      navigate(`/exam/attempt/${exam._id}`);
    } else {
      navigate("/login");
    }
  };

  // Dynamic dashboard redirect based on user role
  // const dashboardPath =
  //   user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <HeroSection />

      <StatsSection />

      <FeaturedExamsSection
        exams={exams}
        loading={loading}
        onExamClick={handleExamClick}
        user={user}
      />

      <section className="py Asc bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-start">
          <CategoriesSection />
          <LeaderboardSection leaderboard={leaderboard} loading={loading} />
        </div>
      </section>

      <FeaturesSection />

      <TestimonialsSection />

      <FAQSection />

      <CTABottomSection />

      <Footer />
    </div>
  );
};

export default Home;
