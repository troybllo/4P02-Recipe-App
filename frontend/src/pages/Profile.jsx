import React, { useEffect, useState } from "react";
import FoodSocialCard from "../components/FoodSocialCard";
import EditProfile from "../components/EditProfile";
import Masonry from "react-masonry-css";
import { useAuth } from "../components/AuthContext";

const breakpointColumnsObj = {
  default: 3,
  1440: 3,
  1280: 2,
  640: 1,
};

const Profile = () => {
  const { logout } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showPosts, setShowPosts] = useState(true);

  const userId = localStorage.getItem("userId");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const username = user?.username || "Guest";
  const bio = user?.bio || "Welcome to Feastly! Edit your profile to update your bio.";
  const profilePic = user?.profileImage || "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/recipes?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user recipes");
        const data = await response.json();
        const sorted = (data.recipes || []).sort(
          (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
        );
        setRecipes(sorted);
      } catch (err) {
        console.error("Error fetching user recipes:", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (userId) {
      fetchUserRecipes();
    }
  }, [userId]);
  

  const handleLogout = () => logout();

  const formatBio = (bio) => {
    const words = bio.split(" ");
    return words.map((w, i) => ((i + 1) % 10 === 0 ? w + "\n" : w)).join(" ");
  };

  return (
    <>
      <div className="text-center my-20">
        {/* Profile Header */}
        <div className="flex mb-5 justify-center items-center">
          <div className="flex items-center border-b-2 py-5">
            <div className="items-center justify-center mr-5">
              <img
                src={profilePic}
                alt="Profile"
                className="rounded-full w-32 h-32"
              />
              <button onClick={() => setIsEditProfileOpen(true)}>
                <p className="border-2 border-gray-300 rounded-full px-4 py-1 mt-3 text-xs">
                  Edit Profile
                </p>
              </button>
              <button
                onClick={handleLogout}
                className="border-2 border-gray-300 rounded-full px-4 py-1 mt-2 text-xs text-red-500"
              >
                Logout
              </button>
            </div>
            <div className="text-left ml-4">
              <p className="text-xs font-thin text-gray-500 pb-1">Username:</p>
              <h2 className="inline-block">{username}</h2>
              <p className="text-xs font-thin text-gray-500 pt-4 pb-1">Short Bio:</p>
              <p className="whitespace-pre-wrap text-sm">{formatBio(bio)}</p>
            </div>
          </div>
        </div>

        {/* Toggle Posts / Saved */}
        <div className="flex justify-center mb-5">
          <button
            className={`mr-2 border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200 ${showPosts ? "bg-gray-200" : ""}`}
            onClick={() => setShowPosts(true)}
          >
            Posts
          </button>
          <button
            className={`mr-2 border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200 ${!showPosts ? "bg-gray-200" : ""}`}
            onClick={() => setShowPosts(false)}
          >
            Saved
          </button>
        </div>

        {/* Grid */}
        <div className="flex justify-center">
          <div className="home-container max-w-[1200px]">
            {loading ? (
              <p className="text-gray-400 text-center">Loading...</p>
            ) : showPosts ? (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid justify-center"
                columnClassName="my-masonry-grid_column"
              >
                {recipes.length > 0 ? (
                  recipes.map((recipe) => (
                    <FoodSocialCard
                      key={recipe.postId}
                      postId={recipe.postId}
                      title={recipe.title}
                      description={recipe.description}
                      cookingTime={recipe.cookingTime}
                      difficulty={recipe.difficulty}
                      servings={recipe.servings}
                      ingredients={recipe.ingredients}
                      instructions={recipe.instructions}
                      imageUrl={
                        recipe.imageList?.[0]?.url ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      datePosted={recipe.datePosted}
                      author={user?.username || "You"}
                      authorId={userId}
                      likes={recipe.likes || 0}
                      isLiked={recipe.isLiked || false}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No posts yet.</p>
                )}
              </Masonry>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg font-semibold">No saved posts yet</p>
                <p className="text-gray-500 mt-2">
                  You haven't saved any recipes yet. Start exploring and save
                  your favorite recipes to see them here.
                </p>
                <button
                  className="mt-5 px-4 py-2 bg-[#ccdec2] text-[#1d380e] rounded-full hover:border-1 border-[#1d380e]"
                  onClick={() => window.location.href = "/discovery"}
                >
                  Discover Recipes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={(updatedUser) => {
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.location.reload(); // optional enhancement: use state instead
        }}
        initialUsername={username}
        initialBio={bio}
      />
    </>
  );
};

export default Profile;
