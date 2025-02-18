import React from "react";
import FoodSocialCard from "../components/FoodSocialCard";
import { recipes } from "../utils/sampleData";
import recipe1 from "../pages/Home";
import recipe2 from "../pages/Home";

const Profile = () => {

    const profilePic = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
    const PostsIcon = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
    const username = "Swa";
    const bio = "I love healthy foods for my bouldering training. I also love to cook and bake. I'm a software engineer by day and a chef by night.";
    const recipes = [
        recipe1,
        recipe2,
    ]

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

    return (
        <>
            <div className="text-center mt-10">
                <div className="flex items-center justify-center mb-5">
                    <div className="min-w-[500px] flex items-center border-b-2 border-gray-300 pb-5">
                        <img src={profilePic} alt="Profile Pic" className="rounded-full w-32 h-32 mr-5" />
                        <div className="text-left ml-4">
                            <p className="text-xs font-thin text-gray-500 pt-4 pb-1">Username: </p>
                            <h2 className="inline-block border-2 border-gray-300 rounded-full px-7 py-2">{username}</h2>
                            <p className="text-xs font-thin text-gray-500 pt-4 pb-1">Short Bio: </p>
                            <p className="whitespace-pre-wrap">{formatBio(bio)}</p>
                        </div>
                    </div>
                    
                </div>
            <div className="flex justify-center mb-5">
                <button className="mr-2 flex items-center justify-center border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200"> Posts </button>
                <button className="mr-2 flex items-center justify-center border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200">Saved</button>
            </div>
            <div className="flex flex-wrap justify-center">
                <div className="w-1/3 p-2">
                    {recipe1}
                </div>
                <div className="w-1/3 p-2">
                    <img src="post2-url" alt="Post 2" className="w-full" />
                </div>
                <div className="w-1/3 p-2">
                    <img src="post3-url" alt="Post 3" className="w-full" />
                </div>
            </div>
                
            </div>
        </>
    );
}

export default Profile;