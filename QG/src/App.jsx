import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext"; // Import the provider
import Home from "./Home.jsx";
import Generate from "./Generate.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Subjectone from "./Subjectone.jsx";
import Subjectopt from "./Subjectopt.jsx";
import History from "./History.jsx";
import Studentsect from "./Studentsect.jsx";
import Profile from "./Profile.jsx"; // Import the Profile component
import AdminManageAccounts from "./AdminManageAccounts.jsx"; // Import the AdminManageAccounts component

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/generate-subject" element={<Subjectone />} />
          <Route path="/generate-subjectopt" element={<Subjectopt />} />
          <Route path="/history" element={<History />} />
          <Route path="/See-Exams" element={<Studentsect />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin/manage-accounts"
            element={<AdminManageAccounts />}
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
