// src/components/StoryCarousel.jsx
import React from "react";

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
  // ... add as many as you want
];

export default function StoryCarousel() {
  return (
    <div className="overflow-x-auto w-full px-4 mt-4">
      <div className="flex items-center space-x-4">
        {dummyStories.map((story, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* Gradient ring wrapper */}
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
    </div>
  );
}
