// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/masonry.css";
import FoodSocialCard from "../components/FoodSocialCard";
import StoryCarousel from "../components/StoryCarousel";
import { recipes } from "../data/recipes";

// Helper function to infer category from various fields
function getCategory(recipe) {
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.join(" ")
    : "";
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.join(" ")
    : "";
  const combinedText = (
    recipe.title +
    " " +
    recipe.description +
    " " +
    ingredients +
    " " +
    instructions
  ).toLowerCase();

  if (combinedText.includes("beef") || combinedText.includes("steak"))
    return "beef";
  if (combinedText.includes("lobster") || combinedText.includes("seafood"))
    return "seafood";
  if (combinedText.includes("vegetable") || combinedText.includes("salad"))
    return "vegetable";
  if (combinedText.includes("chili") || combinedText.includes("spicy"))
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join(" ")
      : "";
    const instructions = Array.isArray(recipe.instructions)
      ? recipe.instructions.join(" ")
      : "";
    const combinedText = (
      recipe.title +
      " " +
      recipe.description +
      " " +
      ingredients +
      " " +
      instructions
    ).toLowerCase();

    const matchesFilter = activeFilter
      ? getCategory(recipe) === activeFilter
      : true;
    const matchesSearch = searchQuery
      ? combinedText.includes(searchQuery.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  const handleFilterClick = (filterName) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const filterButtonVariants = {
    active: {
      scale: 1.05,
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    },
    inactive: {
      scale: 1,
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    },
    tap: { scale: 0.97 },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <motion.div
            className="w-20 h-20 border-4 border-[#1d9c3f] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="pt-16" // Add padding for navbar
        >
          {/* <motion.div
            className="w-full bg-gradient-to-b from-[#0e2018] to-[#1b3c2a] text-white py-16"
            variants={itemVariants}
          >
            <div className="max-w-6xl mx-auto px-6">
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-[#8bc34a] via-[#e6f4e0] to-[#a5d6a7] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Culinary creativity unleashed
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-center max-w-3xl mx-auto text-gray-200 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Explore recipes crafted with passion, shared with love. Every
                detail meticulously prepared, every element serving a purpose.
              </motion.p>
              <motion.div
                className="flex justify-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.button
                  className="px-6 py-3 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    document
                      .getElementById("recipe-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Discover Recipes
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-transparent border-2 border-[#8bc34a] text-[#8bc34a] rounded-full font-medium hover:bg-[#8bc34a]/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Share Your Recipe
                </motion.button>
              </motion.div>
            </div>
          </motion.div> */}
          
          {/* <motion.div
            id="recipe-section"
            className="py-10 bg-[#f8f9fa]"
            variants={itemVariants}
          >
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[#1d380e] mb-4 md:mb-0">
                  Explore Recipes
                </h2>
                <motion.div
                  className="w-full md:w-80 lg:w-96"
                  whileHover={{ scale: 1.01 }}
                >
                  <div
                    className={`relative transition-all duration-300 ${
                      isSearchFocused ? "scale-105" : ""
                    }`}
                  >
                    <input
                      type="text"
                      placeholder="Search recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full px-5 py-3 border-2 border-[#b8d1a4] rounded-full focus:outline-none focus:ring-2 focus:ring-[#1d9c3f] focus:border-[#1d9c3f] shadow-sm transition-all duration-300"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-[#1d9c3f]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-8"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => handleFilterClick("vegetable")}
                  className={`px-5 py-2.5 rounded-full font-medium transition-colors
                    ${
                      activeFilter === "vegetable"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }
                    focus:outline-none focus:ring-2 focus:ring-green-400`}
                  variants={filterButtonVariants}
                  animate={activeFilter === "vegetable" ? "active" : "inactive"}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Vegetable
                </motion.button>

                <motion.button
                  onClick={() => handleFilterClick("seafood")}
                  className={`px-5 py-2.5 rounded-full font-medium transition-colors 
                    ${
                      activeFilter === "seafood"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  variants={filterButtonVariants}
                  animate={activeFilter === "seafood" ? "active" : "inactive"}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Seafood
                </motion.button>

                <motion.button
                  onClick={() => handleFilterClick("beef")}
                  className={`px-5 py-2.5 rounded-full font-medium transition-colors 
                    ${
                      activeFilter === "beef"
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }
                    focus:outline-none focus:ring-2 focus:ring-red-400`}
                  variants={filterButtonVariants}
                  animate={activeFilter === "beef" ? "active" : "inactive"}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Beef
                </motion.button>

                <motion.button
                  onClick={() => handleFilterClick("spicy")}
                  className={`px-5 py-2.5 rounded-full font-medium transition-colors 
                    ${
                      activeFilter === "spicy"
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }
                    focus:outline-none focus:ring-2 focus:ring-red-400`}
                  variants={filterButtonVariants}
                  animate={activeFilter === "spicy" ? "active" : "inactive"}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Spicy
                </motion.button>
              </motion.div>
            </div>
          </motion.div> */}
          <motion.div className="py-8 bg-white" variants={itemVariants}>
            <div className="max-w-7xl mx-auto px-4">
              <AnimatePresence>
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {filteredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.postId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <FoodSocialCard {...recipe} />
                    </motion.div>
                  ))}
                </Masonry>
              </AnimatePresence>
              {filteredRecipes.length === 0 && (
                <motion.div
                  className="flex flex-col items-center justify-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{
                      rotate: [0, -5, 5, -5, 0],
                      transition: {
                        repeat: Infinity,
                        duration: 2,
                        repeatType: "reverse",
                      },
                    }}
                  >
                    😕
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    No recipes found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search or filters
                  </p>
                  <motion.button
                    onClick={() => {
                      setActiveFilter(null);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear filters
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
          <motion.div
            className="py-16 bg-gradient-to-r from-[#1d380e] to-[#336633] text-white"
            variants={itemVariants}
          >
            <div className="max-w-5xl mx-auto px-6 text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Join our culinary community
              </motion.h2>
              <motion.p
                className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Share your recipes, discover new ones, connect with fellow food
                enthusiasts
              </motion.p>
              <motion.button
                className="px-8 py-3 bg-white text-[#1d380e] rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Create Account
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
