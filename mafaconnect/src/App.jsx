import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Sighup";
import { InstallPromptBanner } from "./components/InstallPromptBanner";
import CustomerPortal from "./pages/CustomerPortal";

function App() {
  return (
    <Router>
      {/* ✅ Keep global components outside Routes */}
      <InstallPromptBanner />

      <Routes>
        {/* 🔁 Redirect "/" to "/auth" */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        <Route path="/auth" element={<Auth />} />
        <Route path="/portal" element={<CustomerPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
