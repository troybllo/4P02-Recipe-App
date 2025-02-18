import React from "react";
import "../styles/AboutPage.css"; // Make sure this CSS file exists
import meal1 from "../assets/meal1.jpg"; // Replace with actual image paths
import meal2 from "../assets/meal2.jpg";
import meal3 from "../assets/meal3.jpg";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-6">
      {/* Page Container */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
        
        {/* Header Section */}
        <div className="bg-green-200 p-4 text-center rounded-t-lg">
          <h1 className="text-3xl font-extrabold">About Feastly</h1>
          <p className="text-gray-700 mt-2">
            Feastly is your ultimate meal-planning and recipe-sharing companion. 
            We aim to connect food lovers with a curated collection of recipes, 
            personalized meal plans, and an engaging community to inspire creativity in the kitchen.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="flex justify-center mt-6 space-x-4">
          {/* First Card */}
          <div className="relative bg-white shadow-md rounded-lg p-4">
            <img src={meal1} alt="Discover Recipes" className="w-64 h-40 rounded-md object-cover"/>
            <button className="absolute left-2 bottom-2 text-white bg-black px-2 py-1 rounded-md text-sm">◀</button>
            <button className="absolute right-2 bottom-2 text-white bg-black px-2 py-1 rounded-md text-sm">▶</button>
            <h2 className="text-lg font-bold text-center mt-2">Discover Recipes</h2>
          </div>

          {/* Second Card */}
          <div className="relative bg-white shadow-md rounded-lg p-4">
            <img src={meal2} alt="Save Favorites" className="w-64 h-40 rounded-md object-cover"/>
            <button className="absolute left-2 bottom-2 text-white bg-black px-2 py-1 rounded-md text-sm">◀</button>
            <button className="absolute right-2 bottom-2 text-white bg-black px-2 py-1 rounded-md text-sm">▶</button>
            <h2 className="text-lg font-bold text-center mt-2">Save Favorites</h2>
          </div>

          {/* Third Card */}
          <div className="relative bg-white shadow-md rounded-lg p-4">
            <img src={meal3} alt="Plan Your Meals" className="w-64 h-40 rounded-md object-cover"/>
            <button className="absolute left-2 bottom-2 text-white bg-black px-2 py-1 rounded-md text-sm">◀</button>
            <button className="absolute right-2 bottom-2 text-white bg-black px-2 py-1 rounded-md text-sm">▶</button>
            <h2 className="text-lg font-bold text-center mt-2">Plan Your Meals</h2>
          </div>
        </div>

      </div>
    </div>
  );
}
