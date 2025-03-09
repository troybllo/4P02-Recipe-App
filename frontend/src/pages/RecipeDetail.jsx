// src/pages/RecipeDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { recipes } from "../data/recipes";
import MyTipTapEditor from "../components/MyTipTapEditor";

function generateHtmlFromRecipe(recipe) {
  const ingredientsHtml = (recipe.ingredients || [])
    .map((ing) => `<li>${ing}</li>`)
    .join("");
  const instructionsHtml = (recipe.instructions || [])
    .map((step) => `<li>${step}</li>`)
    .join("");

  return `
    <h1>${recipe.title}</h1>
    <p><em>${recipe.description}</em></p>
    ${
      recipe.imageUrl
        ? `<p><img src="${recipe.imageUrl}" alt="${recipe.title}" style="max-width: 100%; height: auto;" /></p>`
        : ""
    }
    <h3>Ingredients</h3>
    <ul>
      ${ingredientsHtml}
    </ul>
    <h3>Instructions</h3>
    <ol>
      ${instructionsHtml}
    </ol>
  `;
}

export default function RecipeDetail() {
  const { id } = useParams();
  const recipe = recipes.find((r) => String(r.postId) === id);

  const [editMode, setEditMode] = useState(false);
  const [editorHtml, setEditorHtml] = useState("");

  useEffect(() => {
    if (recipe) {
      const initialHtml = generateHtmlFromRecipe(recipe);
      setEditorHtml(initialHtml);
    }
  }, [recipe]);

  if (!recipe) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Recipe not found!</h1>
        <p>Please check your URL or recipe ID.</p>
      </div>
    );
  }

  const handleSave = () => {
    console.log("Edited HTML:", editorHtml);
    // Send to backend or update local state
    setEditMode(false);
  };

  if (!editMode) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 pt-20">
        {/* Normal, read-only layout */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <p className="text-gray-500 italic">{recipe.description}</p>
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-auto mt-4 rounded-md object-cover"
            />
          )}
        </div>

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

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc list-inside">
            {Array.isArray(recipe.ingredients) &&
              recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-1">
            {Array.isArray(recipe.instructions) &&
              recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
          </ol>
        </div>

        <div className="mt-10">
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Recipe
          </button>
        </div>
      </div>
    );
  }

  // Edit mode with TipTap
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pt-20">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleSave}
          className="border px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 mr-2"
        >
          Save
        </button>
        <button
          onClick={() => setEditMode(false)}
          className="border px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
      <MyTipTapEditor
        initialContent={editorHtml}
        onUpdate={(newHtml) => setEditorHtml(newHtml)}
      />
    </div>
  );
}
