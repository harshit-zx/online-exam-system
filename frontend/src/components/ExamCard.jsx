import React from 'react';
import { Clock, FileText, ArrowRight, BookOpen } from 'lucide-react';

const ExamCard = ({ exam, onClick, buttonText = "Take Exam" }) => {
  return (
    <div className="group bg-white rounded-4xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-full">
      
      {/* Icon & Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
          <BookOpen size={24} />
        </div>
        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
          Available
        </span>
      </div>

      {/* Text Content */}
      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
        {exam.title}
      </h3>
      <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
        {exam.description || "No description provided for this assessment."}
      </p>

      {/* Meta Info (Duration & Questions) */}
      <div className="flex items-center gap-4 mb-6 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
          <Clock size={16} className="text-indigo-400" />
          <span>{exam.duration} mins</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
          <FileText size={16} className="text-indigo-400" />
          <span>{exam.questions?.length || 0} Qs</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onClick(exam._id)}
        className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-900 font-bold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 mt-auto active:scale-95"
      >
        {buttonText} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default ExamCard;