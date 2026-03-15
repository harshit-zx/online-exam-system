import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, BarChart2, Calendar, Award, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyResults = async () => {
      try {
        setLoading(true);
        // Uses the same protected route from resultController.js (getUserResults)
        const res = await API.get('/results/my-results');
        setResults(res.data || []);
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyResults();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pb-24 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <button 
              onClick={() => navigate('/student/dashboard')}
              className="text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-sm font-bold mb-4 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <BarChart2 className="text-indigo-600 shrink-0" size={36} strokeWidth={3} />
              Examination History
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Review all your past assessments and performance analytics.</p>
          </div>
          
          <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 w-full md:w-auto">
            <div className="bg-amber-50 p-3 rounded-2xl">
              <Award className="text-amber-500" size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Exams Taken</p>
              <p className="text-2xl font-black text-slate-800 leading-none">{results.length}</p>
            </div>
          </div>
        </div>

        {/* RESULTS GRID OR LOADING/EMPTY STATES */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-indigo-500 mb-6" size={50} strokeWidth={3} />
            <p className="text-slate-400 font-black tracking-widest uppercase text-sm">Compiling History...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((result) => {
              // Mathematical safety check (avoid divide by zero)
              const percentage = result.totalMarks > 0 ? ((result.score / result.totalMarks) * 100) : 0;
              const isPassing = percentage >= 40; 

              return (
                <div key={result._id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                  
                  {/* Subtle Background Gradient for Pass/Fail */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${isPassing ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      isPassing ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {isPassing ? <CheckCircle2 size={14} strokeWidth={3} /> : <XCircle size={14} strokeWidth={3} />}
                      {isPassing ? "Passed" : "Failed"}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(result.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 mb-8 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors flex-1">
                    {result.exam?.title || "Deleted Assessment"}
                  </h3>

                  <div className="mb-8 p-5 bg-slate-50 rounded-3xl border border-slate-100/50">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
                        <p className="text-3xl font-black text-slate-900">
                          {result.score} <span className="text-lg text-slate-400 font-bold">/ {result.totalMarks}</span>
                        </p>
                      </div>
                      <div className={`text-2xl font-black tracking-tighter ${isPassing ? 'text-emerald-500' : 'text-red-500'}`}>
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isPassing ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Navigation Button */}
                  <Link 
                    to={`/results/${result._id}`}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-indigo-50 text-indigo-600 font-black rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 mt-auto"
                  >
                    View Detailed Analysis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200 shadow-sm max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <BarChart2 size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">No Results Found</h3>
            <p className="text-slate-500 text-lg font-medium mb-10 leading-relaxed">
              You haven't completed any examinations yet. Head over to your dashboard to take your first test and start tracking your performance.
            </p>
            <Link 
              to="/student/dashboard" 
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-lg"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResults;