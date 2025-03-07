import React, { useState } from "react";
import { recipes } from "../../data/recipe";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { FoodSocialGrid } from "../../components/FoodCardMini"; // Import the new component
import { Recipe } from "@/types/Recipe";

export const username = "otmux";
export const bio = "I love healthy foods for my bouldering training!";

const ownerRecipes = recipes.filter((recipe) => {
  return recipe.authorId === "user_789";
});

export default function Profile() {
  const profilePic =
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

  const [selectedButton, setSelectedButton] = useState<"posts" | "saved">(
    "posts",
  );
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

  const handleRecipePress = (recipe: Recipe) => {
    // Navigate to the detailed view of the recipe
    console.log("Recipe pressed:", recipe.title);
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <View style={styles.container3}>
          <View style={styles.profile1}>
            <Image source={{ uri: profilePic }} style={styles.profileImg} />

            <TouchableOpacity
              onPress={() => setIsEditProfileOpen(true)}
              style={styles.profileBut}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profile2}>
            <Text style={styles.usernameHeading}>Username: </Text>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.bioHeading}>Short Bio: </Text>
            <Text style={styles.bio}>{formatBio(bio)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.postsBut,
            selectedButton === "posts" && styles.activeButton,
          ]}
          onPress={() => {
            setSelectedButton("posts");
            handlePosts();
          }}
        >
          <Text style={styles.postsButText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.postsBut,
            selectedButton === "saved" && styles.activeButton,
          ]}
          onPress={() => {
            setSelectedButton("saved");
            handleSaved();
          }}
        >
          <Text style={styles.postsButText}>Saved</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.postContainer}>
        {showPosts ? (
          <FoodSocialGrid recipes={ownerRecipes} onPress={handleRecipePress} />
        ) : (
          <Text>No saved posts yet</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  container2: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container3: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    paddingVertical: 20,
    gap: 50,
  },
  profile1: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 20,
  },
  profile2: {
    textAlign: "left",
    flex: 1,
    maxWidth: "70%",
  },
  profileImg: {
    borderRadius: 9999,
    width: 100,
    height: 100,
  },
  profileBut: {
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 16,
  },
  usernameHeading: {
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "gray",
    paddingBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bioHeading: {
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "gray",
    paddingTop: 16,
    paddingBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "bold",
    flexWrap: "wrap",
    flexShrink: 1,
    width: "100%",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  postContainer: {
    flex: 1,
  },
  postsBut: {
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 4,
    minWidth: 100,
  },
  activeButton: {
    backgroundColor: "lightgray",
  },
  postsButText: {
    fontSize: 16,
    lineHeight: 16,
  },
});
