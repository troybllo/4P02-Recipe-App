import React, { useState } from "react";
import { View, FlatList, StyleSheet, TextInput } from "react-native";
import { Recipe } from "../types/Recipe";
import FoodSocialCard from "../components/FoodSocialCard";

// Sample data, replace with your actual data source
const sampleRecipes: Recipe[] = [
  {
    postId: "1",
    title: "Spaghetti Carbonara",
    author: "Chef John",
    authorId: "chef-john",
    datePosted: "2023-05-15",
    description:
      "A classic Italian pasta dish with eggs, cheese, and pancetta.",
    cookingTime: "30 mins",
    difficulty: "Medium",
    servings: 4, // This is a number as per your data structure
    imageUrl: "https://example.com/carbonara.jpg",
    ingredients: ["Pasta", "Eggs", "Pancetta", "Cheese"],
    instructions: ["Boil pasta", "Mix eggs and cheese", "Combine and serve"],
    likes: 125,
    isLiked: false,
  },
  // More recipes...
];

const RecipeListScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [searchQuery, setSearchQuery] = useState("");

  // Updated filter function with proper typing
  const filteredRecipes = recipes.filter((recipe: Recipe): boolean => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.author.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.postId}
        renderItem={({ item }) => <FoodSocialCard {...item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  list: {
    padding: 16,
  },
});

export default RecipeListScreen;
