import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { 
  Plus, Trash2, List, BarChart2, Edit3, Clock, LayoutDashboard, 
  LogOut, Loader2, Globe, Lock, ShieldAlert, ChevronDown, 
  ChevronUp, CheckCircle2, XCircle, Repeat, ShieldCheck, AlertTriangle, Eye
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState("exams");
  const [loading, setLoading] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchData = async () => {
    // ✅ OPTIMISTIC UI FIX: Only show the full-screen spinner if the array is completely empty
    if (activeTab === "exams" && exams.length === 0) setLoading(true);
    if (activeTab === "results" && results.length === 0) setLoading(true);

    try {
      if (activeTab === "exams") {
        const res = await API.get("/exams");
        setExams(res.data.exams || res.data);
      } else {
        const res = await API.get("/results/all");
        setResults(res.data);
      }
    } catch (err) {
      toast.error(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (exam) => {
    try {
      const updatedStatus = !exam.isPublished;
      await API.put(`/exams/${exam._id}`, { ...exam, isPublished: updatedStatus });
      setExams(exams.map(e => e._id === exam._id ? { ...e, isPublished: updatedStatus } : e));
      toast.success(updatedStatus ? "Exam is now Live!" : "Exam moved to Drafts");
    } catch (err) {
      toast.error("Failed to update publish status.");
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm("Are you sure? This will permanently delete the exam and all associated student results.")) {
      try {
        await API.delete(`/exams/${id}`);
        setExams(exams.filter((exam) => exam._id !== id));
        toast.success("Exam deleted successfully");
      } catch (err) {
        toast.error("Failed to delete exam");
      }
    }
  };

  const handleDeleteResult = async (id) => {
    if (window.confirm("Delete this result? This will clear the attempt and allow the student to retake the exam if they hit their limit.")) {
      try {
        await API.delete(`/results/${id}`);
        setResults(results.filter((res) => res._id !== id));
        toast.success("Result deleted. Attempt reset for student.");
      } catch (err) {
        toast.error("Failed to delete result");
      }
    }
  };

  const toggleSecurityPanel = (id) => {
    setExpandedExamId(expandedExamId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 hidden lg:flex flex-col text-white p-6 sticky top-0 h-screen shadow-2xl">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/40">
            <LayoutDashboard size={22} strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">AdminPro</span>
        </div>

        <nav className="space-y-3 flex-1">
          <button 
            onClick={() => setActiveTab("exams")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'exams' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <List size={20} /> Manage Exams
          </button>
          <button 
            onClick={() => setActiveTab("results")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'results' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BarChart2 size={20} /> Global Results
          </button>
        </nav>

        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all mt-auto group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 w-full overflow-hidden">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Admin Control Panel</h1>
            <p className="text-slate-500 mt-2 font-medium text-lg">Manage examinations and monitor student performance.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="hidden md:flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 items-center gap-3 px-4 mr-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="text-sm pr-2">
                <p className="font-bold text-slate-800 leading-none">{user?.name}</p>
                <p className="text-indigo-600 font-black uppercase tracking-widest text-[10px] mt-1">Administrator</p>
              </div>
            </div>

            <Link
              to="/admin/createexam"
              className="w-full md:w-auto bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-600 flex items-center justify-center shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/30 transition-all duration-300 active:scale-95 whitespace-nowrap group"
            >
              <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Create Exam
            </Link>
          </div>
        </header>

        {/* MOBILE TABS */}
        <div className="flex lg:hidden bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 p-1.5">
           <button
             onClick={() => setActiveTab("exams")}
             className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === "exams" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
           >
             Exams
           </button>
           <button
             onClick={() => setActiveTab("results")}
             className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === "results" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
           >
             Results
           </button>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
             <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
             <p className="text-slate-500 font-bold tracking-wide animate-pulse">Syncing dashboard data...</p>
           </div>
        ) : activeTab === "exams" ? (
          
          /* --- EXAMS GRID --- */
          exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {exams.map((exam) => (
                <div key={exam._id} className="group bg-white border border-slate-200 p-6 rounded-[2rem] hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-5">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border ${exam.isPublished ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                      {exam.isPublished ? <><Globe size={12}/> Published</> : <><Lock size={12}/> Draft</>}
                    </span>
                    <div className="flex gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button onClick={() => navigate(`/admin/edit-exam/${exam._id}`)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="Edit Exam">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteExam(exam._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="Delete Exam">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{exam.title}</h3>
                  <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-6 flex-1">{exam.description}</p>
                  
                  <div className="flex items-center gap-3 text-slate-600 text-sm font-bold mb-6">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl shadow-sm"><Clock size={16} className="text-indigo-500"/> {exam.duration}m</div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl shadow-sm"><List size={16} className="text-indigo-500"/> {exam.questions?.length || 0} Qs</div>
                  </div>

                  {/* Anti-Cheating Dropdown */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
                    <button 
                      onClick={() => toggleSecurityPanel(exam._id)}
                      className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50/50 transition-colors text-sm font-bold text-slate-700"
                    >
                      <span className="flex items-center gap-2.5"><ShieldAlert size={18} className="text-indigo-500" /> Security Settings</span>
                      {expandedExamId === exam._id ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </button>
                    
                    {expandedExamId === exam._id && (
                      <div className="p-3 bg-white border-t border-slate-100 space-y-2 text-xs font-bold">
                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50">
                           <span className="text-slate-600">Tab Switching</span>
                           {exam.preventTabSwitch ? <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={14}/> Blocked</span> : <span className="flex items-center gap-1.5 text-red-500"><XCircle size={14}/> Allowed</span>}
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50">
                           <span className="text-slate-600">Copy / Paste</span>
                           {exam.disableCopyPaste ? <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={14}/> Blocked</span> : <span className="flex items-center gap-1.5 text-red-500"><XCircle size={14}/> Allowed</span>}
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50">
                           <span className="text-slate-600 flex items-center gap-1.5"><Repeat size={14}/> Attempts Allowed</span>
                           <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{exam.allowedAttempts || 1}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleTogglePublish(exam)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all border shadow-sm active:scale-[0.98] ${exam.isPublished ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900' : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 hover:border-indigo-700 shadow-indigo-600/20'}`}
                  >
                    {exam.isPublished ? 'Unpublish Exam' : 'Publish to Students'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-16 md:p-24 text-center border border-dashed border-slate-300 shadow-sm">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-300"><List size={48} /></div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No Exams Found</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">You haven't created any examinations yet. Click the button above to get started.</p>
              <Link to="/admin/createexam" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                <Plus size={20} className="mr-2" /> Create First Exam
              </Link>
            </div>
          )
        ) : (
          
          /* --- RESULTS TABLE --- */
          results.length > 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Assessment</th>
                      <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Score</th>
                      <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Integrity Status</th>
                      <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Date Taken</th>
                      <th className="px-6 py-5 text-center text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {results.map((result) => {
                      const percentage = result.totalMarks > 0 ? ((result.score / result.totalMarks) * 100) : 0;
                      const isPassing = percentage >= 40;
                      const hasWarnings = result.warnings > 0;

                      return (
                        <tr key={result._id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200">
                                {result.user?.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{result.user?.name || "Unknown User"}</div>
                                <div className="text-xs font-medium text-slate-500">{result.user?.email || "No email"}</div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-slate-800 line-clamp-1">{result.exam?.title || "Deleted Exam"}</div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-black px-3 py-1.5 rounded-lg border ${isPassing ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {result.score} / {result.totalMarks}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasWarnings ? (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 w-max shadow-sm">
                                <AlertTriangle size={14} /> Flagged ({result.warnings})
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-max shadow-sm">
                                <ShieldCheck size={14} /> Clean Session
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-500">
                            {new Date(result.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => navigate(`/results/${result._id}`)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-sm rounded-xl transition-all"
                                title="View Detailed Report"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteResult(result._id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:shadow-sm rounded-xl transition-all"
                                title="Delete Result (Resets Attempt Limit)"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-16 md:p-24 text-center border border-dashed border-slate-300 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><BarChart2 size={48} /></div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No Results Yet</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">Once students start taking your exams, their automated performance reports will appear here.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
