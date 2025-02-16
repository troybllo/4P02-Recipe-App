import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Discovery from "./pages/Discovery";
import About from "./pages/About";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/contact" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
