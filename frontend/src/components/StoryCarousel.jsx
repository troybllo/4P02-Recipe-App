// src/components/StoryCarousel.jsx
import React, { useState } from "react";

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

// Sample data (replace with real user info later)
const dummyStories = [
  {
    username: "Gordon Ramsey",
    img: "https://via.placeholder.com/150/FF0000/FFFFFF?text=User1",
  },
  {
    username: "Jaque pepan",
    img: "https://via.placeholder.com/150/00FF00/FFFFFF?text=User2",
  },
  {
    username: "Wolfgang puck",
    img: "https://via.placeholder.com/150/0000FF/FFFFFF?text=User3",
  },
  {
    username: "The Bear",
    img: "https://via.placeholder.com/150/FFFF00/000000?text=User4",
  },
  {
    username: "Roger",
    img: "https://via.placeholder.com/150/FF00FF/000000?text=User5",
  },
  {
    username: "Gordon Ramsey",
    img: "https://via.placeholder.com/150/FF0000/FFFFFF?text=User1",
  },
  {
    username: "Jaque pepan",
    img: "https://via.placeholder.com/150/00FF00/FFFFFF?text=User2",
  },
  {
    username: "Wolfgang puck",
    img: "https://via.placeholder.com/150/0000FF/FFFFFF?text=User3",
  },
  {
    username: "The Bear",
    img: "https://via.placeholder.com/150/FFFF00/000000?text=User4",
  },
  {
    username: "Roger",
    img: "https://via.placeholder.com/150/FF00FF/000000?text=User5",
  },
  // ... add as many as you want
];

export default function StoryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Break stories into pages of 5
  const storyChunks = chunkArray(dummyStories, 5);

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

  // If no stories, show nothing
  if (!storyChunks.length) return null;

  // Current batch of 5 stories
  const currentStories = storyChunks[currentIndex];

  return (
    <div className="flex items-center justify-center mt-4">
      {/* Prev arrow (show only if not on first page) */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full mr-2"
        >
          &lt;
        </button>
      )}

      {/* Stories */}
      <div className="flex space-x-4">
        {currentStories.map((story, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* Gradient ring */}
            <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px] rounded-full">
              <img
                src={story.img}
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

      {/* Next arrow (show only if not on last page) */}
      {currentIndex < storyChunks.length - 1 && (
        <button
          onClick={handleNext}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full ml-2"
        >
          &gt;
        </button>
      )}
    </div>
  );
}
