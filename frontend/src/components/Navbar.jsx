import React from 'react';

const Navbar = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="w-full bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`px-3 py-2 rounded-md hover:bg-gray-100 ${currentPage === 'home' ? 'bg-gray-100' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('about')}
            className={`px-3 py-2 rounded-md hover:bg-gray-100 ${currentPage === 'about' ? 'bg-gray-100' : ''}`}
          >
            About
          </button>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full" /> {/* Profile icon placeholder */}
      </div>
    </nav>
  );
};

export default Navbar;