import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import FoodSocialCard from "../components/FoodSocialCard";
import EditProfile from "../components/EditProfile";
import Masonry from "react-masonry-css";
import { useAuth } from "../components/AuthContext";

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
    recipes: []
  });
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  
  // If currentUser is properly structured with username property
  const isOwnProfile = currentUser?.user && profileUsername === currentUser.user.username;
  
  console.log("Current user:", currentUser);
  console.log("Profile username:", profileUsername);
  console.log("Is own profile:", isOwnProfile);
  
  useEffect(() => {
    // Redirect to login if no username provided and user not logged in
    if (!profileUsername && !currentUser) {
      navigate('/signin');
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
        const response = await fetch(`http://127.0.0.1:5000/api/profile/${profileUsername}?_t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Profile data from API:", data);
        
        // Sort recipes by date
        const sortedRecipes = (data.recipes || []).sort(
          (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
        );
        
        // Store API response directly in profileData
        setProfileData({
          ...data,                   // Include all fields from the API response
          recipes: sortedRecipes     // Override recipes with sorted version
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
    navigate('/landing');
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    
    // Get the current user ID
    const currentUserId = currentUser.user?.id || currentUser.userId;
    const targetUserId = profileData.userId;
    
    // Validate we have the required IDs
    if (!currentUserId || !targetUserId) {
      console.error("Missing user IDs for follow/unfollow:", { currentUserId, targetUserId });
      return;
    }
  
    try {
      // Use the correct endpoint for follow/unfollow
      const endpoint = isFollowing ? 'http://127.0.0.1:5000/api/profile/unfollow' : 'http://127.0.0.1:5000/api/profile/follow';
      
      console.log("Follow toggle - sending currentUserId:", currentUserId);
      console.log("Follow toggle - sending targetUserId:", targetUserId);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUserId: currentUserId,
          targetUserId: targetUserId
        }),
      });
  
      if (response.ok) {
        // Toggle following state for immediate UI update
        const newFollowingState = !isFollowing;
        setIsFollowing(newFollowingState);
        
        // Update localStorage to reflect the change
        updateLocalStorageFollowing(targetUserId, newFollowingState);
        
        console.log(`Successfully ${isFollowing ? 'unfollowed' : 'followed'} user`);
      } else {
        const errorData = await response.json();
        console.error("Error following/unfollowing:", errorData);
      }
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
    }
  };
  
  // Function to update following list in localStorage
  const updateLocalStorageFollowing = (targetUserId, isNowFollowing) => {
    try {
      const userDataString = localStorage.getItem('user');
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
        userData.following = userData.following.filter(id => id !== targetUserId);
      }
      
      // Save updated user data back to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
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
  
  const profilePic = profileData.profileImageUrl || "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg"; 

  // Debugging output
  console.log("Full profile data:", profileData);
  console.log("Username being displayed:", username);
  console.log("Bio being displayed:", bio);

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
      const usernameChanged = updatedUser.profile && updatedUser.profile.username && 
                             currentUser?.user?.username !== updatedUser.profile.username;
      
      console.log("Username changed:", usernameChanged);
      
      // Close the modal first
      setIsEditProfileOpen(false);
      
      if (usernameChanged) {
        // If username changed, log the user out and have them sign in again
        console.log("Username was changed - logging out");
        
        // Notify the user first
        alert("Your username has been updated to " + updatedUser.profile.username + ". Please sign in again with your new username.");
        
        // Perform logout - make sure we're calling the actual logout function
        if (typeof logout === 'function') {
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
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Redirect to login page
        navigate('/signin');
      } else {
        // For other updates, just refresh the profile
        setProfileUpdated(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating your profile. Please try again.");
    }
  };

  return (
    <>
      <div className="text-center my-20">
        <div className="flex mb-5 justify-center items-center">
          <div className="flex items-center border-b-2 py-5">
            <div className="items-center justify-center mr-5">
              <img
                src={profilePic}
                alt="Profile Pic"
                className="rounded-full w-32 h-32 object-cover"
              />
              {isOwnProfile ? (
                // Show edit profile and logout buttons for own profile
                <>
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
                </>
              ) : currentUser ? (
                // Show follow/unfollow button for other profiles when logged in
                <button
                  onClick={handleFollowToggle}
                  className={`border-2 ${isFollowing ? 'border-gray-300 bg-gray-100' : 'border-green-300 bg-green-50'} rounded-full px-4 py-1 mt-3 text-xs`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              ) : null}
            </div>
            <div className="text-left ml-4">
              <p className="text-xs font-thin text-gray-500 pb-1">Username:</p>
              <h2 className="inline-block">{username}</h2>
              <p className="text-xs font-thin text-gray-500 pt-4 pb-1">
                Short Bio:
              </p>
              <p className="whitespace-pre-wrap text-sm">{formatBio(bio)}</p>
            </div>
          </div>
        </div>

        {/* Toggle Posts/Saved - only show Saved tab for own profile */}
        <div className="flex justify-center mb-5">
          <button
            className={`mr-2 border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200 ${showPosts ? "bg-gray-200" : ""}`}
            onClick={() => setShowPosts(true)}
          >
            Posts
          </button>
          {isOwnProfile && (
            <button
              className={`mr-2 border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200 ${!showPosts ? "bg-gray-200" : ""}`}
              onClick={() => setShowPosts(false)}
            >
              Saved
            </button>
          )}
        </div>

        {/* Recipe Grid */}
        <div className="flex justify-center">
          <div className="home-container max-w-[1200px]">
            {loading ? (
              <p className="text-gray-400 text-center">Loading...</p>
            ) : (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid justify-center"
                columnClassName="my-masonry-grid_column"
              >
                {showPosts ? (
                  profileData.recipes && profileData.recipes.length > 0 ? (
                    profileData.recipes.map((recipe) => (
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
                        imageUrl={recipe.imageList?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image"}
                        datePosted={recipe.datePosted}
                        author={username}
                        authorId={profileData.userId}
                        likes={recipe.likes || 0}
                        isLiked={recipe.isLiked || false}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">No posts yet.</p>
                  )
                ) : (
                  // This section only shows for the current user's profile (Saved posts)
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">No saved posts yet</p>
                    <p className="text-gray-500 mt-2">
                      You haven't saved any recipes yet. Start exploring and save
                      your favorite recipes to see them here.
                    </p>
                    <button
                      className="mt-5 px-4 py-2 bg-[#ccdec2] text-[#1d380e] rounded-full hover:border-1 border-[#1d380e]"
                      onClick={() => navigate('/discovery')}
                    >
                      Discover Recipes
                    </button>
                  </div>
                )}
              </Masonry>
            )}
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <EditProfile
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSubmit={handleProfileUpdate}
          currentUser={currentUser?.user}
        />
      )}
    </>
  );
};

export default Profile;