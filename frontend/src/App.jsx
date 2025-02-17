import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Discovery from "./pages/Discovery";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/contact" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
