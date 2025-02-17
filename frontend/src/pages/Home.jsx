import React from "react";
import FoodSocialCard from "../components/FoodSocialCard";
import meal2 from "../assets/meal2.jpg";

const mockBackendData = {
  postId: "post_123",
  title: "Authentic Spanish Paella",
  author: "Chef Maria",
  authorId: "user_789",
  datePosted: "2024-02-17T15:30:00Z",
  description:
    "A traditional Spanish paella with seafood and saffron rice. Perfect for family gatherings and special occasions.",
  cookingTime: "1 hour",
  difficulty: "Medium",
  servings: 6,
  imageUrl: meal2,
  ingredients: [
    "2 cups Spanish rice",
    "1 lb mixed seafood",
    "2 tablespoons olive oil",
    "1 onion, diced",
    "4 cloves garlic, minced",
    "1 pinch saffron threads",
    "4 cups fish stock",
  ],
  instructions: [
    "Heat oil in a large paella pan over medium heat.",
    "Sauté onions and garlic until softened.",
    "Add rice and saffron, stirring to coat with oil.",
    "Pour in fish stock and bring to a simmer.",
    "Add seafood and cook until rice is done.",
    "Let rest for 5-10 minutes before serving.",
  ],
  likes: 42,
  isLiked: false,
};

export default function Home() {
  return (
    <div className="p-6 ml-[12%] bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8">
        Welcome to Feastly
      </h1>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Card with mock backend data */}
        <FoodSocialCard {...mockBackendData} />

        {/* Placeholder card */}
        <FoodSocialCard
          postId="placeholder_1"
          title="Quick & Easy Pasta"
          author="John Doe"
          authorId="user_456"
          datePosted={new Date().toISOString()}
          description="A simple and delicious pasta recipe that anyone can make."
          cookingTime="30 mins"
          difficulty="Easy"
          servings={4}
          imageUrl={meal2}
          ingredients={[
            "1 box pasta",
            "2 cups tomato sauce",
            "1 tablespoon olive oil",
            "Salt and pepper to taste",
          ]}
          instructions={[
            "Boil pasta according to package instructions",
            "Heat sauce in a separate pan",
            "Combine pasta and sauce",
            "Season and serve",
          ]}
          likes={15}
          isLiked={true}
        />
      </div>
    </div>
  );
}
