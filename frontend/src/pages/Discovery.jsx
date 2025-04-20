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
    quickPicks: [],
    easyRecipes: [],
  });
  const [loading, setLoading] = useState({
    mostLiked: true,
    recentlyAdded: true,
    editorsPick: true,
    quickMeals: true,
    quickPicks: true,
    easyRecipes: true,
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

    const fetchQuickPicks = async () => {
      try {
        const response = await fetch(`${API}/api/recipes/quick-picks`);
        const data = await response.json();
        console.log("Quick picks API response:", data);

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

        setCategories((prev) => ({ ...prev, quickPicks: fetched }));
        console.log("Processed quick picks recipes:", fetched);
      } catch (err) {
        console.error("Error fetching quick picks recipes:", err);
      } finally {
        setLoading((prev) => ({ ...prev, quickPicks: false }));
      }
    };

    const fetchEasiest = async () => {
      try {
        const response = await fetch(`${API}/api/recipes/easy-recipes`);
        const data = await response.json();
        console.log("Easiest API response:", data);

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

        setCategories((prev) => ({ ...prev, easyRecipes: fetched }));
        console.log("Processed easiest recipes:", fetched);
      } catch (err) {
        console.error("Error fetching easiest recipes:", err);
      } finally {
        setLoading((prev) => ({ ...prev, easyRecipes: false }));
      }
    };

    const fetchRecentlyAdded = async () => {
      try {
        const response = await fetch(`${API}/api/recipes/most-recent?limit=30`);
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
    fetchEasiest();
    fetchQuickPicks();

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
    "Quick Picks": { data: categories.quickPicks, loading: loading.quickPicks },
    "Easy Meals": {
      data: categories.easyRecipes,
      loading: loading.easyRecipes,
    },
  };

  const editorsTitles = [
    "Chef's Favorite",
    "Must Try",
    "Seasonal Special",
    "Trending Now",
    "Healthy Choice",
  ];

  return (
    <div className="w-full mt-[7rem] bg-gray-50">
      <div className="relative flex flex-col items-center justify-center mb-12 py-12 bg-gradient-to-b from-white to-gray-50">
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-orange-400 via-yellow-200 to-green-500 opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        <motion.h1
          className="relative z-10 text-7xl font-extrabold text-center bg-gradient-to-r from-[#FF7E29] via-[#fceabb] to-[#1d9c3f] bg-clip-text text-transparent drop-shadow-xl tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Culinary Discovery
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 text-center mt-4 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ zIndex: 1 }}
        >
          Explore a world of flavors, techniques and inspiration
        </motion.p>
      </div>

      <div className="flex flex-col items-center justify-center w-full mb-10 px-4">
        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for recipes..."
            className="w-full py-5 pl-16 pr-6 bg-white border-none rounded-full shadow-lg text-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8 w-full max-w-5xl">
          {Object.entries(activeFilters).map(([category, values]) =>
            values.map((value) => (
              <motion.span
                key={`${category}-${value}`}
                className="flex items-center px-5 py-2 text-base bg-indigo-100 text-indigo-800 rounded-full shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {value}
                <button
                  onClick={() => toggleFilter(category, value)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </motion.span>
            )),
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16 w-full max-w-5xl">
          {Object.entries(filterOptions).map(([category, options]) => (
            <div key={category} className="relative group">
              <button className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-700 font-medium capitalize flex items-center gap-2 text-base">
                <span>{category.replace(/([A-Z])/g, " $1").trim()}</span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute hidden group-hover:block z-10 mt-2 bg-white rounded-xl shadow-xl p-5 min-w-[240px] border border-gray-100 right-0">
                {options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters[category].includes(option)}
                      onChange={() => toggleFilter(category, option)}
                      className="form-checkbox h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-gray-800 font-medium text-base">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full px-6 pb-20">
        {Object.entries(categoryMap).map(([sectionName, { data, loading }]) => (
          <div key={sectionName} className="mb-24">
            {sectionName === "Editors Pick" ? (
              <div className="mb-16">
                <motion.div
                  className="relative py-8 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-400 opacity-90 rounded-3xl"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                  <div className="relative z-10 px-12 py-8">
                    <h2 className="text-6xl font-bold text-white mb-3 tracking-tight flex items-center">
                      <span className="text-6xl mr-3">✨</span> {sectionName}
                    </h2>
                    <p className="text-emerald-100 text-xl max-w-2xl">
                      Our team's handpicked selection of extraordinary recipes
                      that are sure to impress.
                    </p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 -mt-6 px-2">
                  {loading ? (
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-96 bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse"
                        >
                          <div className="h-56 bg-gray-200"></div>
                          <div className="p-6">
                            <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))
                  ) : data && data.length > 0 ? (
                    filterRecipes(data)
                      .slice(0, 5)
                      .map((recipe, index) => (
                        <motion.div
                          key={recipe.postId || `recipe-${index}`}
                          className="relative"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <div className="absolute -top-12 left-0 right-0 flex justify-center">
                            <span className="bg-gradient-to-r from-emerald-600 to-green-400 text-white py-2 px-6 rounded-full text-base font-semibold shadow-lg z-10">
                              {editorsTitles[index % editorsTitles.length]}
                            </span>
                          </div>
                          <div className="bg-white rounded-2xl overflow-visible shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 mt-6 border border-gray-100">
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
                          </div>
                        </motion.div>
                      ))
                  ) : (
                    <div className="col-span-5 text-center py-16 bg-white rounded-2xl shadow-sm">
                      <div className="text-6xl mb-4">🍽️</div>
                      <p className="text-gray-600 text-xl font-medium">
                        No recipes found
                      </p>
                      <p className="text-gray-400 text-base mt-2">
                        Stay tuned for our editors' recommendations coming soon!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-20">
                <motion.div
                  className="flex items-center mb-10 px-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {sectionName === "Most Liked 💖" && (
                    <span className="text-5xl mr-5">❤️</span>
                  )}
                  {sectionName === "Recently Added" && (
                    <span className="text-5xl mr-5">🆕</span>
                  )}
                  {sectionName === "Quick Picks" && (
                    <span className="text-5xl mr-5">⏱️</span>
                  )}
                  {sectionName === "Easy Meals" && (
                    <span className="text-5xl mr-5">😌</span>
                  )}
                  <h2
                    className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                    from-gray-700 to-gray-900 tracking-tight"
                  >
                    {sectionName}
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 px-2">
                  {loading ? (
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-96 bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
                        >
                          <div className="h-56 bg-gray-200"></div>
                          <div className="p-6">
                            <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))
                  ) : data && data.length > 0 ? (
                    filterRecipes(data)
                      .slice(0, 5)
                      .map((recipe, index) => (
                        <motion.div
                          key={recipe.postId || `recipe-${index}`}
                          className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border border-gray-100 h-full"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.08 }}
                        >
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
                        </motion.div>
                      ))
                  ) : (
                    <div className="col-span-5 text-center py-16 bg-white rounded-xl shadow-sm">
                      <div className="text-5xl mb-4">
                        {sectionName === "Most Liked 💖"
                          ? "❤️"
                          : sectionName === "Recently Added"
                            ? "🆕"
                            : sectionName === "Quick Picks"
                              ? "⏱️"
                              : "😌"}
                      </div>
                      <p className="text-gray-600 text-xl font-medium">
                        No recipes found
                      </p>
                      <p className="text-gray-400 text-base mt-3">
                        {sectionName === "Most Liked 💖"
                          ? "Be the first to like some amazing recipes!"
                          : sectionName === "Recently Added"
                            ? "New recipes will appear here soon"
                            : sectionName === "Quick Picks"
                              ? "Quick meal ideas are on their way"
                              : "Easy recipe suggestions coming soon"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discovery;
