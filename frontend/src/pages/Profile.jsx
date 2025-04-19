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
  const { currentUser, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    user: null,
    recipes: []
  });
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // If currentUser is properly structured with username property
  const isOwnProfile = currentUser && profileUsername === currentUser.user.username;
  console.log('Raw currentUser:', currentUser);
  console.log('Type of user:', typeof currentUser.user);
  console.log(currentUser.user);
  console.log(currentUser.user.username);
  
  useEffect(() => {
    // Redirect to login if no username provided and user not logged in
    if (!profileUsername && !currentUser) {
      navigate('/signin');
      return;
    }

    // If viewing base /profile with no username param and user is logged in
    if (!profileUsername && currentUser?.username) {
      navigate(`/profile/${currentUser.username}`);
      return;
    }
    
    const fetchProfileData = async () => {
      if (!profileUsername) return;
      
      setLoading(true);
      
      try {
        // Fetch profile data
        const response = await fetch(`http://127.0.0.1:5000/api/profile/${profileUsername}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort recipes by date
        const sortedRecipes = (data.recipes || []).sort(
          (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
        );
        
        setProfileData({
          user: data.user,
          recipes: sortedRecipes
        });

        // Check if current user is following this profile
        if (!isOwnProfile && currentUser) {
          try {
            const followResponse = await fetch(`http://127.0.0.1:5000/api/users/isFollowing?userId=${currentUser.userId}&targetId=${data.user.userId}`);
            if (followResponse.ok) {
              const followData = await followResponse.json();
              setIsFollowing(followData.isFollowing);
            }
          } catch (err) {
            console.error("Error checking follow status:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileUsername, currentUser, isOwnProfile, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`http://127.0.0.1:5000/api/users/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          targetId: profileData.user.userId
        }),
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
    }
  };

  const formatBio = (bio) => {
    if (!bio) return "";
    const words = bio.split(" ");
    return words.map((w, i) => ((i + 1) % 10 === 0 ? w + "\n" : w)).join(" ");
  };

  // Display profile info based on whose profile it is
  const displayUser = isOwnProfile ? currentUser : profileData.user;
  const username = displayUser?.username || profileUsername || "User";
  const bio = displayUser?.bio || "This user hasn't added a bio yet.";
  const profilePic = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg"; 

  return (
    <>
      <div className="text-center my-20">
        <div className="flex mb-5 justify-center items-center">
          <div className="flex items-center border-b-2 py-5">
            <div className="items-center justify-center mr-5">
              <img
                src={profilePic}
                alt="Profile Pic"
                className="rounded-full w-32 h-32"
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
                  profileData.recipes.length > 0 ? (
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
                        authorId={displayUser?.userId}
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
          onSubmit={(updatedUser) => {
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setProfileData(prevData => ({
              ...prevData,
              user: updatedUser
            }));
          }}
        />
      )}
    </>
  );
};

export default Profile;