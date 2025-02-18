import React, { useState } from "react";
import FoodSocialCard from "../components/FoodSocialCard";
import { recipes } from "../utils/sampleData";

import discoveryLogo from "../images/discovery_diamond.png";

const Discovery = () => {
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

  const filteredRecipes = recipes.filter((recipe) => {
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
            return values.some((diet) => recipe.dietary.includes(diet));
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
    const hours = timeString.includes("hour") ? parseInt(timeString) : 0;
    const minutes = parseInt(timeString.match(/\d+/)[0]) || 0;
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

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-8">
        <img
          src={discoveryLogo}
          alt="Discovery Diamond"
          className="w-24 h-24"
        />
        <h1 className="text-2xl font-bold mt-2">Your Discovery</h1>
        <p className="text-gray-600">Discover new recipes here!</p>
      </div>

      <div className="flex justify-center w-full mb-8">
        <div className="relative w-full max-w-[30%] mx-5 my-1 p-3 px-12 bg-white border border-gray-500 rounded-full text-lg text-gray-900">
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none text-left"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8 px-60">
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

      <div className="flex flex-col gap-20 px-60">
        {["Featured Picks", "Latest Recipes", "Staffs Picks", "Trending"].map(
          (section) => (
            <div key={section} className="flex flex-col">
              <h1 className="font-extralight text-3xl mb-4">{section}</h1>
              <div className="grid grid-cols-4 gap-6">
                {filteredRecipes.slice(0, 4).map((recipe) => (
                  <FoodSocialCard key={recipe.id} {...recipe} />
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default Discovery;
