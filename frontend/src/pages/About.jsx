import React from "react";
import Navbar from "../components/Navbar";
import meal4 from "../assets/meal4.jpeg";
import meal5 from "../assets/meal5.jpeg";
import meal6 from "../assets/meal6.png";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col w-full">
      <div className="bg-gray-900 text-white text-lg font-semibold p-3 text-left w-full">
        About Page
      </div>

      <Navbar />

      {/* Page Container */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto mt-6 border border-gray-300">
        {/* Header Section */}
        <div className="p-4 text-center rounded-t-lg">
          <h1 className="text-3xl font-bold">Feastly</h1>
          <p className="text-gray-700 mt-2 text-l">
            The ultimate hub of all foodies, from students to home chefs to professional chefs.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="flex justify-center mt-6 space-x-6">
          {/* First Card */}
          <div className="relative bg-white shadow-md rounded-2xl p-4 w-64 border border-gray-200">
            <h2 className="text-lg font-bold text-center mt-2 text-gray-800 border-2 rounded-full py-1">
              Discover Recipes
            </h2>
            <img
              src={meal4}
              alt="Discover Recipes"
              className="w-full h-44 rounded-md object-cover mt-3"
            />
            <div className="flex justify-between mt-2">
              <p>Explore various categories of recipes. Filter between multiple different categories to find your favorite recipe to cook tonight.</p>
            </div>
          </div>

          {/* Second Card */}
          <div className="relative bg-white shadow-md rounded-2xl p-4 w-64 border border-gray-200">
            <h2 className="text-lg font-bold text-center mt-2 text-gray-800 border-2 rounded-full py-1">
              Save Recipes
            </h2>
            <img
              src={meal5}
              alt="Discover Recipes"
              className="w-full h-44 rounded-md object-cover mt-3"
            />
            <div className="flex justify-between mt-2">
              <p>Make sure to never forget any recipes by creating collections and saving to them whenever you see a recipe you like! Login is required</p>
            </div>
          </div>

          {/* Third Card */}
          <div className="relative bg-white shadow-md rounded-2xl p-4 w-64 border border-gray-200">
            <h2 className="text-lg font-bold text-center mt-2 text-gray-800 border-2 rounded-full py-1">
              Plan your Meals
            </h2>
            <img
              src={meal6}
              alt="Discover Recipes"
              className="w-full h-44 rounded-md object-cover mt-3"
            />
            <div className="flex justify-between mt-2">
              <p>Explore various categories of recipes. Filter between multiple different categories to find your favorite recipe to cook tonight.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
