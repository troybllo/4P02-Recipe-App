import FoodSocialCard from "../components/FoodSocialCard";
import React, { useState, useEffect } from "react";
import { recipes } from "../data/recipes";
import Masonry from "react-masonry-css";
import meal1 from "../assets/meal1.jpg";
import meal2 from "../assets/meal2.jfif";
import meal3 from "../assets/meal3.jpg";
import meal4 from "../assets/meal4.jpg";
import meal5 from "../assets/meal5.webp";
import EditProfile from "../components/EditProfile";
import { useAuth } from "../components/AuthContext"; // Update this import path to where your AuthContext is located

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
    // Use the auth context
    const { currentUser, logout } = useAuth();
    const { checkAuth } = useAuth();
    
    const username = "Swa";
    const bio = "I love healthy foods for my bouldering training. I also love to cook and bake. I'm a software engineer by day and a chef by night.";

    // Get user ID from local storage (assuming it was stored during login)
    const userId = localStorage.getItem("userId");

    console.log(userId);
    console.log(userId.username);

    const ownerRecipes = recipes.filter((recipe) => {
        return recipe.authorId === 'user_789';
    });

    const profilePic = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
    const PostsIcon = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";

    const formatBio = (bio) => {
        const words = bio.split(" ");
        let formattedBio = "";
        for (let i = 0; i < words.length; i++) {
            formattedBio += words[i] + " ";
            if ((i + 1) % 10 === 0) {
                formattedBio += "\n";
            }
        }
        return formattedBio.trim();
    };

    let followers = 420;
    let following = 69;

    const [showPosts, setShowPosts] = useState(true);

    const handlePosts = () => {
        setShowPosts(true);
    };

    const handleSaved = () => {
        setShowPosts(false);
    };

    useEffect(() => {
        document.body.style.overflowY = "scroll";
        document.body.style.overflowX = "hidden";
        return () => {
            document.body.style.overflowY = "auto";
            document.body.style.overflowX = "auto";
        };
    }, []);

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const handleEditProfile = () => {
        setIsEditProfileOpen(false);
    }

    // Add a logout handler
    const handleLogout = () => {
        logout();
        // Redirect will happen automatically due to protected route
    };

    return (
        <>
            <div className="text-center my-20">
                <div className="flex mb-5 justify-center items-center">
                    <div className="flex items-center border-b-2 py-5">
                        <div className="items-center justify-center mr-5">
                            <img src={profilePic} alt="Profile Pic" className="rounded-full w-32 h-32" />
                            <button
                                onClick={() => setIsEditProfileOpen(true)}>
                                <p className="border-2 border-gray-300 rounded-full px-4 py-1 mt-3 text-xs justify-center items-center">Edit Profile</p>
                            </button>
                            {/* Add logout button */}
                            <button
                                onClick={handleLogout}
                                className="border-2 border-gray-300 rounded-full px-4 py-1 mt-2 text-xs justify-center items-center text-red-500">
                                Logout
                            </button>
                        </div>
                        <div className="text-left ml-4">
                            <p className="text-xs font-thin text-gray-500 pb-1">Username: </p>
                            <h2 className="inline-block">{username}</h2>
                            <p className="text-xs font-thin text-gray-500 pt-4 pb-1">Short Bio: </p>
                            <p className="whitespace-pre-wrap text-sm">{formatBio(bio)}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mb-5">
                    <button
                        className={`mr-2 flex items-center justify-center border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200 ${showPosts ? 'bg-gray-200' : ''}`}
                        onClick={handlePosts}
                    >
                        Posts
                    </button>
                    <button
                        className={`mr-2 flex items-center justify-center border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200 ${!showPosts ? 'bg-gray-200' : ''}`}
                        onClick={handleSaved}
                    >
                        Saved
                    </button>
                </div>
                <div className="flex justify-center">
                    <div className="home-container max-w-[1200px]">
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid justify-center"
                            columnClassName="my-masonry-grid_column"
                        >
                            {showPosts ? (
                                ownerRecipes.map((recipe, index) => (
                                    <div key={recipe.postId + index}>
                                        <FoodSocialCard {...recipe} />
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <p className="text-lg font-semibold">No saved posts yet</p>
                                    <p className="text-gray-500 mt-2">You haven't saved any recipes yet. Start exploring and save your favorite recipes to see them here.</p>
                                    <button className="mt-5 px-4 py-2 bg-[#ccdec2] text-[#1d380e] rounded-full hover:border-1 border-[#1d380e]"
                                        onClick={() => window.location.href = '/discovery'}>
                                        Discover Recipes
                                    </button>
                                </div>
                            )}
                        </Masonry>
                    </div>
                </div>
            </div>
            <EditProfile
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                onSubmit={handleEditProfile}
            />
        </>
    );
}

export default Profile;