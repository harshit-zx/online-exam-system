import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import ExamCard from "./ExamCard";

const FeaturedExamsSection = ({ exams, loading, handleExamClick, user }) => {
  const buttonText = user ? "Start Exam" : "Login to Take Exam";

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Featured Assessments
            </h2>
            {/* FIXED TYPO: text-slate-500 */}
            <p className="text-slate-500 font-medium text-lg">
              Preview our top-rated exams. Create an account to unlock full
              access and track your progress.
            </p>
          </div>
          <Link
            to="/signup"
            className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-2 shrink-0 group"
          >
            View All Exams{" "}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
            <p className="text-slate-500 font-bold tracking-wide">
              Loading latest exams...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="h-full transition-transform hover:-translate-y-2 duration-300"
              >
                <ExamCard
                  exam={exam}
                  onClick={() => handleExamClick(exam)} // ALIGNED PROP NAME
                  buttonText={buttonText}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedExamsSection;