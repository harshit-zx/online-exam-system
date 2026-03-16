import { ShieldCheck, Award, Zap, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Engineered for Integrity.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to run high-stakes online examinations securely
            and efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-linear-to-br from-indigo-900/50 to-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-slate-700/50 group hover:border-indigo-500/50 transition-colors">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Military-Grade Proctoring
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Our strict anti-cheat engine detects tab switching, prevents
              copy-pasting, and locks down the environment to ensure absolute
              academic integrity.
            </p>
          </div>

          <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 group hover:border-amber-500/50 transition-colors">
            <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Award size={28} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Verified Certificates
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Automatically generate gorgeous, high-resolution PDF certificates
              for students who pass their exams.
            </p>
          </div>

          <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 group hover:border-emerald-500/50 transition-colors">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Instant AI Grading
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Zero wait time. Students get their score immediately after
              submission with detailed analytics.
            </p>
          </div>

          <div className="md:col-span-2 bg-linear-to-br from-blue-900/40 to-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center gap-8 group hover:border-blue-500/50 transition-colors">
            <div className="flex-1">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 size={28} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Deep Analytics
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                Review question-by-question performance breakdowns to identify
                strengths and areas for improvement globally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
