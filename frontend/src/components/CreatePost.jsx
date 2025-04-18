// src/components/CreatePost.js
import React, { useState } from "react";
import styles from "../styles/CreatePost.module.css";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const CreatePost = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cookingTime: "",
    difficulty: "Easy",
    servings: "",
    ingredients: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username") || "Anonymous";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.title || !userId) {
        throw new Error("Title and user authentication are required");
      }

      const ingredientsArray = formData.ingredients
        .split("\n")
        .filter((item) => item.trim() !== "");
      const instructionsArray = formData.instructions
        .split("\n")
        .filter((item) => item.trim() !== "");

      const recipeData = {
        title: formData.title,
        description: formData.description,
        cookingTime: formData.cookingTime,
        difficulty: formData.difficulty,
        servings: Number(formData.servings),
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        imageUrls: [], // Placeholder
        authorId: userId,
        author: username,
        likes: 0,
        isLiked: false,
        dateposted: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "Recipes"), recipeData);
      setSuccess(`Recipe created with ID: ${docRef.id}`);

      setFormData({
        title: "",
        description: "",
        cookingTime: "",
        difficulty: "Easy",
        servings: "",
        ingredients: "",
        instructions: "",
      });

      if (onClose) onClose();
    } catch (err) {
      setError(err.message || "Error creating recipe");
      console.error("Error creating recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
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
              placeholder="1 cup rice\n2 cloves garlic\n..."
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="instructions">Instructions (one step per line)</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="1. Preheat oven\n2. Mix ingredients\n..."
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Creating..." : "Create Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
