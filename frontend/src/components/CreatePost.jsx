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
        .filter(item => item.trim() !== "");
      submitData.append("ingredients", JSON.stringify(ingredientsArray));
      
      // Process instructions as array (split by newlines)
      const instructionsArray = formData.instructions
        .split("\n")
        .filter(item => item.trim() !== "");
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
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
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
      //if (onClose) onClose();
      
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
    <div className={isOpen ? styles.overlay : ""}>
      <div className={isOpen ? styles.modal : styles.container}>
        {isOpen && (
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
        <h2 className={styles.title}>Create New Recipe</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Recipe Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="cookingTime">Cooking Time</label>
              <input
                type="text"
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                placeholder="e.g., 45 mins"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="servings">Servings</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="ingredients">Ingredients (one per line)</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="1 cup rice&#10;2 cloves garlic&#10;..."
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="instructions">
              Instructions (one step per line)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="1. Preheat oven&#10;2. Mix ingredients&#10;..."
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="images">Recipe Images</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              accept="image/*"
              multiple
            />
            {formData.images.length > 0 && (
              <div className="image-preview">
                <p>{formData.images.length} image(s) selected</p>
              </div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;