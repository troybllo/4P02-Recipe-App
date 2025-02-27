// src/data/recipes.js
import meal1 from "../assets/meal1.jpg";
import meal2 from "../assets/meal2.jfif";
import meal3 from "../assets/meal3.jpg";
import meal4 from "../assets/meal4.jpg";
import meal5 from "../assets/meal5.webp";
import meal6 from "../assets/meal6.webp";
import meal7 from "../assets/meal7.jpg";


export const recipes = [
    {
      postId: "post_123",
      title: "Authentic Spanish Paella",
      author: "Chef Maria",
      authorId: "user_789",
      datePosted: "2024-02-17T15:30:00Z",
      description:
        "A traditional Spanish paella with seafood and saffron rice. Perfect for family gatherings and special occasions.",
      cookingTime: "1 hr",
      difficulty: "Medium",
      servings: 6,
      imageUrl: meal1, // Update the path if needed
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
        "Let rest for 5-10 m before serving.",
      ],
      likes: 42,
      isLiked: false,
    },
    {
      postId: "post_124",
      title: "Vegetable Stir-Fry",
      author: "Chef Lee",
      authorId: "user_790",
      datePosted: "2024-02-18T10:00:00Z",
      description:
        "A healthy and quick vegetable stir-fry with a soy sauce-based dressing. Perfect for a light lunch or dinner.",
      cookingTime: "25 m",
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
        "Add the vegetables and stir-fry for 5-7 m.",
        "Pour in the soy sauce and toss to coat.",
        "Sprinkle sesame seeds on top before serving.",
      ],
      likes: 30,
      isLiked: false,
    },
    {
      postId: "post_125",
      title:
        "Beef Fillet, Potato Puree, Roasted Fennel, Asparagus, Smoked Garlic & Thyme Butter",
      author: "Chef Kim Boyan",
      authorId: "user_791",
      datePosted: "2024-02-19T12:00:00Z",
      description:
        "A gourmet dish featuring tender beef fillet served with creamy potato puree, roasted fennel, asparagus, and smoked garlic thyme butter.",
      cookingTime: "1 hr 15 m",
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
        "Pre-heat oven to 180°C (350°F). Roast fennel for 10-15 m until almost tender.",
        "Season and cook beef fillet to desired doneness, rest for 5 m before serving.",
        "Steam asparagus, then assemble the dish by placing potato puree in the center, followed by asparagus, beef, fennel, and a slice of smoked butter.",
        "Garnish with sorrel leaves and serve.",
      ],
      likes: 55,
      isLiked: false,
    },
    {
      postId: "post_126",
      title: "The Perfect Steak with Garlic Butter",
      author: "Chef John",
      authorId: "user_789",
      datePosted: "2024-03-01T12:00:00Z",
      description:
        "My tips and tricks for the most perfect steak! And the melted garlic herb butter is out of this world! (4.93 stars from 38 ratings, 134 comments)",
      cookingTime: "30 m",
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
        "Place skillet into the oven and cook until desired doneness (about 4-5 m for medium-rare). Let rest for 3-5 m.",
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
      cookingTime: "20 m",
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
        "Heat a grill to high. Place the lobster halves (flesh side down) and claws on the hottest part of the grill and cook for 2–3 m. Flip, spread with garlic-parsley butter, and grill for an additional 3–5 m until the meat is tender.",
      ],
      likes: 0,
      isLiked: false,
    },
    {
      postId: "post_128",
      title: "The Best Homemade Lasagna",
      author: "Elise Bauer",
      authorId: "user_789", // Update as needed
      datePosted: "2025-02-17T12:00:00Z",
      description:
        "This classic lasagna recipe is made with a rich meat sauce layered with noodles and a blend of ricotta, mozzarella, and Parmesan cheeses. It's perfect for feeding a big family and freezes well for later enjoyment.",
      cookingTime: "105 m", // 15 m prep + 90 m cook
      difficulty: "Medium",
      servings: 8,
      imageUrl: meal6, // Replace with the correct import from your assets
      ingredients: [
        "For the meat sauce:",
        "2 teaspoons extra virgin olive oil",
        "1 pound ground beef chuck",
        "1/2 medium onion, diced",
        "1/2 large bell pepper, diced",
        "2 cloves garlic, minced",
        "1 (28-ounce) can tomato sauce",
        "3 ounces tomato paste",
        "1 (14-ounce) can crushed tomatoes",
        "2 tablespoons chopped fresh oregano (or 2 teaspoons dried)",
        "1/4 cup chopped fresh parsley",
        "1 tablespoon Italian seasoning",
        "1 tablespoon red or white wine vinegar",
        "1 tablespoon to 1/4 cup sugar (to taste, optional)",
        "Salt, to taste",
        "For assembling the lasagna:",
        "1/2 pound dry lasagna noodles (about 9 noodles)",
        "15 ounces ricotta cheese",
        "1 1/2 pounds mozzarella cheese, grated or sliced",
        "1/4 pound freshly grated Parmesan cheese"
      ],
      instructions: [
        "Bring a large pot of salted water to a boil. Add the lasagna noodles and cook until al dente, then drain and rinse with cool water.",
        "In a large skillet, heat olive oil over medium-high heat. Brown the ground beef and drain excess fat.",
        "Add the diced onions, bell pepper, and garlic to the skillet. Sauté until the vegetables are softened.",
        "Transfer the beef mixture to a medium pot. Add tomato sauce, tomato paste, crushed tomatoes, oregano, parsley, Italian seasoning, vinegar, sugar, and salt. Bring to a simmer and cook for 15 to 45 m, stirring occasionally.",
        "Preheat the oven to 375°F.",
        "Spread a thin layer of meat sauce in a 9x13-inch baking dish. Arrange a layer of lasagna noodles over the sauce. Add another layer of sauce, followed by a layer of mozzarella, dollops of ricotta, and a sprinkle of Parmesan cheese. Repeat the layers twice, finishing with a top layer of sauce and mozzarella.",
        "Cover the dish with aluminum foil and bake for 45 m. Remove the foil in the last 10 m to allow the top to brown.",
        "Let the lasagna cool for at least 15 m before cutting and serving."
      ],
      likes: 120,
      isLiked: false
    },
    {
      postId: "post_130",
      title: "Beet Salad with Arugula and Balsamic Vinaigrette",
      author: "Natasha Kravchuk",
      authorId: "user_789", // Update as needed
      datePosted: "2023-10-31T00:00:00Z",
      description:
        "This roasted Beet Salad with arugula and balsamic vinaigrette is the perfect salad for Fall or Winter. It’s a beautiful blend of sweet roasted beets, peppery arugula, crunchy pecans, and creamy feta (or goat cheese), all drizzled with a tangy balsamic vinaigrette.",
      cookingTime: "1 hr 15 m",
      difficulty: "Easy",
      servings: 6,
      imageUrl: meal7, // Replace with your imported image or URL
      ingredients: [
        // Beet Salad Ingredients
        "6 medium beets (approx. 2 lbs), roasted",
        "5 oz (about 6 cups) baby arugula, rinsed and spun dry",
        "4 oz (1/2 cup) feta cheese, crumbled (or goat cheese)",
        "1/2 cup pecans, toasted",
        "1/2 cup dried cranberries",
        // Balsamic Vinaigrette Ingredients
        "1/2 cup extra virgin olive oil",
        "3 tbsp balsamic vinegar",
        "1 tbsp Dijon mustard",
        "1 garlic clove, pressed or minced",
        "1/4 tsp salt",
        "1/8 tsp black pepper"
      ],
      instructions: [
        "Preheat the oven to 400°F. Wrap each beet tightly in foil and roast for about 1 hour or until the largest beet is easily pierced. Unwrap, cool to room temperature, peel, and slice into wedges.",
        "Toast the pecans in a dry skillet over medium heat until golden and fragrant. Remove from heat and let cool.",
        "In a large bowl, combine the baby arugula, roasted beet wedges, crumbled feta, toasted pecans, and dried cranberries.",
        "In a mason jar, combine the olive oil, balsamic vinegar, Dijon mustard, garlic, salt, and black pepper. Seal and shake well until emulsified.",
        "Drizzle the vinaigrette over the salad just before serving and toss gently to combine."
      ],
      likes: 200,
      isLiked: false
    }
    
    
  ];
  