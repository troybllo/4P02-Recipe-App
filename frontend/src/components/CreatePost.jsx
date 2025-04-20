import React, { useState } from "react";
import styles from "../styles/CreatePost.module.css";

const CreatePost = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cookingTime: "",
    difficulty: "Easy",
    servings: "",
    ingredients: "",
    instructions: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get user ID from local storage (assuming it was stored during login)
  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: files,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!formData.title || !userId) {
        throw new Error("Title and user authentication are required");
      }

      // Create FormData for multipart/form-data submission
      const submitData = new FormData();

      // Add userId
      submitData.append("userId", userId);

      // Add recipe data
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("cookingTime", formData.cookingTime);
      submitData.append("difficulty", formData.difficulty);
      submitData.append("servings", formData.servings);

      // Process ingredients as array (split by newlines)
      const ingredientsArray = formData.ingredients
        .split("\n")
        .filter((item) => item.trim() !== "");
      submitData.append("ingredients", JSON.stringify(ingredientsArray));

      // Process instructions as array (split by newlines)
      const instructionsArray = formData.instructions
        .split("\n")
        .filter((item) => item.trim() !== "");
      submitData.append("instructions", JSON.stringify(instructionsArray));

      // Add images
      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          submitData.append("images", image);
        });
      }

      // Send the request using fetch
      const response = await fetch("http://127.0.0.1:5000/api/recipes", {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        method: "POST",
        body: submitData,
        // Note: Do not set Content-Type with fetch when using FormData
        // It will automatically set the correct multipart boundary
      });

      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`,
        );
      }

      const responseData = await response.json();
      setSuccess(`Recipe created with ID: ${responseData.postId}`);
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        cookingTime: "",
        difficulty: "Easy",
        servings: "",
        ingredients: "",
        instructions: "",
        images: [],
      });

      // Close modal on success if using as a modal
      if (onClose) setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.message || "Error creating recipe");
      console.error("Error creating recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  // If this is a modal component, return null when closed
  if (isOpen === false) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
      style={{ isolation: "isolate" }}
    >
      <div className="w-full max-w-3xl p-8 bg-white shadow-2xl rounded-2xl relative m-4 max-h-[90vh] overflow-y-auto">
        {onClose && (
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create New Recipe
          </h2>
          <p className="text-gray-500">
            Share your culinary masterpiece with the world
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-50 border-l-4 border-red-500">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 rounded-lg bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipe Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What's your recipe called?"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your recipe..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="cookingTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cooking Time
              </label>
              <input
                type="text"
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                placeholder="e.g., 45 mins"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="servings"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Servings
              </label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="Number of servings"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ingredients (one per line)
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="1 cup rice&#10;2 cloves garlic&#10;..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-h-[150px]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="instructions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Instructions (one step per line)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="1. Preheat oven&#10;2. Mix ingredients&#10;..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-h-[150px]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipe Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                  >
                    <span>Upload images</span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                {formData.images.length > 0 && (
                  <p className="text-sm font-medium text-green-600">
                    {formData.images.length} image(s) selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex-1"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Recipe"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

