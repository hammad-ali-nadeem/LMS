import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import QuizPage from "./pages/QuizPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:id/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
};

export default App;