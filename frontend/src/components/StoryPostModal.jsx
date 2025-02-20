// src/components/StoryPostModal.jsx
import React from "react";

export default function StoryPostModal({
  isOpen,
  onClose,
  stories,
  selectedIndex,
  setSelectedIndex,
}) {
  // If the modal is closed or there's no valid selected story, return nothing
  if (!isOpen || selectedIndex == null || !stories[selectedIndex]) return null;

  const {
    img = "https://via.placeholder.com/600x400.png?text=No+Image",
    dishTitle = "Heavenly Garlic Pizza",
    cookName = "Ayaka Shoka",
    postDate = "September 4th 2024",
    description = "No description provided.",
    timeTaken = "30m",
    difficulty = "Medium",
    calories = "~550cal",
    ingredients = "8",
  } = stories[selectedIndex];

  // Move to previous story if not at the start
  const handlePrevStory = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
  };

  // Move to next story if not at the end
  const handleNextStory = () => {
    if (selectedIndex < stories.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      {/* Modal container */}
      <div className="relative bg-white w-full max-w-4xl rounded-md shadow-lg p-6">
        {/* Close button (top-right) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <span className="text-xl font-bold">&times;</span>
        </button>

        {/* Left arrow (show only if not at the first story) */}
        {selectedIndex > 0 && (
          <button
            onClick={handlePrevStory}
            className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 
                       bg-gray-200 hover:bg-gray-300 text-xl font-bold px-3 py-2 rounded-full"
          >
            &lt;
          </button>
        )}

        {/* Right arrow (show only if not at the last story) */}
        {selectedIndex < stories.length - 1 && (
          <button
            onClick={handleNextStory}
            className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 
                       bg-gray-200 hover:bg-gray-300 text-xl font-bold px-3 py-2 rounded-full"
          >
            &gt;
          </button>
        )}

        {/* Modal content layout */}
        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="md:w-1/2 md:pr-4 mb-4 md:mb-0 flex items-center justify-center">
            <img
              src={img}
              alt={dishTitle}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 md:pl-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">
                Dish: &quot;{dishTitle}&quot;
              </h2>
              <p className="text-sm text-gray-600 mb-1">Cooked by {cookName}</p>
              <p className="text-sm text-gray-500 mb-4">Posted {postDate}</p>

              <p className="text-sm mb-4 text-gray-700">{description}</p>

              {/* Recipe Facts */}
              <div className="border-t border-gray-200 pt-2">
                <h3 className="font-semibold mb-2">Recipe Facts</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                    Time Taken: {timeTaken}
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                    Difficulty: {difficulty}
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                    Calories: {calories}
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                    Ingredients: {ingredients}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-end mt-4 space-x-3">
              <button className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
                Save
              </button>
              <button className="bg-orange-300 px-3 py-2 rounded hover:bg-orange-400 font-semibold">
                See Full Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
