import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FoodSocialCard from "../components/FoodSocialCard";
import EditProfile from "../components/EditProfile";
import UserListModal from "../components/UserListModal";
import CreatePost from "../components/CreatePost"; // Import CreatePost component
import Masonry from "react-masonry-css";
import { useAuth } from "../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const breakpointColumnsObj = {
  default: 3,
  1440: 3,
  1920: 3,
  1680: 3,
  1280: 3,
  1080: 2,
  824: 2,
  640: 1,
};

const Profile = () => {
  const { profileUsername } = useParams();
  const navigate = useNavigate();
  const { currentUser, logout, checkAuth } = useAuth();

  const [profileData, setProfileData] = useState({
    username: null,
    bio: null,
    profileImageUrl: null,
    userId: null,
    followers: [],
    following: [],
    recipes: [],
    savedPosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false); // New state for CreatePost modal
  const [showPosts, setShowPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // If currentUser is properly structured with username property
  const isOwnProfile =
    currentUser?.user && profileUsername === currentUser.user.username;

  console.log("Current user:", currentUser);
  console.log("Profile username:", profileUsername);
  console.log("Is own profile:", isOwnProfile);

  // Handle create post modal
  const handleOpenCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false);
  };

  const handleCreatePostSuccess = () => {
    setIsCreatePostOpen(false);
    // Refresh the profile after creating a new post
    setProfileUpdated(true);
  };

  useEffect(() => {
    // Redirect to login if no username provided and user not logged in
    if (!profileUsername && !currentUser) {
      navigate("/signin");
      return;
    }

    // If viewing base /profile with no username param and user is logged in
    if (!profileUsername && currentUser?.user?.username) {
      navigate(`/profile/${currentUser.user.username}`);
      return;
    }

    const fetchProfileData = async () => {
      if (!profileUsername) return;

      setLoading(true);

      try {
        // Add cache-busting parameter to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(
          `http://127.0.0.1:5000/api/profile/${profileUsername}?_t=${timestamp}`,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile data from API:", data);

        // Sort recipes by date
        const sortedRecipes = (data.recipes || []).sort(
          (a, b) => new Date(b.datePosted) - new Date(a.datePosted),
        );

        // Store API response directly in profileData
        setProfileData({
          ...data, // Include all fields from the API response
          recipes: sortedRecipes, // Override recipes with sorted version
          followers: data.followers || [], // Ensure followers is an array
          following: data.following || [], // Ensure following is an array
          savedPosts:  data.savedPosts  || [],
        });

        // Only check following status if this is not the user's own profile
        if (!isOwnProfile && currentUser && data.userId) {
          // Get the current user ID (from different possible locations)
          const currentUserId = currentUser.user?.id || currentUser.userId;

          if (currentUserId) {
            // Call the server to check follow status
            checkFollowStatusFromServer(currentUserId, data.userId);
          }
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();

    // Reset the profileUpdated flag after fetching
    if (profileUpdated) {
      setProfileUpdated(false);
    }
  }, [profileUsername, currentUser, isOwnProfile, navigate, profileUpdated]);

  // Function to check follow status from server
  const checkFollowStatusFromServer = async (currentUserId, targetUserId) => {
    try {
      // Use the correct API endpoint with the expected query parameters
      const url = `http://127.0.0.1:5000/api/profile/isFollowing?userId=${currentUserId}&targetId=${targetUserId}`;
      console.log("Checking follow status from server with URL:", url);

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        console.log("Server response for follow status:", data);

        // Update the following state based on server response
        setIsFollowing(data.isFollowing);

        // Optionally update localStorage to match server state
        updateLocalStorageFollowing(targetUserId, data.isFollowing);
      } else {
        console.error("Error checking follow status:", await response.text());
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
      setIsFollowing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/landing");
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    // Get the current user ID
    const currentUserId = currentUser.user?.id || currentUser.userId;
    const targetUserId = profileData.userId;

    // Validate we have the required IDs
    if (!currentUserId || !targetUserId) {
      console.error("Missing user IDs for follow/unfollow:", {
        currentUserId,
        targetUserId,
      });
      return;
    }

    try {
      // Use the correct endpoint for follow/unfollow
      const endpoint = isFollowing
        ? "http://127.0.0.1:5000/api/profile/unfollow"
        : "http://127.0.0.1:5000/api/profile/follow";

      console.log("Follow toggle - sending currentUserId:", currentUserId);
      console.log("Follow toggle - sending targetUserId:", targetUserId);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: currentUserId,
          targetUserId: targetUserId,
        }),
      });

      if (response.ok) {
        // Toggle following state for immediate UI update
        const newFollowingState = !isFollowing;
        setIsFollowing(newFollowingState);

        // Update follower count in UI immediately
        if (newFollowingState) {
          setProfileData((prev) => ({
            ...prev,
            followers: [...prev.followers, currentUserId],
          }));
        } else {
          setProfileData((prev) => ({
            ...prev,
            followers: prev.followers.filter((id) => id !== currentUserId),
          }));
        }

        // Update localStorage to reflect the change
        updateLocalStorageFollowing(targetUserId, newFollowingState);

        console.log(
          `Successfully ${isFollowing ? "unfollowed" : "followed"} user`,
        );
      } else {
        const errorData = await response.json();
        console.error("Error following/unfollowing:", errorData);
      }
    } catch (error) {
      console.error(
        `Error ${isFollowing ? "unfollowing" : "following"} user:`,
        error,
      );
    }
  };

  const handleSaveToggle = (recipeId, isNowSaved) => {
    setProfileData(prev => ({
      ...prev,
      savedPosts: isNowSaved
        ? [...prev.savedPosts, recipeId]
        : prev.savedPosts.filter(id => id !== recipeId)
    }));
  };

  // Function to update following list in localStorage
  const updateLocalStorageFollowing = (targetUserId, isNowFollowing) => {
    try {
      const userDataString = localStorage.getItem("user");
      if (!userDataString) {
        console.error("No user data in localStorage");
        return;
      }

      const userData = JSON.parse(userDataString);

      // Initialize following array if it doesn't exist
      if (!userData.following) {
        userData.following = [];
      }

      if (isNowFollowing) {
        // Add user to following list if not already there
        if (!userData.following.includes(targetUserId)) {
          userData.following.push(targetUserId);
        }
      } else {
        // Remove user from following list
        userData.following = userData.following.filter(
          (id) => id !== targetUserId,
        );
      }

      // Save updated user data back to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("Updated localStorage following:", userData.following);
    } catch (error) {
      console.error("Error updating localStorage following:", error);
    }
  };

  const formatBio = (bio) => {
    if (!bio) return "";
    const words = bio.split(" ");
    return words.map((w, i) => ((i + 1) % 10 === 0 ? w + "\n" : w)).join(" ");
  };

  // Use profileData directly instead of profileData.user
  const username = profileData.username || profileUsername || "User";

  // FIXED: Access bio directly from profileData, not from a nested user object
  let bio;
  if (profileData.bio != null && profileData.bio !== "") {
    bio = profileData.bio;
    console.log("Using bio from API profile data:", bio);
  } else {
    bio = "This user hasn't added a bio yet.";
    console.log("Using default bio message - no bio found in API response");
  }

  const profilePic =
    profileData.profileImageUrl ||
    "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";

  // Debugging output
  console.log("Full profile data:", profileData);
  console.log("Username being displayed:", username);
  console.log("Bio being displayed:", bio);
  console.log("Follower count:", profileData.followers?.length || 0);
  console.log("Following count:", profileData.following?.length || 0);

  const handleProfileUpdate = async (updatedUser) => {
    console.log("Profile updated with:", updatedUser);

    // Check if there's an error in the update response
    if (updatedUser.error) {
      console.error("Profile update failed:", updatedUser.error);
      // Error is already displayed in the EditProfile component
      return;
    }

    try {
      // Check if username was changed - note that the username is in updatedUser.profile.username
      const usernameChanged =
        updatedUser.profile &&
        updatedUser.profile.username &&
        currentUser?.user?.username !== updatedUser.profile.username;

      console.log("Username changed:", usernameChanged);

      // Close the modal first
      setIsEditProfileOpen(false);

      if (usernameChanged) {
        // If username changed, log the user out and have them sign in again
        console.log("Username was changed - logging out");

        // Notify the user first
        alert(
          "Your username has been updated to " +
            updatedUser.profile.username +
            ". Please sign in again with your new username.",
        );

        // Perform logout - make sure we're calling the actual logout function
        if (typeof logout === "function") {
          try {
            logout();
            console.log("Logout successful");
          } catch (logoutError) {
            console.error("Error during logout:", logoutError);
          }
        } else {
          console.error("Logout function is not available:", logout);
        }

        // Clear any remaining auth data to be sure
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // Redirect to login page
        navigate("/signin");
      } else {
        // For other updates, just refresh the profile
        setProfileUpdated(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating your profile. Please try again.");
    }
  };

  // Determine dynamic column count: if there are less than 3 recipes, use that count
  const recipeCount = profileData.recipes?.length || 0;
  const masonryColumns =
    showPosts && recipeCount > 0 && recipeCount < breakpointColumnsObj.default
      ? recipeCount
      : breakpointColumnsObj.default;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Profile Header */}
        <div className="relative overflow-hidden border-b border-gray-200 pb-8">
          {/* Decorative Background Element */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-green-50 to-blue-50 opacity-50"></div>
            <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-gradient-to-br from-green-100 to-green-200 opacity-20"></div>
            <div className="absolute -left-24 top-10 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 opacity-20"></div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0 relative">
              <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={profilePic}
                  alt={`${username}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-grow mt-2 md:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {username}
                </h1>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <>
                      <button
                        onClick={() => setIsEditProfileOpen(true)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center shadow-sm"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white border border-red-200 rounded-full text-sm font-medium text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                      >
                        <svg
                          className="w-4 h-4 inline-block mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </>
                  ) : currentUser ? (
                    <button
                      onClick={handleFollowToggle}
                      className={`px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-all ${
                        isFollowing
                          ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Stats row */}
              <div className="flex mt-4 gap-8">
                <div className="flex gap-8">
                  <div
                    className="flex items-end gap-1 cursor-pointer group"
                    onClick={() =>
                      profileData.recipes?.length > 0 && setShowPosts(true)
                    }
                  >
                    <span className="text-xl font-semibold">
                      {profileData.recipes?.length || 0}
                    </span>
                    <span className="text-gray-500 text-sm group-hover:text-gray-700 transition-colors">
                      Posts
                    </span>
                  </div>

                  <div
                    className="flex items-end gap-1 cursor-pointer group"
                    onClick={() => setShowFollowersModal(true)}
                  >
                    <span className="text-xl font-semibold">
                      {profileData.followers?.length || 0}
                    </span>
                    <span className="text-gray-500 text-sm group-hover:text-gray-700 transition-colors">
                      Followers
                    </span>
                  </div>

                  <div
                    className="flex items-end gap-1 cursor-pointer group"
                    onClick={() => setShowFollowingModal(true)}
                  >
                    <span className="text-xl font-semibold">
                      {profileData.following?.length || 0}
                    </span>
                    <span className="text-gray-500 text-sm group-hover:text-gray-700 transition-colors">
                      Following
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {formatBio(bio)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-gray-200 mt-8">
          <div className="flex justify-center space-x-8">
            <button
              className={`pb-4 px-1 transition-all relative ${
                showPosts
                  ? "text-green-600 font-medium border-b-2 border-green-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setShowPosts(true)}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span>Posts</span>
              </div>
            </button>

            {isOwnProfile && (
              <button
                className={`pb-4 px-1 transition-all relative ${
                  !showPosts
                    ? "text-green-600 font-medium border-b-2 border-green-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setShowPosts(false)}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <span>Saved</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {showPosts ? (
                profileData.recipes && profileData.recipes.length > 0 ? (
                  // ← replaced Masonry with Tailwind grid
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profileData.recipes.map((recipe) => (
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
                        author={username}
                        authorId={profileData.userId}
                        likes={recipe.likes || 0}
                        isSaved={recipe.isSaved || false}
                        isLiked={recipe.isLiked || false}
                        onSaveToggle={(recipeId, newIsSaved) => {
                          setProfileData(prev => ({
                            ...prev,                                // ← use three dots, not a Unicode ellipsis
                            savedPosts: newIsSaved
                              ? [...prev.savedPosts, recipeId]
                              : prev.savedPosts.filter(id => id !== recipeId)
                          }));
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-lg">
                    {/* … "No posts yet" placeholder unchanged … */}
                  </div>
                )
              ) : (
                profileData.savedPosts?.length > 0 ? (
                  <AnimatePresence>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {profileData.recipes
                        .filter((r) => profileData.savedPosts.includes(r.postId))
                        .map((recipe) => (
                          <motion.div
                            key={recipe.postId}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <FoodSocialCard
                              {...recipe}
                              isSaved={true}
                              onSaveToggle={handleSaveToggle}
                            />
                          </motion.div>
                        ))}
                    </div>
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">You haven’t saved any recipes yet.</p>
                  </div>
                )
              )}
            </>
          )}
        </div>

      </div>

      {/* EditProfile modal */}
      {isOwnProfile && (
        <EditProfile
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSubmit={handleProfileUpdate}
          currentUser={currentUser?.user}
        />
      )}

      {/* CreatePost modal */}
      {isCreatePostOpen && (
        <CreatePost
          isOpen={isCreatePostOpen}
          onClose={handleCloseCreatePost}
          onSuccess={handleCreatePostSuccess}
        />
      )}

      {/* Follower/Following Modals */}
      <UserListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        type="followers"
        userId={profileData.userId}
        username={username}
        userIds={profileData.followers || []}
      />

      <UserListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        type="following"
        userId={profileData.userId}
        username={username}
        userIds={profileData.following || []}
      />
    </>
  );
};

export default Profile;
