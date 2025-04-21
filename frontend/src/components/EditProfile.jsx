import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "../styles/CreatePost.module.css";

const API = process.env.REACT_APP_API_URL;

const EditProfile = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    image: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentUser?.imageUrl || null);

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        username: currentUser?.username || "",
        bio: currentUser?.bio || "",
        image: null,
      });
      setPreview(currentUser?.imageUrl || null);
    }
  }, [isOpen, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

      if (!res.ok) {
        if (
          res.status === 400 &&
          result.error &&
          (result.error.includes("username") ||
            result.error.includes("Username"))
        ) {
          setError(
            "This username is already taken. Please choose a different one.",
          );
          console.error("❌ Username already taken:", result.error);
          setLoading(false);
          return;
        }

        throw new Error(result.error || "Profile update failed");
      }

      console.log("✅ Profile updated:", result);

      if (onSubmit) {
        const updatedProfile = {
          profile: {
            username: formData.username,
            bio: formData.bio,
            ...result,
          },
        };
        onSubmit(updatedProfile);
      }
      setLoading(false);
      onClose();
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  // Disable scrolling when modal is open
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

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[99999] overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
        style={{ zIndex: 99998 }}
      />

      <div
        className="w-full max-w-2xl p-8 bg-white shadow-2xl rounded-2xl relative m-4 max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 99999 }}
        onClick={(e) => e.stopPropagation()}
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Edit Profile
          </h2>
          <p className="text-gray-500">Update your personal information</p>
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

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="flex flex-col md:flex-row gap-6 mb-2">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <label
                  htmlFor="image"
                  className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2 md:text-left">
                Click the camera icon to change
              </p>
            </div>

            <div className="flex-grow space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be displayed on your profile and posts
                </p>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A short description that will appear on your profile
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
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
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditProfile;

