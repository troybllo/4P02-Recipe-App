// src/components/StoryCarousel.jsx
import React, { useState, useEffect } from "react";
import StoryPostModal from "./StoryPostModal";
import { stories } from "../data/stories"; // Import stories data

/**
 * Utility function to chunk an array into sub-arrays of a given size.
 * E.g. chunkArray([1,2,3,4,5,6,7], 3) => [[1,2,3],[4,5,6],[7]]
 */
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export default function StoryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0); // For chunk pagination
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null); // For story modal
  const [chunkSize, setChunkSize] = useState(5); // default for small screens

  // Update chunk size based on screen width
  useEffect(() => {
    const updateChunkSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setChunkSize(5);
      } else if (width < 1024) {
        setChunkSize(7);
      } else {
        setChunkSize(10);
      }
    };

    // Initial call
    updateChunkSize();

    window.addEventListener("resize", updateChunkSize);
    return () => window.removeEventListener("resize", updateChunkSize);
  }, []);

  // Break stories into pages based on chunkSize
  const storyChunks = chunkArray(stories, chunkSize);

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

  // When user clicks a story, open modal with its global index
  const handleStoryClick = (indexInChunk) => {
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
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIndex(null);
        }}
        stories={stories}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      <div className="flex items-center justify-center mt-4">
        {/* Prev chunk arrow (show only if not on first page) */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full mr-2"
          >
            &lt;
          </button>
        )}

        {/* Stories in the current chunk */}
        <div className="flex space-x-4">
          {currentStories.map((story, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleStoryClick(idx)}
            >
              {/* Gradient ring */}
              <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px] rounded-full">
                {/* If the story has multiple images, just show the first as the thumbnail */}
                <img
                  src={story.images?.[0] || story.img}
                  alt={story.username}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              {/* Username */}
              <p className="text-xs mt-1 text-gray-700 w-16 text-center truncate">
                {story.username}
              </p>
            </div>
          ))}
        </div>

        {/* Next chunk arrow (show only if not on last page) */}
        {currentIndex < storyChunks.length - 1 && (
          <button
            onClick={handleNext}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full ml-2"
          >
            &gt;
          </button>
        )}
      </div>
    </>
  );
}
