// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/masonry.css";
import FoodSocialCard from "../components/FoodSocialCard";
import StoryCarousel from "../components/StoryCarousel";
import { useParams } from "react-router-dom";
import { recipes as staticRecipes } from "../data/recipes";

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

function ensureRecipesArray(data) {
  if (Array.isArray(data)) {
    return data;
  } else if (data && data.recipes && Array.isArray(data.recipes)) {
    return data.recipes;
  } else if (data && typeof data === "object" && data !== null) {
    return [data];
  } else {
    return [];
  }
}

const breakpointColumnsObj = {
  default: 3,
  1700: 3,
  1490: 3,
  1250: 2,
  940: 1,
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { postId } = useParams();
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

    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/recipes?excludeUserId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          const backendRecipes = ensureRecipesArray(data);
          const combined = [...backendRecipes, ...staticRecipes];
          setRecipes(combined);
        } else {
          console.error("Error response:", data);
          setRecipes(staticRecipes);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setRecipes(staticRecipes);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchRecipes();
  }, []);

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
          className="pt-16"
        >
          {/* Story Carousel */}
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <StoryCarousel />
          </div>

          {/* Recipe Grid */}
          <motion.div className="py-8 bg-white">
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
                    {recipes.map((recipe, index) => (
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
