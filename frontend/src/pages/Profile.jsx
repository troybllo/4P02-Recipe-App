import React from "react";
import FoodSocialCard from "../components/FoodSocialCard";
import { recipes } from "../utils/sampleData";
import meal1 from "../assets/meal1.jpg";
import meal2 from "../assets/vegtable stir fry.jfif";
import meal3 from "../assets/meal3.jpg";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
    default: 5,
    1680: 4,
    1280: 3,
    824: 2,
    640: 1,
  };

const Profile = () => {

    const profilePic = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
    const PostsIcon = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
    const username = "Swa";
    const bio = "I love healthy foods for my bouldering training. I also love to cook and bake. I'm a software engineer by day and a chef by night.";

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
                <div className="flex justify-center mb-5"></div>
            <div className="flex justify-center mb-5">
                <button className="mr-2 flex items-center justify-center border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200"> Posts </button>
                <button className="mr-2 flex items-center justify-center border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200">Saved</button>
            </div>
            <div className="grid grid-cols-3 gap-4  mt-5 max-w-[100%]">
                <FoodSocialCard
                    postId="1"
                    title="Delicious Pancakes"
                    author="John Doe"
                    authorId="1"
                    datePosted="2025-02-18"
                    description="Fluffy and delicious pancakes perfect for breakfast."
                    cookingTime="20 mins"
                    difficulty="Easy"
                    servings="4"
                    imageUrl={meal1}
                    ingredients={["2 cups flour", "2 eggs", "1 cup milk", "1 tbsp sugar", "1 tsp baking powder"]}
                    instructions={["Mix ingredients", "Cook on griddle", "Serve hot"]}
                    likes={10}
                    isLiked={false}
                />
                <FoodSocialCard
                    postId="1"
                    title="Delicious Pancakes"
                    author="John Doe"
                    authorId="1"
                    datePosted="2025-02-18"
                    description="Fluffy and delicious pancakes perfect for breakfast."
                    cookingTime="20 mins"
                    difficulty="Easy"
                    servings="4"
                    imageUrl={meal2}
                    ingredients={["2 cups flour", "2 eggs", "1 cup milk", "1 tbsp sugar", "1 tsp baking powder"]}
                    instructions={["Mix ingredients", "Cook on griddle", "Serve hot"]}
                    likes={10}
                    isLiked={false}
                />
                <FoodSocialCard
                    postId="2"
                    title="Spaghetti Carbonara"
                    author="Jane Smith"
                    authorId="2"
                    datePosted="2025-02-18"
                    description="A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper."
                    cookingTime="30 mins"
                    difficulty="Medium"
                    servings="4"
                    imageUrl={meal3}
                    ingredients={["200g spaghetti", "100g pancetta", "2 eggs", "50g parmesan cheese", "Salt and pepper"]}
                    instructions={["Cook spaghetti", "Fry pancetta", "Mix eggs and cheese", "Combine all"]}
                    likes={20}
                    isLiked={true}
                />
                </div>
            </div>
        </>
    );
}

export default Profile;