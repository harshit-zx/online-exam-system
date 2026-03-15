import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StartExam from "./pages/StartExam";
import Result from "./pages/Result";
import Home from "./pages/Home";
import CreateExam from "./pages/admin/CreateExam";
import EditExam from "./pages/admin/EditExam";
import AttemptExam from "./pages/student/AttemptExam";
import StudentResults from "./pages/student/StudentResults";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications for success/error messages */}
      <Toaster position="top-center" />

      <Routes>
        {/* Public Landing & Auth */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Section */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/createexam" element={<CreateExam />} />
        <Route path="/admin/edit-exam/:id" element={<EditExam />} />

        {/* Student Section */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/exam/attempt/:id" element={<AttemptExam />} />

        {/* ✅ FIXED: Results Section */}
        {/* Changed :id to :resultId to match your Result.jsx component */}
        <Route path="/results/:resultId" element={<Result />} />
        <Route path="/student/allresults" element={<StudentResults />} />

        {/* Optional: If they click "View All Results", redirect to dashboard until you build a dedicated list page */}
        <Route path="/results" element={<StudentDashboard />} />

        {/* Exam Execution Section */}
        <Route path="/exam" element={<StartExam />} />

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
