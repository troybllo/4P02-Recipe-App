import React, { useState, useEffect } from "react";
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
  imageUrl, // URL string of existing image
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cookingTime: "",
    difficulty: "Easy",
    servings: "",
    ingredients: "",
    instructions: "",
    image: null, // for new file
  });

  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: title || "",
        description: description || "",
        cookingTime: cookingTime || "",
        difficulty: difficulty || "Easy",
        servings: servings || "",
        ingredients: ingredients?.join("\n") || "",
        instructions: instructions?.join("\n") || "",
        image: null, // we only track newly added image here
      });
      setExistingImageUrl(imageUrl || "");
    }
  }, [isOpen, title, description, cookingTime, difficulty, servings, ingredients, instructions, imageUrl]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass to parent
    onClose(); // Close modal
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Edit Recipe Post</h2>

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
            <label htmlFor="instructions">Instructions (one step per line)</label>
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
            <label htmlFor="image">Recipe Image</label>

            {/* Show current image if no new file selected */}
            {existingImageUrl && !formData.image && (
              <div style={{ marginBottom: "10px" }}>
                <img
                  src={existingImageUrl}
                  alt="Current"
                  style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "6px" }}
                />
              </div>
            )}

            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
