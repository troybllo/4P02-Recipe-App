// src/pages/Home.jsx
import React, { useState } from "react";
import Masonry from "react-masonry-css";
import styles from "../styles/masonry.css"; // import your masonry CSS
import FoodSocialCard from "../components/FoodSocialCard";
import TrendingCarousel from "../components/TrendingCarousel";
import StoryCarousel from "../components/StoryCarousel"; // adjust path as needed
import { recipes } from "../data/recipes"; // Import recipes data

// Example recipe objects

// Helper function to infer category
function getCategory(recipe) {
  const titleDesc = (recipe.title + " " + recipe.description).toLowerCase();
  if (titleDesc.includes("beef") || titleDesc.includes("steak")) return "beef";
  if (titleDesc.includes("lobster") || titleDesc.includes("seafood"))
    return "seafood";
  if (titleDesc.includes("vegetable") || titleDesc.includes("vegan"))
    return "vegan";
  if (titleDesc.includes("chili") || titleDesc.includes("spicy"))
    return "spicy";
  return "other";
}

// Masonry breakpoints
const breakpointColumnsObj = {
  default: 5,
  1700: 4,
  1490: 3,
  1250: 2,
  940: 1,
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
  
    // Combined filtering logic
    const filteredRecipes = recipes.filter((recipe) => {
      const matchesFilter = activeFilter
        ? getCategory(recipe) === activeFilter
        : true;
      const matchesSearch = searchQuery
        ? (recipe.title + " " + recipe.description)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;
      return matchesFilter && matchesSearch;
    });
  
    const handleFilterClick = (filterName) => {
      setActiveFilter((prev) => (prev === filterName ? null : filterName));
    };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Simple centered header */}
        <header className="flex flex-col items-center text-center bg-gradient-to-b from-[#eaf5e4] to-gray-50 py-8">
          <h1 className="text-2xl font-bold mt-2">Feastly</h1>
          <p className="text-gray-600">Discover new recipes and more!</p>

          {/* Search & Filter Section */}
      <div className="mb-10 flex flex-col items-center p-[5px]">

        <div className="flex justify-center mb-4">
          {/* Stories go here */}
          <StoryCarousel />
        </div>

        <div className="flex justify-center mb-4 p-[15px]">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[50ch] max-w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
  
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => handleFilterClick("vegan")}
          className={`px-4 py-2 rounded-full font-medium transition-colors
            ${
              activeFilter === "vegan"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }
            focus:outline-none focus:ring-2 focus:ring-green-400`}
        >
          Vegan
        </button>
  
        <button
          onClick={() => handleFilterClick("seafood")}
          className={`px-4 py-2 rounded-full font-medium transition-colors 
            ${
              activeFilter === "seafood"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-400`}
        >
          Seafood
        </button>
  
        <button
          onClick={() => handleFilterClick("beef")}
          className={`px-4 py-2 rounded-full font-medium transition-colors 
            ${
              activeFilter === "beef"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }
            focus:outline-none focus:ring-2 focus:ring-red-400`}
        >
          Beef
        </button>

        <button
          onClick={() => handleFilterClick("spicy")}
          className={`px-4 py-2 rounded-full font-medium transition-colors 
            ${
              activeFilter === "spicy"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }
            focus:outline-none focus:ring-2 focus:ring-red-400`}
        >
          Spicy
        </button>

      </div>
    </div>

      </header>
        {/* Masonry Grid Container */}
        <div className="w-full px-4">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {filteredRecipes.map((recipe, index) => (
              <FoodSocialCard key={recipe.postId + index} {...recipe} />
            ))}
          </Masonry>
        </div>

        
    </div>
  );
}
