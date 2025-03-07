import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Recipe } from "../types/Recipe";
import { getImageSource } from "@/data/recipe";

type FoodSocialGridProps = {
  recipes: Recipe[];
  onPress: (recipe: Recipe) => void;
};

const FoodSocialGrid: React.FC<FoodSocialGridProps> = ({
  recipes,
  onPress,
}) => {
  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;
  const itemSize = screenWidth / numColumns;

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.postId}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onPress(item)}
          style={{ width: itemSize, height: itemSize, padding: 1 }}
        >
          <Image
            source={getImageSource(item.imageUrl)} // Use the helper function
            style={{ width: "100%", height: "100%" }}
          />
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.gridContainer}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    padding: 1, // Adjust as needed
  },
});

export { FoodSocialGrid };
