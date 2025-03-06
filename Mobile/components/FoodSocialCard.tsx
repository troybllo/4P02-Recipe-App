import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo
import { Recipe } from "../types/Recipe";

// Now FoodSocialCardProps is exactly the same as Recipe
type FoodSocialCardProps = Recipe;

const FoodSocialCard: React.FC<FoodSocialCardProps> = ({
  postId,
  title,
  author,
  authorId,
  datePosted,
  description,
  cookingTime,
  difficulty,
  servings,
  imageUrl,
  likes,
  isLiked,
  // You don't need to destructure ingredients and instructions if not used in this component
}) => {
  return (
    <View style={styles.card}>
      {/* Image */}
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>By {author}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Recipe details */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{cookingTime}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{difficulty}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {servings.toString()} servings
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.likeButton}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? "#ED4956" : "#6B7280"}
            />
            <Text style={styles.likeCount}>{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    height: 200,
    width: "100%",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 12,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    fontSize: 14,
    marginLeft: 6,
    color: "#6B7280",
  },
  readMoreButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  readMoreText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default FoodSocialCard;
