import React, { useState } from "react";
import styles from "../styles/CreatePost.module.css";
import {username} from "../pages/Profile.jsx";
import {bio} from "../pages/Profile.jsx"

const EditProfile = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: username,
    bio: bio,
    cookingTime: "",
    difficulty: "Easy",
    servings: "",
    ingredients: "",
    instructions: "",
    image: null,
  });

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
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Edit Profile</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Edit Username</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter new username..."
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Edit Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="image">Change Profile Picture</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required
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
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
