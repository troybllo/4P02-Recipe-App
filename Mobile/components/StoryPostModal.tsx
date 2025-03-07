import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo
import { getImageSource } from "@/data/stories";

// Define types
type Story = {
  username: string;
  images?: string[];
  img?: string;
  timestamp?: string;
  caption?: string;
  liked?: boolean;
  likes?: number;
  comments?: number;
  // Add other properties as needed
};

type StoryPostModalProps = {
  isVisible: boolean;
  onClose: () => void;
  stories: Story[];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const StoryPostModal: React.FC<StoryPostModalProps> = ({
  isVisible,
  onClose,
  stories,
  selectedIndex,
  setSelectedIndex,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Reset image index when story changes
  useEffect(() => {
    setCurrentImageIndex(0);
    if (isVisible) {
      setLoading(true);
    }
  }, [selectedIndex, isVisible]);

  const goToPrevStory = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNextStory = () => {
    if (selectedIndex !== null && selectedIndex < stories.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      // If it's the last story, close the modal
      onClose();
    }
  };

  const goToPrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      // If it's the first image, go to the previous story
      goToPrevStory();
    }
  };

  const goToNextImage = () => {
    const currentStory = selectedIndex !== null ? stories[selectedIndex] : null;
    const imagesCount = currentStory?.images?.length || 1;

    if (currentImageIndex < imagesCount - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      // If it's the last image, go to the next story
      goToNextStory();
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  if (selectedIndex === null || !isVisible) {
    return null;
  }

  const currentStory = stories[selectedIndex];
  const imageSource = currentStory.images
    ? { uri: currentStory.images[currentImageIndex] }
    : { uri: currentStory.img };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: currentStory.img || currentStory.images?.[0] }}
              style={styles.userAvatar}
            />
            <Text style={styles.username}>{currentStory.username}</Text>
            {currentStory.timestamp && (
              <Text style={styles.timestamp}>• {currentStory.timestamp}</Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Story Image */}
        <View style={styles.imageContainer}>
          {loading && <ActivityIndicator size="large" style={styles.loader} />}
          <Image
            source={getImageSource(imageSource)} // Use the helper function
            style={styles.storyImage}
          />
          {/* Navigation Overlay */}
          <View style={styles.navOverlay}>
            <TouchableOpacity
              style={[styles.navButton, styles.leftNav]}
              onPress={goToPrevImage}
            >
              <View />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, styles.rightNav]}
              onPress={goToNextImage}
            >
              <View />
            </TouchableOpacity>
          </View>

          {/* Image indicators - show if story has multiple images */}
          {currentStory.images && currentStory.images.length > 1 && (
            <View style={styles.indicators}>
              {currentStory.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Caption and actions */}
        {currentStory.caption && (
          <Text style={styles.caption}>{currentStory.caption}</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name={currentStory.liked ? "heart" : "heart-outline"}
              size={24}
              color={currentStory.liked ? "#ED4956" : "#000"}
            />
            {currentStory.likes !== undefined && (
              <Text style={styles.actionText}>{currentStory.likes}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#000" />
            {currentStory.comments !== undefined && (
              <Text style={styles.actionText}>{currentStory.comments}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
  },
  timestamp: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  closeButton: {
    padding: 4,
  },
  imageContainer: {
    width: width,
    height: width * 1.2, // Maintain aspect ratio
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  storyImage: {
    width: "100%",
    height: "100%",
  },
  navOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  navButton: {
    flex: 1,
    height: "100%",
  },
  leftNav: {
    // Left side navigation
  },
  rightNav: {
    // Right side navigation
  },
  indicators: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 10,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 2,
  },
  activeIndicator: {
    backgroundColor: "#3B82F6", // blue-500
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
  },
  caption: {
    padding: 16,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
  },
});

export default StoryPostModal;
