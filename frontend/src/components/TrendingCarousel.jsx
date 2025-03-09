// src/components/TrendingCarousel.jsx
import React, { useRef, useEffect, useState } from "react";
import FoodSocialCard from "../components/FoodSocialCard";
import meal1 from "../assets/meal1.jpg";
import meal4 from "../assets/meal4.jpg";
import meal5 from "../assets/meal5.webp";

// Sample trending recipes array
const trendingRecipes = [
  {
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
  },
  {
    postId: "post_126",
    title: "The Perfect Steak with Garlic Butter",
    author: "Chef John",
    authorId: "user_792",
    datePosted: "2024-03-01T12:00:00Z",
    description:
      "My tips and tricks for the most perfect steak! And the melted garlic herb butter is out of this world!",
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
  },
  {
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
  },
];

export default function TrendingCarousel() {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let interval = null;

    if (!isPaused) {
      interval = setInterval(() => {
        container.scrollLeft += 2; // Adjust scroll speed here
        if (
          container.scrollLeft >=
          container.scrollWidth - container.clientWidth
        ) {
          container.scrollLeft = 0;
        }
      }, 20); // Adjust interval timing (ms)
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused]);

  return (
    <div className="home-container">
      <section className="max-w-screen-3xl mx-auto px-10 py-6 relative">
        <h2 className="text-2xl font-bold mb-4 ml-10">Trending</h2>
        {/* Fixed-width wrapper to force overflow */}
        <div
          className="overflow-hidden mx-auto px-10"
          style={{ maxWidth: "960px" }}
        >
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {trendingRecipes.map((recipe, index) => (
              <div
                key={recipe.postId + index}
                className="flex-shrink-0 w-80 snap-start"
              >
                <FoodSocialCard {...recipe} />
              </div>
            ))}
          </div>
        </div>
        {/* Faded overlay for upcoming recipes */}
        <div className="absolute top-0 right-0 h-full w-16 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
      </section>
    </div>
  );
}
