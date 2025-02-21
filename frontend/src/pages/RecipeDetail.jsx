// src/pages/RecipeDetail.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { recipes } from "../data/recipes";

const RecipeDetail = () => {
  const { id } = useParams();
  const recipe = recipes.find((r) => String(r.postId) === id);
  const [customRecipeText, setCustomRecipeText] = useState("");

  if (!recipe) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Recipe not found!</h1>
        <p>Please check your URL or recipe ID.</p>
      </div>
    );
  }

  const handleSaveNewRecipe = () => {
    console.log("Saving user-typed recipe: ", customRecipeText);
    // Integrate saving functionality here (e.g., post to backend or update state)
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Recipe Title and Description */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <p className="text-gray-500 italic">{recipe.description}</p>
      </div>

      {/* Optional Buttons and Servings Info */}
      <div className="flex items-center gap-2 mb-6">
        <button className="border px-3 py-1 rounded-lg hover:bg-gray-100">
          Print
        </button>
        <button className="border px-3 py-1 rounded-lg hover:bg-gray-100">
          Nutrition Label
        </button>
        <div className="ml-auto">
          Servings: <strong>{recipe.servings || "N/A"}</strong>
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside">
          {Array.isArray(recipe.ingredients) &&
            recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal list-inside space-y-1">
          {Array.isArray(recipe.instructions) &&
            recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
        </ol>
      </div>

      {/* Large Blank Canvas for Custom Recipe/Notes */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">
          Add Your Own Notes or Custom Recipe
        </h2>
        <textarea
          className="w-full h-64 p-2 border border-gray-300 rounded-lg"
          placeholder="Type your recipe here, just like in Microsoft Word..."
          value={customRecipeText}
          onChange={(e) => setCustomRecipeText(e.target.value)}
        />
        <button
          onClick={handleSaveNewRecipe}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save New Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
