import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MyTipTapEditor from "../components/MyTipTapEditor";
import { recipes as staticRecipes } from "../data/recipes";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editorHtml, setEditorHtml] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log("🔍 Fetching recipe from Firebase...");
        const response = await fetch(`http://127.0.0.1:5000/api/recipes/${id}`);
        if (!response.ok) throw new Error("Not in Firebase");

        const data = await response.json();
        setRecipe(data);
        generateEditorHtml(data);
      } catch (err) {
        console.warn("⚠️ Fallback to static data:", err.message);
        const fallback = staticRecipes.find((r) => String(r.postId) === id);
        setRecipe(fallback || null);
        generateEditorHtml(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const parseField = (field) => {
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : field.split(",").map((x) => x.trim());
      } catch {
        return field.split(",").map((x) => x.trim());
      }
    }
    return [];
  };

  const generateEditorHtml = (data) => {
    if (!data || typeof data !== "object") return;

    const ingredients = parseField(data.ingredients);
    const instructions = parseField(data.instructions);
    const imgSrc = data.imageList?.[0]?.url || data.imageUrl || "";

    const ingredientsHtml = ingredients.map((i) => `<li>${i}</li>`).join("");
    const instructionsHtml = instructions.map((s) => `<li>${s}</li>`).join("");

    setEditorHtml(`
      <h1>${data.title || ""}</h1>
      <p><em>${data.description || ""}</em></p>
      ${imgSrc ? `<img src="${imgSrc}" alt="${data.title}" style="max-width:100%" />` : ""}
      <h3>Ingredients</h3><ul>${ingredientsHtml}</ul>
      <h3>Instructions</h3><ol>${instructionsHtml}</ol>
    `);
  };

  const handleSave = () => {
    console.log("💾 Edited HTML:", editorHtml);
    setEditMode(false);
  };

  if (loading) return <div className="p-6">Loading recipe...</div>;
  if (!recipe) return <div className="p-6 text-red-600">Recipe not found!</div>;

  const imgSrc = recipe.imageList?.[0]?.url || recipe.imageUrl || "";
  const ingredients = parseField(recipe.ingredients);
  const instructions = parseField(recipe.instructions);

  return editMode ? (
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
  ) : (
    <div className="max-w-3xl mx-auto py-8 px-4 pt-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <p className="text-gray-500 italic">{recipe.description}</p>
        {imgSrc && (
          <img
            src={imgSrc}
            alt={recipe.title}
            className="w-full h-auto mt-4 rounded-md object-cover"
          />
        )}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <button className="border px-3 py-1 rounded-lg hover:bg-gray-100">Print</button>
        <button className="border px-3 py-1 rounded-lg hover:bg-gray-100">Nutrition Label</button>
        <div className="ml-auto">
          Servings: <strong>{recipe.servings || "N/A"}</strong>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside">
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal list-inside space-y-1">
          {instructions.map((step, index) => (
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
