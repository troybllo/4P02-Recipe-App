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
        onClick={toggleSidebar}
        className="fixed top-4 right-2 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-100 focus:outline-none"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-16 px-4">
          <nav className="space-y-4">
            <Link
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              About
            </Link>
            <Link
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Services
            </Link>
            <Link
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed left-0 inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
