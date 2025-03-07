import { useEffect, useState } from "react";
import { recipes } from "../../data/recipe";
import { View, Text } from "react-native";

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

export const username = "otmux";
export const bio = "I love healthy foods for my bouldering training!";

const ownerRecipes = recipes.filter((recipe) => {
  return recipe.authorId === "user_789";
});

export default function Profile() {
  const profilePic =
    "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
  const PostsIcon =
    "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";

  const formatBio = (bio: string) => {
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

  const [showPosts, setShowPosts] = useState(true);

  const handlePosts = () => {
    setShowPosts(true);
  };

  const handleSaved = () => {
    setShowPosts(false);
  };

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  return (
    <>
      <div></div>
    </>
  );
}
