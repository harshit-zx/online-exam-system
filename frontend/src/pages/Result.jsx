import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import {
  Loader2,
  Check,
  X,
  Clock,
  AlertCircle,
  MinusCircle,
  Download,
  Award,
  FileText,
  X as CloseIcon,
} from "lucide-react";
import { toPng } from 'html-to-image';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useAuth } from "../context/AuthContext";

const Result = () => {
  const { resultId } = useParams();
  const { user } = useAuth();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for Certificate & Downloading
  const [showCertificate, setShowCertificate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Refs for capturing the HTML elements
  const resultRef = useRef(null);
  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/results/${resultId}`);
        setResult(res.data.result || res.data);
      } catch (error) {
        console.error("Failed to fetch result", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  // --- PDF GENERATION LOGIC (For Certificate Image Capture) ---
  const downloadPDF = async (elementRef, fileName, orientation = 'p') => {
    if (!elementRef.current) return;
    try {
      setIsDownloading(true);
      
      // Use html-to-image for exact visual replication of the certificate
      const dataUrl = await toPng(elementRef.current, { 
        quality: 1,
        pixelRatio: 2, 
        skipFonts: false,
      });
      
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate perfect dimensions
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Failed to generate PDF: ${error.message}`); 
    } finally {
      setIsDownloading(false);
    }
  };

  // --- PROFESSIONAL RESULT PDF (Multi-page, Selectable Text) ---
  const downloadResultPDF = () => {
    if (!result) return;
    
    try {
      setIsDownloading(true);
      const doc = new jsPDF();
      
      const studentName = result.user?.name || user?.name || "Student";
      const percentage = result.totalMarks > 0 ? ((result.score / result.totalMarks) * 100) : 0;
      const isPassing = percentage >= 40;

      // 1. Header Section
      doc.setFillColor(79, 70, 229); // Indigo-600
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("PERFORMANCE REPORT", 14, 20);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Assessment: ${result.exam?.title}`, 14, 30);

      // 2. Student Info Summary
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Student Name: ${studentName}`, 14, 55);
      doc.text(`Date Taken: ${new Date(result.createdAt).toLocaleDateString()}`, 14, 63);
      
      doc.setFontSize(14);
      doc.text(`Final Score: ${result.score} / ${result.totalMarks} (${percentage.toFixed(1)}%)`, 120, 55);
      
      // Pass/Fail Badge
      doc.setTextColor(isPassing ? 16 : 220, isPassing ? 185 : 38, isPassing ? 129 : 38);
      doc.text(`Status: ${isPassing ? 'PASSED' : 'FAILED'}`, 120, 63);

      // 3. Prepare Table Data
      const tableColumn = ["#", "Question", "Your Answer", "Correct Answer", "Status"];
      const tableRows = [];

      result.exam?.questions?.forEach((q, index) => {
        const studentAnswer = result.answers?.find(a => a.questionId === q._id);
        const isCorrect = studentAnswer?.isCorrect;
        const isSkipped = !studentAnswer || !studentAnswer.submittedAnswer;
        
        let status = isSkipped ? 'Skipped' : (isCorrect ? 'Correct' : 'Incorrect');

        tableRows.push([
          index + 1,
          q.questionText,
          isSkipped ? '-- Skipped --' : studentAnswer.submittedAnswer,
          q.correctAnswer,
          status
        ]);
      });

      // 4. Generate the Table
      autoTable(doc, {
        startY: 75,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 4, overflow: 'linebreak' },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 60 },
          2: { cellWidth: 45 },
          3: { cellWidth: 45 },
          4: { cellWidth: 25, fontStyle: 'bold' }
        },
        didParseCell: function (data) {
          // Color code the Status column
          if (data.section === 'body' && data.column.index === 4) {
            if (data.cell.raw === 'Correct') data.cell.styles.textColor = [16, 185, 129]; // Green
            if (data.cell.raw === 'Incorrect') data.cell.styles.textColor = [239, 68, 68]; // Red
            if (data.cell.raw === 'Skipped') data.cell.styles.textColor = [156, 163, 175]; // Gray
          }
        }
      });

      // 5. Save the PDF
      doc.save(`${studentName.replace(/\s+/g, '_')}_Result_${result.exam?.title.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold">Analyzing your answers...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-md w-full">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Result Not Found
          </h2>
          <p className="text-slate-500 mb-8">
            We couldn't locate this exam attempt.
          </p>
          <Link
            to="/student/dashboard"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const percentage = result.totalMarks > 0 ? (result.score / result.totalMarks) * 100 : 0;
  const isPassing = percentage >= 40;
  const studentName = result.user?.name || user?.name || "Student";

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8 pb-24 select-none">
      <div className="max-w-4xl mx-auto" ref={resultRef}>
        
        {/* HEADER SECTION */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center mb-8 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 ${isPassing ? "bg-emerald-500" : "bg-red-500"}`}></div>

          <span className="bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg mb-4 inline-block">
            Performance Report
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {result.exam?.title || "Exam Assessment"}
          </h1>

          <div className="mt-8 mb-6">
            <div className={`text-7xl font-black tracking-tighter ${isPassing ? "text-emerald-500" : "text-red-500"}`}>
              {percentage.toFixed(1)}%
            </div>
            <div className="text-xl font-bold text-slate-400 mt-2">
              Score: <span className="text-slate-700">{result.score}</span> out of {result.totalMarks}
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-8 text-sm font-bold text-slate-500 bg-slate-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <Clock className="text-indigo-400" size={18} />
              {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-emerald-500" size={18} />
              {result.answers?.filter((a) => a.isCorrect).length || 0} Correct
            </div>
            <div className="flex items-center gap-2">
              <X className="text-red-500" size={18} />
              {result.answers?.filter((a) => a.isCorrect === false && a.submittedAnswer).length || 0} Incorrect
            </div>
            <div className="flex items-center gap-2">
              <MinusCircle className="text-slate-400" size={18} />
              {result.answers?.filter((a) => !a.submittedAnswer).length || 0} Skipped
            </div>
          </div>

          {/* DOWNLOAD & CERTIFICATE ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pt-8 border-t border-slate-100">
            <button
              onClick={downloadResultPDF}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
            >
              {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
              Download Result PDF
            </button>

            {isPassing ? (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 active:scale-95"
              >
                <Award size={20} /> View Certificate
              </button>
            ) : (
              <div className="px-6 py-3 w-full sm:w-auto bg-slate-50 text-slate-400 font-medium rounded-xl border border-slate-100 flex items-center justify-center gap-2">
                <AlertCircle size={18} /> Score 40%+ to unlock certificate
              </div>
            )}
          </div>
        </div>

        {/* DETAILED ANALYSIS */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span> 
            Question Analysis
          </h2>

          <div className="space-y-6">
            {result.exam?.questions?.map((question, index) => {
              const studentAnswer = result.answers?.find((a) => a.questionId === question._id);
              const isCorrect = studentAnswer?.isCorrect;
              const isSkipped = !studentAnswer || !studentAnswer.submittedAnswer;

              return (
                <div key={question._id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                  <p className="text-lg font-bold text-slate-800 mb-6">
                    <span className="text-slate-400 mr-2">{index + 1}.</span>
                    {question.questionText}
                  </p>

                  <div className="space-y-3 text-sm md:text-base font-medium">
                    <div className={`p-4 rounded-2xl flex justify-between items-center border ${
                        isSkipped ? "bg-slate-50 border-slate-200 text-slate-500"
                      : isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                      <span>
                        Your Answer:{" "}
                        <span className="font-bold ml-2">
                          {isSkipped ? "Skipped (Not Answered)" : studentAnswer.submittedAnswer}
                        </span>
                      </span>
                      {isSkipped ? <MinusCircle className="text-slate-400 shrink-0" size={22} />
                      : isCorrect ? <Check className="text-emerald-600 shrink-0" size={22} />
                      : <X className="text-red-600 shrink-0" size={22} />}
                    </div>

                    {(!isCorrect || isSkipped) && (
                      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 flex justify-between items-center">
                        <span>
                          Correct Answer:{" "}
                          <span className="font-bold ml-2">{question.correctAnswer}</span>
                        </span>
                        <Check className="text-indigo-500 shrink-0" size={22} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTION */}
        <div className="text-center mt-12 mb-8">
          <Link
            to={user?.role === 'admin' ? "/admin/dashboard" : "/student/allresults"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* CERTIFICATE PREVIEW MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Award className="text-amber-500" /> Certificate Preview
              </h3>
              <button onClick={() => setShowCertificate(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <CloseIcon size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body: The Actual Certificate Design */}
            <div className="p-6 md:p-10 overflow-y-auto flex justify-center bg-slate-200">
              <div
                ref={certificateRef}
                className="bg-white border-12 border-double border-slate-800 p-12 text-center relative flex flex-col justify-between shadow-lg"
                style={{ width: "800px", height: "565px", margin: "0 auto" }} 
              >
                {/* Decorative Corner Elements */}
                <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-amber-500"></div>
                <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-amber-500"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-amber-500"></div>
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-amber-500"></div>

                <div>
                  <Award size={50} className="mx-auto text-amber-500 mb-4" />
                  <h1 className="text-4xl font-black text-slate-900 uppercase tracking-widest mb-2 font-serif">
                    Certificate of Completion
                  </h1>
                  <p className="text-slate-500 uppercase tracking-widest text-xs mb-8">
                    This acknowledges that
                  </p>

                  {/* Student Name */}
                  <h2 className="text-4xl font-bold text-indigo-600 mb-4 italic">
                    {studentName}
                  </h2>
                  <div className="w-64 h-px bg-slate-300 mx-auto mb-6"></div>

                  <p className="text-slate-600 text-sm mb-2">
                    has successfully completed the assessment for
                  </p>

                  {/* Exam Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 px-10">
                    {result.exam?.title}
                  </h3>

                  <p className="text-slate-500 text-sm">
                    Achieving a passing score of{" "}
                    <span className="font-bold text-slate-800">
                      {percentage.toFixed(1)}%
                    </span>
                  </p>
                </div>

                {/* Footer Signatures */}
                <div className="flex justify-between items-end px-10 mt-auto">
                  <div className="text-center">
                    <p className="border-t-2 border-slate-800 pt-2 font-bold text-slate-800 w-32 text-sm">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">Date</p>
                  </div>

                  {/* Digital Seal */}
                  <div className="w-20 h-20 rounded-full border-4 border-amber-500 bg-amber-50 flex items-center justify-center transform rotate-12">
                    <span className="font-black text-amber-500 text-[10px] text-center leading-tight">
                      OFFICIAL<br />SEAL
                    </span>
                  </div>

                  <div className="text-center">
                    <p className="border-t-2 border-slate-800 pt-2 font-bold text-slate-800 w-32 italic text-sm">
                      AdminPro
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">Instructor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-4">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                Close
              </button>
              <button
                onClick={() => downloadPDF(certificateRef, `${studentName.replace(/\s+/g, '_')}_Certificate_${result.exam?.title.replace(/\s+/g, '_')}`, "l")}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30"
              >
                {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                Download High-Res PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;