import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-[#ccdec2] border border-[#575757] hover:border-l-4 hover:border-r-4 hover:border-[#1d380e] focus:outline-none"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <X size={24} className="text-gray-900" />
        ) : (
          <Menu size={24} className="text-gray-900" />
        )}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#eaf5e4] border-l border-[#1d380e] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-16 px-4">
          <nav className="space-y-4">
            <Link
              to="/"
              className="block mx-2 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
            >
              Home
            </Link>
            <Link
              to="/friends"
              className="block mx-2 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
            >
              Friends
            </Link>
            <Link
              to="/services"
              className="block mx-2 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="block mx-2 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
