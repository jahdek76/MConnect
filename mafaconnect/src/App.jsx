import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Auth from "./pages/Sighup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
