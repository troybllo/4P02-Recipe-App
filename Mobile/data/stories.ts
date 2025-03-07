/// src/data/stories.js

// Helper function to map image names to require() statements
export const getImageSource = (imageName: any) => {
  switch (imageName) {
    case "pizza.jpg":
      return require("../assets/images/pizza.jpg");
    case "french omelette.jpg":
      return require("../assets/images/french omelette.jpg");
    case "meal1.jpg":
      return require("../assets/images/meal1.jpg");
    case "meal2.jpg":
      return require("../assets/images/meal2.jpg");
    case "Gordon.jpg":
      return require("../assets/images/Gordon.jpg");
    default:
      return require("../assets/images/meal2.jpg"); // Fallback image
  }
};

export const stories = [
  {
    username: "Gordon Ramsey",
    profilePic: "Gordon.jpg", // Use the image name
    images: ["pizza.jpg", "french omelette.jpg", "meal1.jpg", "meal2.jpg"], // Use image names
    dishTitle: "Heavenly Garlic Pizza",
    cookName: "Ayaka Shoka",
    postDate: "September 4th 2024",
    description:
      "A crispy pizza made from fresh ingredients in the oven. Student-friendly. My opinions are in the comments below!",
    timeTaken: "30m",
    difficulty: "Medium",
    calories: "~550cal",
    ingredients: "8",
  },
  {
    username: "Jaque pepan",
    profilePic: "Gordon.jpg", // Use the image name
    images: ["meal2.jpg", "meal1.jpg"], // Use image names
    dishTitle: "Classic French Omelette",
    cookName: "Chef Pepin",
    postDate: "March 12th 2025",
    description: "A fluffy omelette made with the best French techniques...",
    timeTaken: "15m",
    difficulty: "Easy",
    calories: "~300cal",
    ingredients: "4",
  },
  {
    username: "Gordon Ramsey",
    profilePic: "Gordon.jpg", // Use the image name
    images: ["meal1.jpg", "pizza.jpg"], // Use image names
    dishTitle: "Heavenly Garlic Pizza",
    cookName: "Ayaka Shoka",
    postDate: "September 4th 2024",
    description:
      "A crispy pizza made from fresh ingredients in the oven. Student-friendly. My opinions are in the comments below!",
    timeTaken: "30m",
    difficulty: "Medium",
    calories: "~550cal",
    ingredients: "8",
  },
  {
    username: "Jaque pepan",
    profilePic: "Gordon.jpg", // Use the image name
    images: ["french omelette.jpg", "meal2.jpg"], // Use image names
    dishTitle: "Classic French Omelette",
    cookName: "Chef Pepin",
    postDate: "March 12th 2025",
    description: "A fluffy omelette made with the best French techniques...",
    timeTaken: "15m",
    difficulty: "Easy",
    calories: "~300cal",
    ingredients: "4",
  },
  {
    username: "Gordon Ramsey",
    profilePic: "Gordon.jpg", // Use the image name
    images: ["pizza.jpg"], // Use image names
    dishTitle: "Heavenly Garlic Pizza",
    cookName: "Ayaka Shoka",
    postDate: "September 4th 2024",
    description:
      "A crispy pizza made from fresh ingredients in the oven. Student-friendly. My opinions are in the comments below!",
    timeTaken: "30m",
    difficulty: "Medium",
    calories: "~550cal",
    ingredients: "8",
  },
  {
    username: "Jaque pepan",
    profilePic: "Gordon.jpg", // Use the image name
    images: ["french omelette.jpg"], // Use image names
    dishTitle: "Classic French Omelette",
    cookName: "Chef Pepin",
    postDate: "March 12th 2025",
    description: "A fluffy omelette made with the best French techniques...",
    timeTaken: "15m",
    difficulty: "Easy",
    calories: "~300cal",
    ingredients: "4",
  },
  {
    username: "Gordon Ramsey",
    profilePic: "Gordon.jpg", // Use the image name
    images: ["pizza.jpg"], // Use image names
    dishTitle: "Heavenly Garlic Pizza",
    cookName: "Ayaka Shoka",
    postDate: "September 4th 2024",
    description:
      "A crispy pizza made from fresh ingredients in the oven. Student-friendly. My opinions are in the comments below!",
    timeTaken: "30m",
    difficulty: "Medium",
    calories: "~550cal",
    ingredients: "8",
  },
  {
    username: "Jaque pepan",
    profilePic: "Gordon.jpg", // Use the image name
    images: ["french omelette.jpg", "meal2.jpg"], // Use image names
    dishTitle: "Classic French Omelette",
    cookName: "Chef Pepin",
    postDate: "March 12th 2025",
    description: "A fluffy omelette made with the best French techniques...",
    timeTaken: "15m",
    difficulty: "Easy",
    calories: "~300cal",
    ingredients: "4",
  },
  // ... add more stories as needed
];
