import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Auth from "./pages/Sighup";
// import Home from "./pages/Home";
// import About from "./pages/About";

function App() {
  return (
    <Router>
      <Route path="/auth" element={<Auth />} />

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
