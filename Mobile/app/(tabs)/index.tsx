import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import FoodSocialCard from "../../components/FoodSocialCard";
import StoryCarousel from "../../components/StoryCarousel";
import { recipes } from "../../data/recipe"; // Import recipes data

interface Recipe {
  postId: string;
  title: string;
  author: string;
  authorId: string;
  datePosted: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  servings: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  likes: number;
  isLiked: boolean;
}

type FilterType = "vegetable" | "seafood" | "beef" | "spicy" | null;

// Helper function to infer category from various fields
function getCategory(recipe: Recipe): string {
  // Ensure ingredients and instructions are arrays before joining
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.join(" ")
    : "";
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.join(" ")
    : "";
  const combinedText = (
    recipe.title +
    " " +
    recipe.description +
    " " +
    ingredients +
    " " +
    instructions
  ).toLowerCase();

  if (combinedText.includes("beef") || combinedText.includes("steak"))
    return "beef";
  if (combinedText.includes("lobster") || combinedText.includes("seafood"))
    return "seafood";
  if (combinedText.includes("vegetable") || combinedText.includes("salad"))
    return "vegetable";
  if (combinedText.includes("chili") || combinedText.includes("spicy"))
    return "spicy";
  return "other";
}

const HomeScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [numColumns, setNumColumns] = useState<number>(1);

  // Handle screen rotation and size changes
  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get("window");
      if (width >= 1000) {
        setNumColumns(3);
      } else if (width >= 700) {
        setNumColumns(2);
      } else {
        setNumColumns(1);
      }
    };

    // Initial call
    updateLayout();

    // Add event listener
    Dimensions.addEventListener("change", updateLayout);

    // Cleanup
    return () => {
      // This is optional as React Native handles this automatically in newer versions
    };
  }, []);

  // Combined filtering logic that checks title, description, ingredients, and instructions
  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join(" ")
      : "";
    const instructions = Array.isArray(recipe.instructions)
      ? recipe.instructions.join(" ")
      : "";
    const combinedText = (
      recipe.title +
      " " +
      recipe.description +
      " " +
      ingredients +
      " " +
      instructions
    ).toLowerCase();

    const matchesFilter = activeFilter
      ? getCategory(recipe) === activeFilter
      : true;
    const matchesSearch = searchQuery
      ? combinedText.includes(searchQuery.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  const handleFilterClick = (filterName: FilterType) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  // Filter button component to avoid repetition
  const FilterButton: React.FC<{
    name: FilterType;
    label: string;
    activeColor: string;
    inactiveColor: string;
    textActiveColor: string;
    textInactiveColor: string;
  }> = ({
    name,
    label,
    activeColor,
    inactiveColor,
    textActiveColor,
    textInactiveColor,
  }) => (
    <TouchableOpacity
      onPress={() => handleFilterClick(name)}
      style={[
        styles.filterButton,
        {
          backgroundColor: activeFilter === name ? activeColor : inactiveColor,
        },
      ]}
    >
      <Text
        style={{
          color: activeFilter === name ? textActiveColor : textInactiveColor,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Story Carousel */}
        <StoryCarousel />

        {/* Search Bar */}
        <TextInput
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <FilterButton
            name="vegetable"
            label="Vegetable"
            activeColor="#22c55e"
            inactiveColor="#dcfce7"
            textActiveColor="#ffffff"
            textInactiveColor="#166534"
          />
          <FilterButton
            name="seafood"
            label="Seafood"
            activeColor="#2563eb"
            inactiveColor="#dbeafe"
            textActiveColor="#ffffff"
            textInactiveColor="#1e40af"
          />
          <FilterButton
            name="beef"
            label="Beef"
            activeColor="#dc2626"
            inactiveColor="#fee2e2"
            textActiveColor="#ffffff"
            textInactiveColor="#991b1b"
          />
          <FilterButton
            name="spicy"
            label="Spicy"
            activeColor="#dc2626"
            inactiveColor="#fee2e2"
            textActiveColor="#ffffff"
            textInactiveColor="#991b1b"
          />
        </View>
      </View>

      {/* Recipe List */}
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.postId}
        numColumns={numColumns}
        key={numColumns} // Force re-render when columns change
        renderItem={({ item }) => <FoodSocialCard {...item} />}
        contentContainerStyle={styles.recipeList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: "#eaf5e4",
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 16,
    borderColor: "#d1d5db",
    borderWidth: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  recipeList: {
    padding: 8,
  },
});

export default HomeScreen;
