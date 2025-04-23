import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "../styles/CreatePost.module.css";

const EditPost = ({
  isOpen,
  onClose,
  onSubmit,
  postId,
  title,
  description,
  cookingTime,
  difficulty,
  servings,
  ingredients,
  instructions,
  imageUrl,
  imageList,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cookingTime: "",
    difficulty: "Easy",
    servings: "",
    ingredients: "",
    instructions: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        title: title || "",
        description: description || "",
        cookingTime: cookingTime || "",
        difficulty: difficulty || "Easy",
        servings: servings || "",
        ingredients: Array.isArray(ingredients) ? ingredients.join("\n") : "",
        instructions: Array.isArray(instructions)
          ? instructions.join("\n")
          : "",
        image: imageUrl || (imageList && imageList[0]?.url) || null,
      }));
    }
  }, [
    isOpen,
    title,
    description,
    cookingTime,
    difficulty,
    servings,
    ingredients,
    instructions,
    imageUrl,
    imageList,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async () => {
      const userId = localStorage.getItem("userId");
  
      try {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("cookingTime", cookingTime);
        formData.append("difficulty", difficulty);
        formData.append("servings", servings);
        formData.append("ingredients", JSON.stringify(ingredients.split("\n")));
        formData.append("instructions", JSON.stringify(instructions.split("\n")));
        // if (newImage) {
        //   formData.append("image", newImage);
        // }
  
        const response = await fetch(`/api/recipes/${postId}`, {
          method: "PUT",
          body: formData,
        });
  
        const result = await response.json();
        if (response.ok) {
          console.success("✅ Recipe updated!");
        } else {
          console.error("❌ Update failed: " + result.error);
        }
      } catch (err) {
        console.error("Update error:", err);
      }
    };

  // Disable page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Create the modal JSX
  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[99999] overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      {/* Backdrop with higher opacity for more contrast */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
        style={{ zIndex: 99998 }}
      />

      {/* Modal container with even higher z-index */}
      <div
        className="w-full max-w-3xl p-8 bg-white shadow-2xl rounded-2xl relative m-4 max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 99999 }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to backdrop
      >
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

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Edit Recipe</h2>
          <p className="text-gray-500">Update your culinary masterpiece</p>
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
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipe Image
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
                    htmlFor="image"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                  >
                    <span>Upload a new image</span>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                {typeof formData.image === "string" && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">
                      Current image:
                    </p>
                    <div className="mt-2 w-40 h-40 mx-auto rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={formData.image}
                        alt="Current recipe"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {formData.image instanceof File && (
                  <p className="text-sm font-medium text-green-600 mt-2">
                    New image selected: {formData.image.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex-1"
            >
              Cancel
            </button>
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
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Use ReactDOM.createPortal to render the modal at the end of the document body
  // This ensures it's outside the normal DOM hierarchy and avoids z-index conflicts
  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditPost;
