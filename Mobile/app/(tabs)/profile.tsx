import { useState } from "react";
import { recipes } from "../../data/recipe";
import { Button, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { Image } from "react-native";

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
    <View style={styles.container}>
      <View style={styles.container2}>
        <View style={styles.container3}>
          <View style={styles.profile1}>
            <Image
              source={{ uri: profilePic }}
              alt="Profile Pic"
              style={styles.profileImg}
            />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    width: "auto",
  },
  container2: {
    display: "flex",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container3: {
    display: "flex",
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
    flex: 1, // This will make it take available space
    maxWidth: "70%", // Adjust based on your layout needs
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
    fontWeight: "thin",
    lineHeight: 16,
    color: "gray",
    paddingBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: "heavy",
  },
  bioHeading: {
    fontSize: 12,
    fontWeight: "thin",
    lineHeight: 16,
    color: "gray",
    paddingTop: 16,
    paddingBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "heavy",
    flexWrap: "wrap",
    flexShrink: 1,
    width: "100%",
  },
});
