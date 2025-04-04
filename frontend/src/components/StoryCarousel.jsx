// src/components/StoryCarousel.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);

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
    if (isDragging) return; // Don't open modal if user was dragging
    const globalIndex = currentIndex * chunkSize + indexInChunk;
    setSelectedIndex(globalIndex);
    setIsModalOpen(true);
  };

  // Handle mouse/touch events for horizontal scroll
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // If no stories, show nothing
  if (!storyChunks.length) return null;

  // Current batch of stories
  const currentStories = storyChunks[currentIndex];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const storyVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
      },
    }),
    hover: {
      y: -5,
      scale: 1.05,
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  const buttonVariants = {
    initial: { opacity: 0.6, scale: 0.9 },
    hover: {
      opacity: 1,
      scale: 1.1,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    },
    tap: { scale: 0.9 },
  };

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

      <motion.div
        className="relative w-full max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Prev chunk arrow (show only if not on first page) */}
        <AnimatePresence>
          {currentIndex > 0 && (
            <motion.button
              onClick={handlePrev}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm hover:bg-white text-[#1d9c3f] rounded-full shadow-lg z-10"
              variants={buttonVariants}
              initial="initial"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              exit={{ opacity: 0, x: -20 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 19L8 12L15 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Stories in the current chunk */}
        <div
          className="flex space-x-6 px-8 py-4 overflow-x-auto scrollbar-hide"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {currentStories.map((story, idx) => (
            <motion.div
              key={`story-${currentIndex}-${idx}`}
              className="flex flex-col items-center cursor-pointer flex-shrink-0"
              onClick={() => handleStoryClick(idx)}
              custom={idx} // Pass the index to stagger animations
              variants={storyVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              {/* Gradient ring with pulse animation */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 0 0px rgba(236, 72, 153, 0.7)",
                      "0 0 0 3px rgba(236, 72, 153, 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />

                <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px] rounded-full">
                  {/* If the story has multiple images, just show the first as the thumbnail */}
                  <img
                    src={story.images?.[0] || story.img}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
              </div>

              {/* Username with subtle animation */}
              <motion.p
                className="text-sm mt-2 text-gray-700 w-20 text-center truncate font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {story.username}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Next chunk arrow (show only if not on last page) */}
        <AnimatePresence>
          {currentIndex < storyChunks.length - 1 && (
            <motion.button
              onClick={handleNext}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm hover:bg-white text-[#1d9c3f] rounded-full shadow-lg z-10"
              variants={buttonVariants}
              initial="initial"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              exit={{ opacity: 0, x: 20 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5L16 12L9 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
