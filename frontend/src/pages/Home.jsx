// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/masonry.css";
import FoodSocialCard from "../components/FoodSocialCard";
import StoryCarousel from "../components/StoryCarousel";
import { useParams } from "react-router-dom";

// Helper function to infer category from various fields
function getCategory(recipe) {
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.join(" ")
    : typeof recipe.ingredients === "string"
      ? recipe.ingredients
      : "";
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.join(" ")
    : typeof recipe.instructions === "string"
      ? recipe.instructions
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

// Helper function to ensure recipes is always an array
function ensureRecipesArray(data) {
  if (Array.isArray(data)) {
    return data;
  } else if (data && data.recipes && Array.isArray(data.recipes)) {
    return data.recipes;
  } else if (data && typeof data === "object" && data !== null) {
    return [data]; // Single object wrapped in array
  } else {
    return []; // Default empty array
  }
}

// Masonry breakpoints
const breakpointColumnsObj = {
  default: 3,
  1700: 3,
  1490: 3,
  1250: 2,
  940: 1,
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { postId } = useParams();
  // Changed to store recipes from backend instead of importing them
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
      setError("User not logged in");
      setIsLoading(false);
      return;
    }

    // Fetch all recipes for the user
    const fetchRecipes = async () => {
      try {
        console.log("Fetching recipes for userId:", userId);
        const response = await fetch(
          `http://127.0.0.1:5000/api/recipes?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        console.log("API response:", data);

        if (response.ok) {
          // Ensure we're setting an array of recipes
          const recipesArray = ensureRecipesArray(data);
          setRecipes(recipesArray);
          console.log("Recipes set in state:", recipesArray.length);
        } else {
          setError(data.error || "Failed to fetch recipes");
          console.error("Error response:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Network error. Please try again.");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    fetchRecipes();
  }, []);

  // Filter recipes
  const filteredRecipes =
    recipes && Array.isArray(recipes)
      ? recipes.filter((recipe) => {
          const ingredients = Array.isArray(recipe.ingredients)
            ? recipe.ingredients.join(" ")
            : typeof recipe.ingredients === "string"
              ? recipe.ingredients
              : "";
          const instructions = Array.isArray(recipe.instructions)
            ? recipe.instructions.join(" ")
            : typeof recipe.instructions === "string"
              ? recipe.instructions
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
        })
      : [];

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
          {/* Filter buttons */}
          <motion.div
            className="flex flex-wrap gap-2 justify-center py-6 bg-white border-b border-gray-100 mb-6"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => handleFilterClick("beef")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === "beef"
                  ? "bg-[#1d9c3f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              variants={filterButtonVariants}
              animate={activeFilter === "beef" ? "active" : "inactive"}
              whileHover="hover"
              whileTap="tap"
            >
              Beef
            </motion.button>
            <motion.button
              onClick={() => handleFilterClick("seafood")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === "seafood"
                  ? "bg-[#1d9c3f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              variants={filterButtonVariants}
              animate={activeFilter === "seafood" ? "active" : "inactive"}
              whileHover="hover"
              whileTap="tap"
            >
              Seafood
            </motion.button>
            <motion.button
              onClick={() => handleFilterClick("vegetable")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === "vegetable"
                  ? "bg-[#1d9c3f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              variants={filterButtonVariants}
              animate={activeFilter === "vegetable" ? "active" : "inactive"}
              whileHover="hover"
              whileTap="tap"
            >
              Vegetable
            </motion.button>
            <motion.button
              onClick={() => handleFilterClick("spicy")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === "spicy"
                  ? "bg-[#1d9c3f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              variants={filterButtonVariants}
              animate={activeFilter === "spicy" ? "active" : "inactive"}
              whileHover="hover"
              whileTap="tap"
            >
              Spicy
            </motion.button>

            {/* Search input */}
            <div className="relative w-full md:w-80 mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full px-4 py-2 rounded-full border transition-all duration-300 ${
                  isSearchFocused
                    ? "border-[#1d9c3f] shadow-sm"
                    : "border-gray-200"
                }`}
              />
              <motion.button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500"
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchQuery("")}
                style={{ display: searchQuery ? "flex" : "none" }}
              >
                ✕
              </motion.button>
            </div>
          </motion.div>

          <motion.div className="py-8 bg-white" variants={itemVariants}>
            <div className="max-w-7xl mx-auto px-4">
              {error ? (
                <div className="text-red-500 text-center py-8 text-lg">
                  {error}
                </div>
              ) : (
                <AnimatePresence>
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {filteredRecipes.map((recipe, index) => (
                      <motion.div
                        key={recipe.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                      >
                        <FoodSocialCard
                          {...recipe}
                          userId={localStorage.getItem("userId")}
                        />
                      </motion.div>
                    ))}
                  </Masonry>
                </AnimatePresence>
              )}

              {!error && (!recipes || recipes.length === 0) && (
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
                    Time to create your first recipe!
                  </p>
                  <motion.button
                    onClick={() => (window.location.href = "/create-recipe")}
                    className="px-4 py-2 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Recipe
                  </motion.button>
                </motion.div>
              )}

              {!error &&
                filteredRecipes.length === 0 &&
                recipes &&
                recipes.length > 0 && (
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
                      No matching recipes
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
        </motion.div>
      )}
    </div>
  );
}
