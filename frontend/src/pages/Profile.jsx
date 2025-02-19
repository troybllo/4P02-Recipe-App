import React from "react";
import FoodSocialCard from "../components/FoodSocialCard";
import { recipes } from "../utils/sampleData";
import Masonry from "react-masonry-css";
import meal1 from "../assets/meal1.jpg";
import meal2 from "../assets/vegtable stir fry.jfif";
import meal3 from "../assets/meal3.jpg";
import meal4 from "../assets/meal5.jpg";
import meal5 from "../assets/meal6.webp";

const breakpointColumnsObj = {
    default: 5,
    1440: 6,
    1920: 4,
    1680: 3,
    1280: 3,
    824: 2,
    640: 1,
  };

const Profile = () => {

    const profilePic = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
    const PostsIcon = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
    const username = "Swa";
    const bio = "I love healthy foods for my bouldering training. I also love to cook and bake. I'm a software engineer by day and a chef by night.";

    const recipe1 = {
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
      imageUrl: meal1,
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
    
    const recipe2 = {
      postId: "post_124",
      title: "Vegetable Stir-Fry",
      author: "Chef Lee",
      authorId: "user_790",
      datePosted: "2024-02-18T10:00:00Z",
      description:
        "A healthy and quick vegetable stir-fry with a soy sauce-based dressing. Perfect for a light lunch or dinner.",
      cookingTime: "25 mins",
      difficulty: "Easy",
      servings: 4,
      imageUrl: meal2,
      ingredients: [
        "1 cup broccoli florets",
        "1 red bell pepper, sliced",
        "1 carrot, julienned",
        "2 tablespoons soy sauce",
        "1 tablespoon sesame oil",
        "1 teaspoon ginger, minced",
        "2 garlic cloves, minced",
        "1 tablespoon sesame seeds",
      ],
      instructions: [
        "Heat sesame oil in a large pan over medium heat.",
        "Add garlic and ginger, cooking until fragrant.",
        "Add the vegetables and stir-fry for 5-7 minutes.",
        "Pour in the soy sauce and toss to coat.",
        "Sprinkle sesame seeds on top before serving.",
      ],
      likes: 30,
      isLiked: false,
    };
    
    const recipe3 = {
      postId: "post_125",
      title:
        "Beef Fillet, Potato Puree, Roasted Fennel, Asparagus, Smoked Garlic & Thyme Butter",
      author: "Chef Kim Boyan",
      authorId: "user_791",
      datePosted: "2024-02-19T12:00:00Z",
      description:
        "A gourmet dish featuring tender beef fillet served with creamy potato puree, roasted fennel, asparagus, and smoked garlic thyme butter.",
      cookingTime: "1 hour 15 mins",
      difficulty: "High",
      servings: 2,
      imageUrl: meal3,
      ingredients: [
        "2 x beef fillet (250g-300g)",
        "Sea salt & cracked pepper",
        "Grapeseed oil or extra virgin olive oil",
        "1/2 fennel bulb",
        "1 bunch asparagus",
        "Sorrel leaves or micro herbs for garnish",
        "Smoked Garlic Thyme Butter",
        "100g unsalted butter",
        "1 smoked garlic or garlic clove, crushed",
        "1 tablespoon thyme leaves",
        "Potato puree",
        "2 medium potatoes, peeled, chopped",
        "30g butter",
        "¼ cup thickened cream",
        "¼ cup milk + extra",
      ],
      instructions: [
        "For the smoked garlic thyme butter, soften butter and mix with garlic and thyme. Chill for at least 2 hours before serving.",
        "For potato puree, boil potatoes with a pinch of salt until tender. Mash and add butter, cream, and milk. Blend until smooth.",
        "Pre-heat oven to 180°C (350°F). Roast fennel for 10-15 minutes until almost tender.",
        "Season and cook beef fillet to desired doneness, rest for 5 minutes before serving.",
        "Steam asparagus, then assemble the dish by placing potato puree in the center, followed by asparagus, beef, fennel, and a slice of smoked butter.",
        "Garnish with sorrel leaves and serve.",
      ],
      likes: 55,
      isLiked: false,
    };
    
    const recipe4 = {
      postId: "post_126",
      title: "The Perfect Steak with Garlic Butter",
      author: "Chef John",
      authorId: "user_792",
      datePosted: "2024-03-01T12:00:00Z",
      description:
        "My tips and tricks for the most perfect steak! And the melted garlic herb butter is out of this world! (4.93 stars from 38 ratings, 134 comments)",
      cookingTime: "30 minutes",
      difficulty: "Medium",
      servings: 8,
      imageUrl: meal4,
      ingredients: [
        "4 (12-ounce) rib-eye steaks, 1 1/4-inch-thick, at room temperature",
        "4 tablespoons olive oil",
        "Kosher salt and freshly ground black pepper, to taste",
        "1/2 cup unsalted butter, at room temperature",
        "1/4 cup chopped fresh parsley leaves",
        "3 garlic cloves, minced",
        "1 tablespoon lemon zest",
        "1 teaspoon chopped fresh thyme leaves",
        "1 teaspoon chopped fresh rosemary",
        "1 teaspoon chopped fresh basil leaves",
        "1/2 teaspoon kosher salt",
        "1/4 teaspoon ground black pepper",
        "1/8 teaspoon cayenne pepper",
      ],
      instructions: [
        "Preheat oven to broil. Place a large cast iron skillet in the oven.",
        "Pat both sides of the steaks dry with paper towels. Drizzle with olive oil and season with salt and pepper.",
        "Remove skillet from the oven and heat over medium-high heat.",
        "Place the steak in the skillet and cook until a dark crust forms, about 1 minute. Flip and cook for an additional 60 seconds.",
        "Place skillet into the oven and cook until desired doneness (about 4-5 minutes for medium-rare). Let rest for 3-5 minutes.",
        "Serve immediately with the garlic compound butter.",
        "To make the garlic compound butter, combine the softened butter, parsley, garlic, lemon zest, thyme, rosemary, basil, salt, pepper, and cayenne in a bowl. Shape into a log using parchment paper and chill until needed.",
      ],
      likes: 68,
      isLiked: false,
    };
    
    const recipe5 = {
      postId: "post_127",
      title: "Grilled Lobster with Garlic-Parsley Butter",
      author: "Chef Curtis Stone",
      authorId: "user_793",
      datePosted: "2024-09-09T12:00:00Z",
      description:
        "Skip the stockpot and cook your crustaceans on an open fire instead. This quick, 20-minute recipe yields 1–2 servings.",
      cookingTime: "20 minutes",
      difficulty: "Medium",
      servings: 2,
      imageUrl: meal5,
      ingredients: [
        "8 Tbsp. unsalted butter, softened",
        "2 Tbsp. finely chopped parsley",
        "1½ tsp. crushed red chile flakes",
        "4 garlic cloves, finely chopped",
        "Finely grated zest of 1 lemon",
        "Kosher salt and freshly ground black pepper",
        "1 live lobster (about 1 to 1½ lb.)",
        "¼ cup olive oil",
      ],
      instructions: [
        "In a small bowl, mix butter, parsley, chile flakes, garlic, and lemon zest. Season with salt and pepper, then set aside.",
        "Using a cleaver, split the lobster in half lengthwise through its head and tail. Discard the tomalley; break off and crack the claws. Place lobster halves and claws on a baking sheet, shell side down.",
        "Drizzle with olive oil and season with salt and pepper.",
        "Heat a grill to high. Place the lobster halves (flesh side down) and claws on the hottest part of the grill and cook for 2–3 minutes. Flip, spread with garlic-parsley butter, and grill for an additional 3–5 minutes until the meat is tender.",
      ],
      likes: 0,
      isLiked: false,
    };
    
    // Combine recipes into an array
    const allRecipes = [
      recipe1,
      recipe2,
      recipe3,
      recipe2,
      recipe4,
      recipe3,
      recipe1,
      recipe5,
      recipe4,
    ];

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
            <div className="text-center my-20">
                <div className="flex mb-5 justify-center items-center">
                    <div className="flex items-center border-b-2 border-gray-300 pb-5">
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
                    <button className="mr-2 flex items-center justify-center border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200">Posts</button>
                    <button className="mr-2 flex items-center justify-center border-2 border-gray-300 rounded-full px-6 py-1 min-w-[100px] hover:bg-gray-200">Saved</button>
                </div>
                <div className="flex justify-center">
                    <div className="home-container ">
                        <Masonry 
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid max-w-[1200px]"
                            columnClassName="my-masonry-grid_column"
                        >
                            {allRecipes.map((recipe, index) => (
                            <div key={recipe.postId + index}> 
                                <FoodSocialCard {...recipe} />
                            </div>
                            ))}
                        </Masonry>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;