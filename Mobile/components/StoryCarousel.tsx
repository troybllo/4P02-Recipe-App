import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import StoryPostModal from "./StoryPostModal";
import {
  getImageProfileSource,
  getImageSource,
  stories,
} from "../data/stories"; // Import stories data

// Define a type for story objects
type Story = {
  username: string;
  images?: string[];
  img?: string;
  // Add other properties as needed
};

/**
 * Utility function to chunk an array into sub-arrays of a given size.
 * E.g. chunkArray([1,2,3,4,5,6,7], 3) => [[1,2,3],[4,5,6],[7]]
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

const StoryCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // For chunk pagination
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // For story modal
  const [chunkSize, setChunkSize] = useState(5); // default for small screens
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width,
  );

  // Update chunk size based on screen width
  useEffect(() => {
    const updateChunkSize = () => {
      const width = Dimensions.get("window").width;
      setScreenWidth(width);

      if (width < 375) {
        setChunkSize(4);
      } else if (width < 768) {
        setChunkSize(5);
      } else {
        setChunkSize(7);
      }
    };

    // Initial call
    updateChunkSize();

    // Set up event listener for dimension changes
    const dimensionsSubscription = Dimensions.addEventListener(
      "change",
      updateChunkSize,
    );

    // Cleanup
    return () => {
      dimensionsSubscription.remove();
    };
  }, []);

  // Break stories into pages based on chunkSize
  const storyChunks: Story[][] = chunkArray(stories as Story[], chunkSize);

  // Go to previous chunk if available
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Go to next chunk if available
  const handleNext = () => {
    if (currentIndex < storyChunks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // When user taps a story, open modal with its global index
  const handleStoryPress = (indexInChunk: number) => {
    const globalIndex = currentIndex * chunkSize + indexInChunk;
    setSelectedIndex(globalIndex);
    setIsModalOpen(true);
  };

  // If no stories, show nothing
  if (!storyChunks.length) return null;

  // Current batch of stories
  const currentStories = storyChunks[currentIndex];

  return (
    <>
      {/* Story Modal */}
      <StoryPostModal
        isVisible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIndex(null);
        }}
        stories={stories as Story[]}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      <View style={styles.container}>
        {/* Prev chunk arrow (show only if not on first page) */}
        {currentIndex > 0 && (
          <TouchableOpacity onPress={handlePrev} style={styles.arrowButton}>
            <Text style={styles.arrowText}>&lt;</Text>
          </TouchableOpacity>
        )}

        {/* Stories in the current chunk */}
        <View style={styles.storiesContainer}>
          {currentStories.map((story, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.storyButton}
              onPress={() => handleStoryPress(idx)}
            >
              {/* Gradient ring */}
              <View style={styles.gradientRing}>
                <Image
                  source={getImageProfileSource(story.images)} // Use the helper function
                  style={styles.storyImage}
                />
              </View>
              <Text
                style={styles.username}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {story.username}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {currentIndex < storyChunks.length - 1 && (
          <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
            <Text style={styles.arrowText}>&gt;</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingLeft: 30,
  },
  arrowButton: {
    padding: 8,
    backgroundColor: "#E5E7EB", // bg-gray-200
    borderRadius: 9999, // rounded-full
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  storiesContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  storyButton: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  gradientRing: {
    width: 64, // w-16
    height: 64, // h-16
    borderRadius: 32, // rounded-full
    padding: 2, // p-[2px]
    // We'll use a borderColor instead of a gradient for simplicity
    // In a real app, you'd use a linear gradient component
    borderWidth: 2,
    borderColor: "#EC4899", // pink-500
  },
  storyImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30, // rounded-full
    borderWidth: 2,
    borderColor: "white",
  },
  username: {
    fontSize: 12, // text-xs
    marginTop: 4, // mt-1
    color: "#374151", // text-gray-700
    width: 64, // w-16
    textAlign: "center",
  },
});

export default StoryCarousel;
