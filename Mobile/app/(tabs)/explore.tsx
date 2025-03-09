import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import Carousel from "react-native-reanimated-carousel";
import { Video, AVPlaybackStatus } from "expo-av";

const { width: screenWidth } = Dimensions.get("window");

type CarouselItem = {
  type: "image" | "video";
  uri: string;
};

type Collection = {
  id: number;
  name: string;
  image: string;
};

export const getImageSource = (imageName: string) => {
  switch (imageName) {
    case "meal1.jpg":
      return require("../../assets/images/meal1.jpg");
    case "meal2.jpg":
      return require("../../assets/images/meal1.jpg");
    case "meal3.jpg":
      return require("../../assets/images/meal3.jpg");
    case "meal4.jpg":
      return require("../../assets/images/meal4.jpg");
    case "meal5.webp":
      return require("../../assets/images/meal5.webp");
    case "meal6.webp":
      return require("../../assets/images/meal6.webp");
    case "meal7.jpg":
      return require("../../assets/images/meal7.jpg");
    default:
      return require("../../assets/images/meal1.jpg"); // Fallback image
  }
};

export default function Explore() {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>(
    {} as AVPlaybackStatus,
  );

  const carouselItems: CarouselItem[] = [
    {
      type: "image",
      uri: "meal1.jpg",
    },
    {
      type: "video",
      uri: "https://www.w3schools.com/html/mov_bbb.mp4", // Video URL
    },
    {
      type: "image",
      uri: "meal2.jpg",
    },
  ];

  const categories = ["Breakfast", "Lunch", "Dinner", "Dessert"];

  const collections: Collection[] = [
    {
      id: 1,
      name: "Quick Breakfast",
      image: "meal3.jpg",
    },
    {
      id: 2,
      name: "Healthy Lunch",
      image: "meal4.jpg",
    },
    {
      id: 3,
      name: "Hearty Dinner",
      image: "meal5.webp",
    },
    {
      id: 4,
      name: "Sweet Desserts",
      image: "meal6.webp",
    },
    {
      id: 5,
      name: "Snacks",
      image: "meal7.jpg",
    },
    {
      id: 6,
      name: "Drinks",
      image: "meal1.jpg",
    },
  ];

  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: CarouselItem;
    index: number;
  }) => {
    if (item.type === "video") {
      return (
        <Video
          ref={videoRef}
          style={styles.carouselItem}
          source={{ uri: item.uri }}
          useNativeControls
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(status)}
        />
      );
    } else if (item.type === "image") {
      return (
        <Image
          source={getImageSource(item.uri)} // Use helper function
          style={styles.carouselItem}
          contentFit="cover"
          onError={(error) => console.log("Image failed to load:", error)}
        />
      );
    }

    return (
      <View style={styles.carouselItem}>
        <Text>Unsupported media type</Text>
      </View>
    );
  };

  const renderCollectionItem = (collection: Collection) => {
    return (
      <TouchableOpacity
        key={collection.id}
        style={styles.collectionItem}
        onPress={() => handleCollectionPress(collection)}
      >
        <Image
          source={getImageSource(collection.image)}
          style={styles.collectionImage}
          contentFit="cover"
          onError={(error) => console.log("Image failed to load:", error)}
        />
        <Text style={styles.collectionText}>{collection.name}</Text>
      </TouchableOpacity>
    );
  };

  const handleCollectionPress = (collection: Collection) => {
    console.log(`Pressed ${collection.name}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput placeholder="Search recipes..." style={styles.searchInput} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Carousel
          width={screenWidth}
          height={200}
          data={carouselItems}
          renderItem={renderCarouselItem}
          loop
        />

        <View style={styles.categories}>
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>

        <View style={styles.collectionsContainer}>
          {collections.map((collection) => renderCollectionItem(collection))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: 100,
  },
  carouselItem: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  categoryItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  collectionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  collectionItem: {
    width: "48%",
    marginBottom: 20,
    alignItems: "center",
  },
  collectionImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  collectionText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
