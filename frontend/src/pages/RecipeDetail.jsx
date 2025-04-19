
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { recipes as staticRecipes } from "../data/recipes";

export default function RecipeDetail() {
  const { postId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    cookingTime: "",
    difficulty: "Easy",
    servings: "",
    ingredients: "",
    instructions: "",
  });

  const parseField = (field) => {
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [field];
      } catch {
        return field.split(",").map((x) => x.trim());
      }
    }
    return [];
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/recipes/${postId}`);
        if (!response.ok) throw new Error("Not in Firebase");
        const data = await response.json();
        setRecipe(data);
        initializeForm(data);
      } catch (err) {
        const fallback = staticRecipes.find((r) => String(r.postId) === postId);
        setRecipe(fallback || null);
        initializeForm(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [postId]);

  const initializeForm = (data) => {
    if (!data) return;
    setForm({
      title: data.title || "",
      description: data.description || "",
      cookingTime: data.cookingTime || "",
      difficulty: data.difficulty || "Easy",
      servings: data.servings || "",
      ingredients: parseField(data.ingredients).join("\n"),
      instructions: parseField(data.instructions).join("\n"),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!recipe || !recipe.userId) return;
  
    const currentUserId = localStorage.getItem("userId");
    if (recipe.userId !== currentUserId) {
      alert("You do not have permission to edit this recipe.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("userId", recipe.userId);
      formData.append("title", recipe.title);
      formData.append("description", recipe.description);
      formData.append("cookingTime", recipe.cookingTime);
      formData.append("difficulty", recipe.difficulty);
      formData.append("servings", recipe.servings);
      formData.append("ingredients", JSON.stringify(recipe.ingredients));
      formData.append("instructions", JSON.stringify(recipe.instructions));
  
      if (recipe.newImage) {
        formData.append("image", recipe.newImage);
      }
  
      const response = await fetch(`http://127.0.0.1:5000/api/recipes/${recipe.postId}`, {
        method: "PUT",
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("✅ Recipe updated!");
        setEditMode(false);
        setRecipe((prev) => ({
          ...prev,
          imageList: result.imageList || prev.imageList,
          ...form, // updated text data
        }));
      } else {
        alert("❌ Update failed: " + result.error);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Update error");
    }
  };
  

  if (loading) return <div className="p-6">Loading recipe...</div>;
  if (!recipe) return <div className="p-6 text-red-600">Recipe not found!</div>;

  const isOwner = recipe.userId === localStorage.getItem("userId");
  const imgSrc = recipe.imageList?.[0]?.url || recipe.imageUrl || "";

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pt-20">
      {editMode ? (
        <div className="space-y-4">
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

          <input
            type="text"
            className="w-full border p-2 rounded"
            value={form.title}
            name="title"
            onChange={handleInputChange}
            placeholder="Recipe title"
          />

          <textarea
            className="w-full border p-2 rounded"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Short description"
          />

          <div className="flex gap-4">
            <input
              type="text"
              name="cookingTime"
              value={form.cookingTime}
              onChange={handleInputChange}
              className="border p-2 rounded w-1/3"
              placeholder="Cooking Time"
            />
            <input
              type="number"
              name="servings"
              value={form.servings}
              onChange={handleInputChange}
              className="border p-2 rounded w-1/3"
              placeholder="Servings"
            />
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleInputChange}
              className="border p-2 rounded w-1/3"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <textarea
            className="w-full border p-2 rounded"
            name="ingredients"
            value={form.ingredients}
            onChange={handleInputChange}
            rows={5}
            placeholder="Ingredients (one per line)"
          />

          <textarea
            className="w-full border p-2 rounded"
            name="instructions"
            value={form.instructions}
            onChange={handleInputChange}
            rows={6}
            placeholder="Instructions (one per line)"
          />

          {imgSrc && (
            <div className="mt-2">
              <img src={imgSrc} alt="Current Recipe" className="rounded-md max-h-64 object-cover" />
            </div>
          )}

          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setRecipe({ ...recipe, newImage: e.target.files[0] })}
            />
          </div>
        </div>
      ) : (
        <>
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
              {parseField(recipe.ingredients).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside space-y-1">
              {parseField(recipe.instructions).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {isOwner && (
            <div className="mt-10">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Recipe
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
