import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import FoodSocialCard from "../components/FoodSocialCard";
import { Link, useParams } from "react-router-dom";

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

// Helper function to ensure recipes is always an array
function ensureRecipesArray(data) {
  if (Array.isArray(data)) {
    return data;
  } else if (data && data.recipes && Array.isArray(data.recipes)) {
    return data.recipes;
  } else if (data && typeof data === "object" && data !== null) {
    return [data];
  } else {
    return [];
  }
}

// Masonry breakpoints
const breakpointColumnsObj = {
  default: 3,
  1700: 3,
  1490: 3,
  1250: 2,
  940: 1,
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { postId } = useParams();

  // State for recipes and user information
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followingRecipes, setFollowingRecipes] = useState([]);
  const [hasFollowing, setHasFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("following");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check if user is logged in and fetch their following list
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    console.log("Auth check:", { userId, token, username });

    if (!userId || !token) {
      console.log("Missing authentication data, not logged in");
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    console.log("User is logged in, fetching profile data");
    setIsLoggedIn(true);

    // Fetch the user's profile and recipes
    const fetchUserProfileAndRecipes = async () => {
      try {
        console.log("Fetching profile for username:", username || "unknown");

        // If username is missing, try to load it using userId
        if (!username) {
          try {
            const userResponse = await fetch(
              `http://127.0.0.1:5000/api/profile/username?userId=${userId}`,
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
              if (userData.username) {
                console.log("Retrieved username:", userData.username);
                localStorage.setItem("username", userData.username);
                // Continue with the retrieved username
                fetchUserData(userData.username);
              } else {
                console.error("Username endpoint returned no username");
                setError("Unable to retrieve username");
                setIsLoading(false);
              }
            } else {
              console.error("Failed to retrieve username");
              setError("Unable to retrieve user information");
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error fetching username:", error);
            setError("Network error getting user information");
            setIsLoading(false);
          }
        } else {
          // We have the username, proceed with fetching profile
          fetchUserData(username);
        }
      } catch (error) {
        console.error("Fetch user profile error:", error);
        setError("Network error. Please try again.");
        setIsLoading(false);
      }
    };

    const fetchUserData = async (username) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/profile/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Profile API response status:", response.status);

        if (response.ok) {
          const userData = await response.json();
          console.log("User profile data:", userData);

          // Set recipes from user profile
          const recipes = userData.recipes || [];
          setRecipes(recipes);

          // Check if user has following
          const following = userData.friend_list || [];
          setFollowingUsers(following);

          // Show content even if empty
          setHasFollowing(true);

          // For now, display the user's own recipes in both tabs
          const enhancedRecipes = recipes.map((recipe) => {
            // Try to get the creator information from the recipe if available
            const recipeUsername =
              recipe.username || recipe.createdBy || recipe.author;
            const recipeUserImage =
              recipe.profileImageUrl ||
              recipe.authorImageUrl ||
              recipe.creatorImageUrl;

            console.log("Recipe data:", {
              id: recipe.id,
              title: recipe.title,
              username: recipeUsername,
              profileImageUrl: recipeUserImage,
            });

            return {
              ...recipe,
              username: recipeUsername || username || "Recipe Creator",
              profileImageUrl:
                recipeUserImage ||
                localStorage.getItem("profileImageUrl") ||
                "https://via.placeholder.com/40",
              creatorId: recipe.creatorId || recipe.userId || userId,
            };
          });

          setFollowingRecipes(enhancedRecipes);

          // Fetch suggested users
          fetchSuggestedUsers(userId, following);
          setIsLoading(false);
        } else {
          console.log("Failed to fetch profile, status:", response.status);
          let errorData;
          try {
            errorData = await response.json();
            console.error("Error response:", errorData);
          } catch (e) {
            console.error("Could not parse error response");
          }

          setError("Failed to fetch user profile. Please refresh the page.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setError("Network error getting profile data.");
        setIsLoading(false);
      }
    };

    fetchUserProfileAndRecipes();
  }, [refreshTrigger]);

  // Fetch all recipes from users the current user is following
  const fetchAllFollowingRecipes = async (following) => {
    if (!following || following.length === 0) {
      console.log("No following users to fetch recipes from");
      setFollowingRecipes([]);
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("Fetching recipes from following users:", following);

    try {
      // Temporary solution for debugging - add your own recipes to following
      const myUsername = localStorage.getItem("username");
      console.log("Current user:", myUsername);

      // For direct API testing, let's log all API endpoints available
      console.log("Attempting to directly get all recipes from API...");
      try {
        const allRecipesResponse = await fetch(
          `http://127.0.0.1:5000/api/recipes/most-recent`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (allRecipesResponse.ok) {
          const allRecipesData = await allRecipesResponse.json();
          console.log("ALL AVAILABLE RECIPES FROM API:", allRecipesData);

          // Process these recipes for the following tab to ensure we see something
          let allAvailableRecipes = [];
          if (allRecipesData && Array.isArray(allRecipesData)) {
            allAvailableRecipes = allRecipesData;
          } else if (
            allRecipesData &&
            allRecipesData.recipes &&
            Array.isArray(allRecipesData.recipes)
          ) {
            allAvailableRecipes = allRecipesData.recipes;
          } else if (
            allRecipesData &&
            Object.values(allRecipesData).some(Array.isArray)
          ) {
            const arrayProps = Object.entries(allRecipesData).find(([_, val]) =>
              Array.isArray(val),
            );
            if (arrayProps) allAvailableRecipes = arrayProps[1];
          }

          // Filter to only show recipes from users you follow
          const followingRecipes = allAvailableRecipes.filter((recipe) => {
            const recipeAuthorId = recipe.authorId || recipe.userId || "";
            return following.includes(recipeAuthorId);
          });

          console.log("Filtered recipes from following:", followingRecipes);

          if (followingRecipes.length > 0) {
            console.log("Found recipes from following users through the API!");

            // Enhance recipes with author data
            const enhancedRecipes = await Promise.all(
              followingRecipes.map(async (recipe) => {
                const authorId = recipe.authorId || recipe.userId;
                if (!authorId) return recipe;

                try {
                  const userResponse = await fetch(
                    `http://127.0.0.1:5000/api/profile/username?userId=${authorId}`,
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
                    return {
                      ...recipe,
                      author: userData.username,
                      username: userData.username,
                      profileImageUrl: userData.profileImageUrl,
                    };
                  }
                } catch (error) {
                  console.error(`Error fetching author for recipe:`, error);
                }
                return recipe;
              }),
            );

            setFollowingRecipes(enhancedRecipes);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching all recipes:", error);
      }

      // Continue with original approach if the above fails
      // Similar to how Discovery.jsx fetches recipes
      let allFollowingRecipes = [];

      for (const followedUserId of following) {
        try {
          // First get the username from userId
          console.log(`Looking up username for user ID: ${followedUserId}`);
          const userResponse = await fetch(
            `http://127.0.0.1:5000/api/profile/username?userId=${followedUserId}`,
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
            console.log(`User data for ${followedUserId}:`, userData);
            const followedUsername = userData.username;

            if (!followedUsername) {
              console.log(`No username found for user ID: ${followedUserId}`);
              continue;
            }

            console.log(
              `Fetching recipes for followed user: ${followedUsername}`,
            );

            // Now get the recipes using the username
            const recipesResponse = await fetch(
              `http://127.0.0.1:5000/api/profile/${followedUsername}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (recipesResponse.ok) {
              const profileData = await recipesResponse.json();
              console.log(`Profile data for ${followedUsername}:`, profileData);

              // Parse recipes - handling like in Discovery.jsx
              let userRecipes = [];
              if (profileData.recipes && Array.isArray(profileData.recipes)) {
                userRecipes = profileData.recipes;
              } else if (
                profileData &&
                Object.values(profileData).some(Array.isArray)
              ) {
                // Try to find an array property if recipes isn't directly available
                const arrayProps = Object.entries(profileData).find(
                  ([_, val]) => Array.isArray(val),
                );
                if (arrayProps) userRecipes = arrayProps[1];
              }

              console.log(
                `Found ${userRecipes.length} recipes for user ${followedUsername}`,
              );

              // Add user info to each recipe
              const enhancedRecipes = userRecipes.map((recipe) => ({
                ...recipe,
                author: followedUsername,
                authorId: followedUserId,
                username: followedUsername,
                profileImageUrl:
                  userData.profileImageUrl || "https://via.placeholder.com/40",
                userId: followedUserId,
              }));

              allFollowingRecipes = [
                ...allFollowingRecipes,
                ...enhancedRecipes,
              ];
            } else {
              console.log(
                `Failed to fetch recipes for user ${followedUsername}, status: ${recipesResponse.status}`,
              );
            }
          } else {
            console.log(
              `Failed to fetch username for user ID: ${followedUserId}, status: ${userResponse.status}`,
            );
          }
        } catch (error) {
          console.error(
            `Error fetching data for user ${followedUserId}:`,
            error,
          );
        }
      }

      console.log(
        `Total following recipes found: ${allFollowingRecipes.length}`,
      );

      // Sort by timestamp if available (newest first)
      const sortedRecipes = allFollowingRecipes.sort((a, b) => {
        const timeA = a.timestamp || a.datePosted || a.date || 0;
        const timeB = b.timestamp || b.datePosted || b.date || 0;
        return new Date(timeB) - new Date(timeA);
      });

      setFollowingRecipes(sortedRecipes);
    } catch (error) {
      console.error("Error fetching following recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch suggested users to follow
  const fetchSuggestedUsers = async (userId, following) => {
    const token = localStorage.getItem("token");
    try {
      // In a real implementation, you would have an API endpoint for suggested users
      // For this implementation, we'll make a simple fetch to get some users to follow

      // Get several users from the system
      const response = await fetch(
        `http://127.0.0.1:5000/api/users/all`, // This endpoint doesn't exist yet - would need to be implemented
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      ).catch(() => {
        // If endpoint doesn't exist, return mock data for now
        // This would be replaced with a real endpoint in production
        return {
          ok: false,
        };
      });

      if (response && response.ok) {
        const users = await response.json();
        // Filter out the current user and users already followed
        const suggestedUsers = users
          .filter(
            (user) =>
              user.userId !== userId && !following.includes(user.userId),
          )
          .slice(0, 5); // Limit to 5 suggestions

        setSuggestedUsers(suggestedUsers);
      } else {
        // For development, use sample data if API doesn't exist yet
        // This would be replaced with actual data from the API in production
        setSuggestedUsers([]);
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
      setSuggestedUsers([]);
    }
  };

  // Fetch most liked recipes for the discover tab
  const fetchMostLikedRecipes = async () => {
    const token = localStorage.getItem("token");

    try {
      // Similar approach to Discovery.jsx
      const response = await fetch(
        `http://127.0.0.1:5000/api/recipes/most-liked`,
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
        console.log("Most liked API response:", data);

        // Parse the response similar to Discovery.jsx
        let fetchedRecipes = [];
        if (data && Array.isArray(data)) {
          fetchedRecipes = data;
        } else if (data && data.recipes && Array.isArray(data.recipes)) {
          fetchedRecipes = data.recipes;
        } else if (data && Object.values(data).some(Array.isArray)) {
          const arrayProps = Object.entries(data).find(([_, val]) =>
            Array.isArray(val),
          );
          if (arrayProps) fetchedRecipes = arrayProps[1];
        }

        console.log("Processed most liked recipes:", fetchedRecipes);
        setRecipes(fetchedRecipes);
      } else {
        console.log("Failed to fetch most liked recipes");
        // Default to empty array instead of showing error
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching most liked recipes:", error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
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

  // Handle unfollowing a user
  const handleUnfollowUser = async (targetUserId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/profile/unfollow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentUserId: userId,
            targetUserId: targetUserId,
          }),
        },
      );

      if (response.ok) {
        // Trigger a refresh of the feed
        setRefreshTrigger((prev) => prev + 1);
      } else {
        const data = await response.json();
        console.error("Unfollow error:", data.error);
      }
    } catch (error) {
      console.error("Unfollow user error:", error);
    }
  };

  // Get filtered recipes
  const getFilteredRecipes = () => {
    const recipesToFilter =
      activeTab === "following" ? followingRecipes : recipes;

    if (!recipesToFilter || !Array.isArray(recipesToFilter)) {
      return [];
    }

    return recipesToFilter.filter((recipe) => {
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
    console.log("Rendering not logged in view");
    // Debug info about local storage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    console.log("Local storage auth:", { userId, token, username });

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
            {/* Debug button to force logged in state */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                Debug: If you're already signed in but still seeing this page
              </p>
              <motion.button
                onClick={() => {
                  console.log("Force logged in state");
                  setIsLoggedIn(true);
                  setIsLoading(false);
                  setHasFollowing(true);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Force Show Home Feed
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
          {/* Feed Tabs */}
          <motion.div
            className="flex justify-center mb-4 border-b border-gray-100"
            variants={itemVariants}
          >
            <div className="flex">
              <button
                onClick={() => setActiveTab("following")}
                className={`px-6 py-4 font-medium text-lg ${
                  activeTab === "following"
                    ? "text-[#1d9c3f] border-b-2 border-[#1d9c3f]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Following
              </button>
              <button
                onClick={() => setActiveTab("discover")}
                className={`px-6 py-4 font-medium text-lg ${
                  activeTab === "discover"
                    ? "text-[#1d9c3f] border-b-2 border-[#1d9c3f]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Discover
              </button>
            </div>
          </motion.div>

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
              ) : activeTab === "following" && !hasFollowing ? (
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
                  <motion.button
                    onClick={() => setActiveTab("discover")}
                    className="px-4 py-2 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Discover Users
                  </motion.button>
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
                    <Masonry
                      breakpointCols={breakpointColumnsObj}
                      className="my-masonry-grid"
                      columnClassName="my-masonry-grid_column"
                    >
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
                        >
                          <div className="mb-2">
                            {recipe.username && (
                              <div className="flex items-center p-3 bg-white">
                                <Link to={`/profile/${recipe.username}`}>
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center font-semibold text-sm">
                                    {recipe.username[0]}
                                  </div>
                                </Link>
                                <Link to={`/profile/${recipe.username}`}>
                                  <span className="font-medium ml-2">
                                    {recipe.username}
                                  </span>
                                </Link>
                              </div>
                            )}
                          </div>
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
                              recipe.cookingTime || recipe.time || "30 minutes"
                            }
                            difficulty={recipe.difficulty || "Medium"}
                            servings={recipe.servings || recipe.serves || 4}
                            ingredients={recipe.ingredients || []}
                            instructions={recipe.instructions || []}
                            likes={recipe.likes || recipe.likesCount || 0}
                            isLiked={recipe.isLiked || false}
                          />
                        </motion.div>
                      ))}
                    </Masonry>
                  )}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div className="md:w-1/3" variants={itemVariants}>
              {/* User profile card */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4">
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
                <motion.button
                  onClick={() => (window.location.href = "/create-recipe")}
                  className="w-full py-2 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Recipe
                </motion.button>
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
