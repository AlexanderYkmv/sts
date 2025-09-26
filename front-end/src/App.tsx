import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/AuthPage/AuthPage";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard/TutorDashboard";
import ViceDeanDashboard from "./pages/ViceDeanDashboard/ViceDeanDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<Layout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
          <Route path="/vice-dean/dashboard" element={<ViceDeanDashboard />} />
        </Route>
        <Route path="/" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;