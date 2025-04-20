import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  useEffect(() => {
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
      toast.error("You do not have permission to edit this recipe.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", recipe.userId);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("cookingTime", form.cookingTime);
      formData.append("difficulty", form.difficulty);
      formData.append("servings", form.servings);
      formData.append("ingredients", JSON.stringify(form.ingredients.split("\n")));
      formData.append("instructions", JSON.stringify(form.instructions.split("\n")));
      if (recipe.newImage) {
        formData.append("image", recipe.newImage);
      }

      const response = await fetch(`http://127.0.0.1:5000/api/recipes/${recipe.postId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("✅ Recipe updated!");
        setEditMode(false);
        fetchRecipe();
      } else {
        toast.error("❌ Update failed: " + result.error);
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Update error");
    }
  };

  const handleCopyIngredients = () => {
    const text = parseField(recipe.ingredients).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Ingredients copied to clipboard!");
  };

  if (loading) return <div className="p-6">Loading recipe...</div>;
  if (!recipe) return <div className="p-6 text-red-600">Recipe not found!</div>;

  const isOwner = recipe.userId === localStorage.getItem("userId");
  const imgSrc = recipe.imageList?.[0]?.url || recipe.imageUrl || "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="relative h-72 rounded-lg overflow-hidden mb-8 shadow-md">
        <img src={imgSrc} alt={recipe.title} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold text-center px-4">{recipe.title}</h1>
        </div>
      </div>

      {editMode ? (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Recipe Title"
            className="w-full border p-3 rounded-md shadow-sm"
          />

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-md shadow-sm"
              rows={3}
              maxLength={280}
            />
            <p className="text-sm text-gray-500 text-right">{form.description.length}/280 characters</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="cookingTime"
              value={form.cookingTime}
              onChange={handleInputChange}
              placeholder="Cooking Time"
              className="border p-3 rounded-md shadow-sm"
            />
            <input
              type="number"
              name="servings"
              value={form.servings}
              onChange={handleInputChange}
              placeholder="Servings"
              className="border p-3 rounded-md shadow-sm"
            />
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleInputChange}
              className="border p-3 rounded-md shadow-sm"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Ingredients (one per line)</label>
            <textarea
              name="ingredients"
              value={form.ingredients}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-md shadow-sm"
              rows={Math.max(5, form.ingredients.split('\n').length)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Instructions (one step per line)</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-md shadow-sm"
              rows={Math.max(6, form.instructions.split('\n').length)}
            />
          </div>

          {imgSrc && (
            <div className="w-40">
              <img src={imgSrc} alt="Current Recipe" className="rounded-md object-cover shadow-md" />
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setRecipe((prev) => ({ ...prev, newImage: e.target.files[0] }))}
              className="block w-full mt-1"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1 bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
              <ul className="list-disc list-inside text-gray-700 leading-7">
                {parseField(recipe.ingredients).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-xl shadow border">
              <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
              <p><strong>Servings:</strong> {recipe.servings}</p>
              <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow mb-12">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {parseField(recipe.instructions).map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-full shadow">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="sticky bottom-0 bg-white border-t py-4 px-6 flex justify-end gap-3 shadow-sm z-10">
            <button onClick={() => window.print()} className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100">🖨️ Print</button>
            <button onClick={handleCopyIngredients} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">📋 Copy Ingredients</button>
            {isOwner && (
              <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">✏️ Edit Recipe</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
