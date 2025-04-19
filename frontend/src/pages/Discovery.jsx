import React, { useState, useEffect } from "react";
import FoodSocialCard from "../components/FoodSocialCard";
import { motion } from "framer-motion";

const Discovery = () => {
  const API = process.env.REACT_APP_API_URL;

  const [categories, setCategories] = useState({
    mostLiked: [],
    recentlyAdded: [],
    editorsPick: [],
    quickMeals: [],
  });
  const [loading, setLoading] = useState({
    mostLiked: true,
    recentlyAdded: true,
    editorsPick: true,
    quickMeals: true,
  });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMostLiked = async () => {
      try {
        const response = await fetch(`${API}/api/recipes/most-liked`);
        const data = await response.json();
        console.log("Most liked API response:", data);

        let fetched = [];
        if (data && Array.isArray(data)) {
          fetched = data;
        } else if (data && data.recipes && Array.isArray(data.recipes)) {
          fetched = data.recipes;
        } else if (data && Object.values(data).some(Array.isArray)) {
          const arrayProps = Object.entries(data).find(([_, val]) =>
            Array.isArray(val),
          );
          if (arrayProps) fetched = arrayProps[1];
        }

        setCategories((prev) => ({ ...prev, mostLiked: fetched }));
        console.log("Processed most liked recipes:", fetched);
      } catch (err) {
        console.error("Error fetching most liked recipes:", err);
      } finally {
        setLoading((prev) => ({ ...prev, mostLiked: false }));
      }
    };

    const fetchRecentlyAdded = async () => {
      try {
        const response = await fetch(`${API}/api/recipes/most-recent?limit=5`);
        const data = await response.json();
        console.log("Recently added API response:", data);

        let fetched = [];
        if (data && Array.isArray(data)) {
          fetched = data;
        } else if (data && data.recipes && Array.isArray(data.recipes)) {
          fetched = data.recipes;
        } else if (data && Object.values(data).some(Array.isArray)) {
          const arrayProps = Object.entries(data).find(([_, val]) =>
            Array.isArray(val),
          );
          if (arrayProps) fetched = arrayProps[1];
        }

        setCategories((prev) => ({ ...prev, recentlyAdded: fetched }));
        console.log("Processed recently added recipes:", fetched);
      } catch (err) {
        console.error("Error fetching recently added recipes:", err);
      } finally {
        setLoading((prev) => ({ ...prev, recentlyAdded: false }));
      }
    };

    fetchMostLiked();
    fetchRecentlyAdded();

    setTimeout(() => {
      setLoading((prev) => ({
        ...prev,
        editorsPick: false,
        quickMeals: false,
      }));
    }, 1000);
  }, [API]);

  const breakpointColumnsObj = {
    default: 3,
    1440: 3,
    1920: 3,
    1680: 3,
    1280: 3,
    1080: 2,
    824: 2,
    640: 1,
  };

  const [activeFilters, setActiveFilters] = useState({
    cuisine: [],
    diet: [],
    mealType: [],
    cookingTime: [],
    difficulty: [],
    ingredients: [],
    calories: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filterOptions = {
    cuisine: ["Italian", "Mexican", "Thai", "Japanese", "French"],
    diet: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"],
    mealType: ["Breakfast", "Lunch", "Dinner", "Snacks"],
    cookingTime: ["Quick (<30min)", "Moderate (30-60min)", "Long (>1hr)"],
    difficulty: ["Easy", "Medium", "Hard"],
    ingredients: ["5 or less", "10 or less", "15 or less"],
    calories: ["Low (<300)", "Medium (300-600)", "High (>600)"],
  };

  const toggleFilter = (category, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const filterRecipes = (recipes) => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = Object.entries(activeFilters).every(
        ([category, values]) => {
          if (values.length === 0) return true;

          switch (category) {
            case "cuisine":
              return values.includes(recipe.cuisineType);
            case "diet":
              return values.some((diet) => recipe.dietary?.includes(diet));
            case "cookingTime":
              return values.some((time) => {
                const [min, max] = parseCookingTime(time);
                const recipeTime = parseRecipeTime(recipe.cookingTime);
                return recipeTime >= min && recipeTime <= max;
              });
            case "calories":
              return values.some((range) => {
                const [min, max] = parseCalorieRange(range);
                return recipe.calories >= min && recipe.calories <= max;
              });
            default:
              return values.includes(recipe[category]);
          }
        },
      );

      return matchesSearch && matchesFilters;
    });
  };

  const parseCookingTime = (time) => {
    switch (time) {
      case "Quick (<30min)":
        return [0, 30];
      case "Moderate (30-60min)":
        return [30, 60];
      case "Long (>1hr)":
        return [60, Infinity];
      default:
        return [0, Infinity];
    }
  };

  const parseRecipeTime = (timeString) => {
    if (!timeString) return 0;
    const hours = timeString.includes("hour") ? parseInt(timeString) : 0;
    const minutesMatch = timeString.match(/\d+/);
    const minutes = minutesMatch ? parseInt(minutesMatch[0]) : 0;
    return hours * 60 + minutes;
  };

  const parseCalorieRange = (range) => {
    switch (range) {
      case "Low (<300)":
        return [0, 300];
      case "Medium (300-600)":
        return [300, 600];
      case "High (>600)":
        return [600, Infinity];
      default:
        return [0, Infinity];
    }
  };

  const categoryMap = {
    "Editors Pick": {
      data: categories.editorsPick,
      loading: loading.editorsPick,
    },
    "Most Liked 💖": { data: categories.mostLiked, loading: loading.mostLiked },
    "Recently Added": {
      data: categories.recentlyAdded,
      loading: loading.recentlyAdded,
    },
    "Quick Meals": { data: categories.quickMeals, loading: loading.quickMeals },
  };

  return (
    <div className="w-full mt-[7rem]">
      <div className="relative flex flex-col items-center justify-center mb-8">
        <span className="absolute w-28 h-28 animate-ping rounded-full bg-gradient-to-r from-orange-400 via-yellow-200 to-green-500 opacity-10 blur-xl" />

        <motion.h1
          className="relative z-10 text-6xl md:text-7xl font-extrabold text-center bg-gradient-to-r from-[#FF7E29] via-[#fceabb] to-[#1d9c3f] bg-clip-text text-transparent drop-shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Discovery
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 text-center mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ zIndex: 1 }}
        >
          Discover new recipes here!
        </motion.p>
      </div>

      <div className="flex justify-center w-full mb-2">
        <div className="relative w-full max-w-[30%] mx-5 my-1 p-2 px-12 bg-white border border-gray-500 rounded-full text-lg text-gray-900">
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none text-left"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4 px-60">
        {Object.entries(activeFilters).map(([category, values]) =>
          values.map((value) => (
            <span
              key={`${category}-${value}`}
              className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
            >
              {value}
              <button
                onClick={() => toggleFilter(category, value)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )),
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {Object.entries(filterOptions).map(([category, options]) => (
          <div key={category} className="relative group">
            <button className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors capitalize">
              {category.replace(/([A-Z])/g, " $1").trim()}
            </button>
            <div className="absolute hidden group-hover:block z-10 mt-2 bg-white border rounded-lg shadow-lg p-4 min-w-[200px]">
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters[category].includes(option)}
                    onChange={() => toggleFilter(category, option)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-50 px-10">
        {Object.entries(categoryMap).map(([sectionName, { data, loading }]) => (
          <div key={sectionName} className="flex flex-col">
            <h1 className="font-extralight text-4xl mb-4 mt-4">
              {sectionName}
            </h1>
            <div className="grid grid-cols-5 gap-4 border border-red-500 rounded-lg p-8">
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-200 animate-pulse rounded-lg"
                    ></div>
                  ))
              ) : data && data.length > 0 ? (
                filterRecipes(data)
                  .slice(0, 5)
                  .map((recipe, index) => {
                    console.log(
                      `Rendering recipe ${index} in ${sectionName}:`,
                      recipe,
                    );
                    return (
                      <FoodSocialCard
                        key={recipe.postId || `recipe-${index}`}
                        postId={recipe.postId || `recipe-${index}`}
                        title={recipe.title || "Untitled Recipe"}
                        description={
                          recipe.description || "No description available"
                        }
                        imageUrl={
                          recipe.imageList?.[0]?.url || "/placeholder.jpg"
                        }
                        author={recipe.author || "Unknown"}
                        authorId={recipe.authorId || ""}
                        datePosted={
                          recipe.datePosted || new Date().toISOString()
                        }
                        cookingTime={recipe.cookingTime || "30 minutes"}
                        difficulty={recipe.difficulty || "Medium"}
                        servings={recipe.servings || 4}
                        ingredients={
                          Array.isArray(recipe.ingredients)
                            ? recipe.ingredients
                            : []
                        }
                        instructions={
                          Array.isArray(recipe.instructions)
                            ? recipe.instructions
                            : []
                        }
                        likes={recipe.likes || 0}
                        isLiked={recipe.isLiked || false}
                      />
                    );
                  })
              ) : (
                <div className="col-span-5 text-center py-8">
                  <p className="text-gray-500">No recipes found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {sectionName === "Most Liked 💖"
                      ? "Check the most-liked endpoint"
                      : sectionName === "Recently Added"
                        ? "Check the most-recent endpoint"
                        : "This section is not yet implemented"}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discovery;
