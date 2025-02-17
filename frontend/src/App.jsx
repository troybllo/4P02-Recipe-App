import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/discovery" element={<About />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
