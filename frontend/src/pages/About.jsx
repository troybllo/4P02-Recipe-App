import React from "react";
import Navbar from "../components/Navbar";
import meal4 from "../assets/meal4.jpeg";
import meal5 from "../assets/meal5.jpeg";
import meal6 from "../assets/meal6.png";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col w-full">
      {/* Title Bar */}
      <div className="bg-gray-900 text-white text-lg font-semibold p-3 text-left w-full">
        About Page
      </div>

      <Navbar />

      {/* Page Container */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto mt-6 border border-gray-300">
        
        {/* Header Section */}
        <div className="bg-green-200 p-4 text-center rounded-t-lg">
          <h1 className="text-3xl font-extrabold">About Feastly</h1>
          <p className="text-gray-700 mt-2 text-lg">
            Feastly is your ultimate meal-planning and recipe-sharing companion. 
            We aim to connect food lovers with a curated collection of recipes, 
            personalized meal plans, and an engaging community to inspire creativity in the kitchen.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="flex justify-center mt-6 space-x-6">
          {/* First Card */}
          <div className="relative bg-white shadow-md rounded-2xl p-4 w-64 border border-gray-200">
            <img src={meal4} alt="Discover Recipes" className="w-full h-44 rounded-md object-cover"/>
            <h2 className="text-lg font-bold text-center mt-2 text-gray-800">Discover Recipes</h2>
            <div className="flex justify-between mt-2">
              <button className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">◀</button>
              <button className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">▶</button>
            </div>
          </div>

          {/* Second Card */}
          <div className="relative bg-white shadow-md rounded-2xl p-4 w-64 border border-gray-200">
            <img src={meal5} alt="Save Favorites" className="w-full h-44 rounded-md object-cover"/>
            <h2 className="text-lg font-bold text-center mt-2 text-gray-800">Save Favorites</h2>
            <div className="flex justify-between mt-2">
              <button className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">◀</button>
              <button className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">▶</button>
            </div>
          </div>

          {/* Third Card */}
          <div className="relative bg-white shadow-md rounded-2xl p-4 w-64 border border-gray-200">
            <img src={meal6} alt="Plan Your Meals" className="w-full h-44 rounded-md object-cover"/>
            <h2 className="text-lg font-bold text-center mt-2 text-gray-800">Plan Your Meals</h2>
            <div className="flex justify-between mt-2">
              <button className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">◀</button>
              <button className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">▶</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
