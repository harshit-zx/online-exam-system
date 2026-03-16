import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTABottomSection = () => {
  return (
    <section className="py-28 bg-indigo-600 relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-size-[20px_20px] opacity-30"></div>
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
          Ready to start learning?
        </h2>
        <p className="text-indigo-100 text-xl font-medium mb-10">
          Join thousands of students and educators already using ExamPro.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center justify-center px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl shadow-indigo-900/20 active:scale-95 text-lg group"
        >
          Create Free Account{" "}
          <ArrowRight
            size={20}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </section>
  );
};

export default CTABottomSection;
