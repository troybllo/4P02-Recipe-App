import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-48 h-full bg-gray-200 p-4">
      <ul className="space-y-4">
        <li><Link to="/" className="hover:text-gray-700">Home</Link></li>
        <li><Link to="/about" className="hover:text-gray-700">About</Link></li>
        <li><Link to="/profile" className="hover:text-gray-700">Profile</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
