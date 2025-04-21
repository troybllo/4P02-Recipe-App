import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FoodSocialCard from "../components/FoodSocialCard";
import { Link } from "react-router-dom";

// Helper function to infer category from various fields
function getCategory(recipe) {
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.join(" ")
    : typeof recipe.ingredients === "string"
      ? recipe.ingredients
      : "";
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.join(" ")
    : typeof recipe.instructions === "string"
      ? recipe.instructions
      : "";
  const combinedText = (
    recipe.title +
    " " +
    recipe.description +
    " " +
    ingredients +
    " " +
    instructions
  ).toLowerCase();

  if (combinedText.includes("beef") || combinedText.includes("steak"))
    return "beef";
  if (combinedText.includes("lobster") || combinedText.includes("seafood"))
    return "seafood";
  if (combinedText.includes("vegetable") || combinedText.includes("salad"))
    return "vegetable";
  if (combinedText.includes("chili") || combinedText.includes("spicy"))
    return "spicy";
  return "other";
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for recipes and user information
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasFollowing, setHasFollowing] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check if user is logged in and fetch their feed
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!userId || !token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    setIsLoggedIn(true);

    // Fetch the user's feed
    const fetchUserFeed = async () => {
      try {
        // Fetch the feed of recipes from users the current user follows
        const feedResponse = await fetch(
          `http://127.0.0.1:5000/api/profile/feed/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (feedResponse.ok) {
          const feedData = await feedResponse.json();
          const feedRecipes = feedData.recipes || [];

          if (feedRecipes.length > 0) {
            setHasFollowing(true);
            setRecipes(feedRecipes);
          } else {
            // User follows people but they have no recipes, or user doesn't follow anyone
            setHasFollowing(false);

            // Check if user is following anyone
            const userResponse = await fetch(
              `http://127.0.0.1:5000/api/profile/${username}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (userResponse.ok) {
              const userData = await userResponse.json();
              const following = userData.following || [];
              setHasFollowing(following.length > 0);
            }
          }

          // Fetch suggested users to follow
          fetchSuggestedUsers(userId);
          setIsLoading(false);
        } else {
          const errorData = await feedResponse.json();
          setError(errorData.error || "Failed to fetch feed");
          setIsLoading(false);
        }
      } catch (error) {
        setError("Network error. Please try again.");
        setIsLoading(false);
      }
    };

    fetchUserFeed();
  }, [refreshTrigger]);

  // Fetch suggested users to follow
  const fetchSuggestedUsers = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      // Call the new suggested users API endpoint
      const response = await fetch(
        `http://127.0.0.1:5000/api/profile/suggested/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const suggestedUsers = data.users || [];
        setSuggestedUsers(suggestedUsers);
      } else {
        console.error("Failed to fetch suggested users");
        // If API call fails, fall back to empty array
        setSuggestedUsers([]);
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
      setSuggestedUsers([]);
    }
  };

  // Handle following a user
  const handleFollowUser = async (targetUserId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/profile/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentUserId: userId,
          targetUserId: targetUserId,
        }),
      });

      if (response.ok) {
        // Trigger a refresh of the feed
        setRefreshTrigger((prev) => prev + 1);
      } else {
        const data = await response.json();
        console.error("Follow error:", data.error);
      }
    } catch (error) {
      console.error("Follow user error:", error);
    }
  };

  // Get filtered recipes
  const getFilteredRecipes = () => {
    if (!recipes || !Array.isArray(recipes)) {
      return [];
    }

    return recipes.filter((recipe) => {
      const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients.join(" ")
        : typeof recipe.ingredients === "string"
          ? recipe.ingredients
          : "";
      const instructions = Array.isArray(recipe.instructions)
        ? recipe.instructions.join(" ")
        : typeof recipe.instructions === "string"
          ? recipe.instructions
          : "";
      const title = recipe.title || "";
      const description = recipe.description || "";

      const combinedText = (
        title +
        " " +
        description +
        " " +
        ingredients +
        " " +
        instructions
      ).toLowerCase();

      const matchesFilter = activeFilter
        ? getCategory(recipe) === activeFilter
        : true;
      const matchesSearch = searchQuery
        ? combinedText.includes(searchQuery.toLowerCase())
        : true;
      return matchesFilter && matchesSearch;
    });
  };

  const filteredRecipes = getFilteredRecipes();

  const handleFilterClick = (filterName) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const filterButtonVariants = {
    active: {
      scale: 1.05,
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    },
    inactive: {
      scale: 1,
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    },
    tap: { scale: 0.97 },
  };

  // Not logged in view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4"
        >
          <div className="text-center">
            <motion.div
              className="text-6xl mb-6 inline-block"
              animate={{
                rotate: [0, -5, 5, -5, 0],
                transition: {
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "reverse",
                },
              }}
            >
              👨‍🍳
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Recipe Social
            </h2>
            <p className="text-gray-600 mb-8">
              Please log in to see recipes from people you follow and discover
              new culinary inspirations!
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => (window.location.href = "/login")}
                className="px-6 py-3 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log In
              </motion.button>
              <motion.button
                onClick={() => (window.location.href = "/signup")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <motion.div
            className="w-20 h-20 border-4 border-[#1d9c3f] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="pt-16 max-w-7xl mx-auto"
        >
          {/* Filter buttons */}
          <motion.div
            className="flex flex-wrap gap-2 justify-center py-6 bg-white shadow-sm rounded-xl mb-6"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => handleFilterClick("beef")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === "beef"
                  ? "bg-[#1d9c3f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              variants={filterButtonVariants}
              animate={activeFilter === "beef" ? "active" : "inactive"}
              whileHover="hover"
              whileTap="tap"
            >
              Beef
            </motion.button>
            <motion.button
              onClick={() => handleFilterClick("seafood")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === "seafood"
                  ? "bg-[#1d9c3f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              variants={filterButtonVariants}
              animate={activeFilter === "seafood" ? "active" : "inactive"}
              whileHover="hover"
              whileTap="tap"
            >
              Seafood
            </motion.button>
            <motion.button
              onClick={() => handleFilterClick("vegetable")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === "vegetable"
                  ? "bg-[#1d9c3f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              variants={filterButtonVariants}
              animate={activeFilter === "vegetable" ? "active" : "inactive"}
              whileHover="hover"
              whileTap="tap"
            >
              Vegetable
            </motion.button>
            <motion.button
              onClick={() => handleFilterClick("spicy")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === "spicy"
                  ? "bg-[#1d9c3f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              variants={filterButtonVariants}
              animate={activeFilter === "spicy" ? "active" : "inactive"}
              whileHover="hover"
              whileTap="tap"
            >
              Spicy
            </motion.button>

            {/* Search input */}
            <div className="relative w-full md:w-80 mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full px-4 py-2 rounded-full border transition-all duration-300 ${
                  isSearchFocused
                    ? "border-[#1d9c3f] shadow-sm"
                    : "border-gray-200"
                }`}
              />
              <motion.button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500"
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchQuery("")}
                style={{ display: searchQuery ? "flex" : "none" }}
              >
                ✕
              </motion.button>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6 px-4">
            {/* Main feed */}
            <motion.div
              className="md:w-2/3 bg-white rounded-xl shadow-sm p-6"
              variants={itemVariants}
            >
              {error ? (
                <div className="text-red-500 text-center py-8 text-lg">
                  {error}
                </div>
              ) : !hasFollowing ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{
                      rotate: [0, -5, 5, -5, 0],
                      transition: {
                        repeat: Infinity,
                        duration: 2,
                        repeatType: "reverse",
                      },
                    }}
                  >
                    👨‍🍳
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    Start following chefs!
                  </h3>
                  <p className="text-gray-500 mb-6 text-center">
                    Follow other users to see their delicious recipes in your
                    feed
                  </p>
                  <p className="text-gray-600 mb-4 text-center max-w-md">
                    Check out the suggested users on the right to start building
                    your feed.
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filteredRecipes.length === 0 ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className="text-5xl mb-4"
                        animate={{
                          rotate: [0, -5, 5, -5, 0],
                          transition: {
                            repeat: Infinity,
                            duration: 2,
                            repeatType: "reverse",
                          },
                        }}
                      >
                        😕
                      </motion.div>
                      <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                        No matching recipes
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your search or filters
                      </p>
                      <motion.button
                        onClick={() => {
                          setActiveFilter(null);
                          setSearchQuery("");
                        }}
                        className="px-4 py-2 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear filters
                      </motion.button>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 gap-8">
                      {filteredRecipes.map((recipe, index) => (
                        <motion.div
                          key={recipe.id || recipe.postId || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.05,
                            ease: "easeOut",
                          }}
                          className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                          <div className="p-4 border-b border-gray-100">
                            {recipe.username && (
                              <div className="flex items-center">
                                <Link to={`/profile/${recipe.username}`}>
                                  <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {recipe.profileImageUrl ? (
                                      <img
                                        src={recipe.profileImageUrl}
                                        alt={recipe.username}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center font-semibold text-sm">
                                        {recipe.username[0]}
                                      </div>
                                    )}
                                  </div>
                                </Link>
                                <Link to={`/profile/${recipe.username}`}>
                                  <span className="font-medium ml-3">
                                    {recipe.username}
                                  </span>
                                </Link>
                              </div>
                            )}
                          </div>
                          <div className="w-full">
                            <FoodSocialCard
                              id={recipe.id || recipe.postId}
                              postId={recipe.id || recipe.postId}
                              title={recipe.title || "Untitled Recipe"}
                              description={
                                recipe.description || "No description available"
                              }
                              imageUrl={
                                recipe.imageUrl || recipe.imageList?.[0]?.url
                              }
                              imageList={recipe.imageList}
                              author={
                                recipe.author || recipe.username || "Unknown"
                              }
                              authorId={recipe.authorId || recipe.userId}
                              userId={localStorage.getItem("userId")}
                              datePosted={
                                recipe.datePosted ||
                                recipe.date ||
                                new Date().toISOString()
                              }
                              cookingTime={
                                recipe.cookingTime ||
                                recipe.time ||
                                "30 minutes"
                              }
                              difficulty={recipe.difficulty || "Medium"}
                              servings={recipe.servings || recipe.serves || 4}
                              ingredients={recipe.ingredients || []}
                              instructions={recipe.instructions || []}
                              likes={recipe.likes || recipe.likesCount || 0}
                              isLiked={recipe.isLiked || false}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div className="md:w-1/3" variants={itemVariants}>
              {/* User profile card */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center">
                  <img
                    src={
                      localStorage.getItem("profileImageUrl") ||
                      "https://via.placeholder.com/50"
                    }
                    alt="Your profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#1d9c3f]"
                  />
                  <div className="ml-3">
                    <h3 className="font-bold text-lg">
                      {localStorage.getItem("username") || "User"}
                    </h3>
                    <p className="text-gray-500 text-sm">Your Profile</p>
                  </div>
                </div>
              </div>

              {/* Suggested users to follow */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4">Suggested for you</h3>

                {suggestedUsers.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedUsers.map((user, index) => (
                      <div
                        key={user.userId || index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <img
                            src={
                              user.profileImageUrl ||
                              "https://via.placeholder.com/40"
                            }
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-3">
                            <p className="font-medium">{user.username}</p>
                            <p className="text-gray-500 text-xs">
                              Suggested for you
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleFollowUser(user.userId)}
                          className="text-[#1d9c3f] font-medium text-sm hover:text-[#187832]"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Follow
                        </motion.button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No suggestions available
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
