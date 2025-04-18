import React, { useState } from "react";
import styles from "../styles/CreatePost.module.css";

const EditProfile = ({ isOpen, onClose, onSubmit, initialUsername, initialBio }) => {
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    username: initialUsername || "",
    bio: initialBio || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      if (formData.username.trim() !== "") {
        data.append("username", formData.username);
      }
      if (formData.bio.trim() !== "") {
        data.append("bio", formData.bio);
      }
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await fetch(`http://127.0.0.1:5000/api/users/${userId}/update_profile`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Profile update failed");

      console.log("✅ Profile updated:", result);
      if (onSubmit) onSubmit(result);
      onClose();
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
    }

    console.log("🧪 Submitting formData:", {
      username: formData.username,
      bio: formData.bio,
      image: formData.image,
    });

    console.log("📤 Sending PUT request to:", `http://127.0.0.1:5000/api/users/${userId}/update_profile`);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.title}>Edit Profile</h2>

        <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
          <div className={styles.inputGroup}>
            <label htmlFor="username">Edit Username (optional)</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter new username..."
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="bio">Edit Bio (optional)</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
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
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
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
