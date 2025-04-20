import React, { useState } from "react";
import styles from "../styles/CreatePost.module.css";

const API = process.env.REACT_APP_API_URL;

const EditProfile = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const userId = localStorage.getItem("userId");
  
  // Use currentUser prop to initialize form data
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    image: null,
  });
  
  // Add error state for showing validation errors
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing again
    if (error) setError("");
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
    
    // Clear any previous errors
    setError("");

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

      console.log("🧪 Submitting formData:", {
        username: formData.username,
        bio: formData.bio,
        image: formData.image ? formData.image.name : null,
      });

      console.log("📤 Sending PUT request to:", `${API}/api/profile/${userId}`);
      
      const res = await fetch(`${API}/api/profile/${userId}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();
      
      // Check for error responses
      if (!res.ok) {
        // Handle 400 response specifically for username taken
        if (res.status === 400 && result.error && 
            (result.error.includes("username") || result.error.includes("Username"))) {
          setError("This username is already taken. Please choose a different one.");
          console.error("❌ Username already taken:", result.error);
          return;
        }
        
        // Handle other errors
        throw new Error(result.error || "Profile update failed");
      }

      console.log("✅ Profile updated:", result);
      
      // Close modal and notify parent component of successful update
      if (onSubmit) {
        // Create properly formatted profile object for parent component
        const updatedProfile = {
          profile: {
            username: formData.username,
            bio: formData.bio,
            // Include other fields that might be returned by the API
            ...result
          }
        };
        onSubmit(updatedProfile);
      }
      onClose();
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.title}>Edit Profile</h2>

        {/* Display error message if present */}
        {error && (
          <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}

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