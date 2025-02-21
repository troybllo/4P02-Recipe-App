import React, { useState } from "react";

export default function StoryPostModal({
  isOpen,
  onClose,
  stories,
  selectedIndex,
  setSelectedIndex,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likes, setLikes] = useState(0);

  if (!isOpen || selectedIndex == null || !stories[selectedIndex]) {
    return null;
  }

  const {
    images = [],
    img = "https://via.placeholder.com/600x400.png?text=No+Image",
    profilePic = "https://via.placeholder.com/100.png?text=Profile",
    username = "Anonymous",
    dishTitle = "No Dish Title",
    cookName = "Unknown Cook",
    postDate = "Unknown Date",
    description = "No description provided.",
    tags = [],
  } = stories[selectedIndex];

  const displayedImage = images.length > 0 ? images[currentImageIndex] : img;

  // Move within the post's images
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };
  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  // Move between stories
  const handlePrevStory = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
      setCurrentImageIndex(0);
    }
  };
  const handleNextStory = () => {
    if (selectedIndex < stories.length - 1) {
      setSelectedIndex((prev) => prev + 1);
      setCurrentImageIndex(0);
    }
  };

  const handleLike = () => setLikes((prev) => prev + 1);
  const handleShare = () => alert("Share link clicked!");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      {/* 
        DESKTOP-ONLY ARROWS on the dark overlay 
        (hidden on mobile via "hidden md:block")
      */}
      {selectedIndex > 0 && (
        <button
          onClick={handlePrevStory}
          className="
            hidden md:block
            absolute z-50
            left-8 top-1/2 transform -translate-y-1/2
            bg-gray-200 hover:bg-gray-300 text-2xl font-bold px-5 py-3 rounded-full
          "
        >
          &lt;
        </button>
      )}
      {selectedIndex < stories.length - 1 && (
        <button
          onClick={handleNextStory}
          className="
            hidden md:block
            absolute z-50
            right-8 top-1/2 transform -translate-y-1/2
            bg-gray-200 hover:bg-gray-300 text-2xl font-bold px-5 py-3 rounded-full
          "
        >
          &gt;
        </button>
      )}

      {/* WHITE MODAL */}
      <div className="relative bg-white w-full max-w-4xl rounded-md shadow-lg p-4 md:p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="relative md:w-1/2 flex items-center justify-center mb-4 md:mb-0">
            <img
              src={displayedImage}
              alt={dishTitle}
              className="max-h-[450px] w-auto rounded-md object-cover"
            />

            {/* If multiple images, show mini carousel arrows at bottom of the image */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
                {currentImageIndex > 0 && (
                  <button
                    onClick={handlePrevImage}
                    className="bg-gray-100 hover:bg-gray-200 text-sm font-bold px-2 py-1 rounded-full mr-2"
                  >
                    &lt;
                  </button>
                )}
                <span className="text-sm text-gray-800 mx-1">
                  {currentImageIndex + 1} / {images.length}
                </span>
                {currentImageIndex < images.length - 1 && (
                  <button
                    onClick={handleNextImage}
                    className="bg-gray-100 hover:bg-gray-200 text-sm font-bold px-2 py-1 rounded-full ml-2"
                  >
                    &gt;
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 md:pl-6 flex flex-col">
            {/* Profile & Date */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <img
                  src={profilePic}
                  alt={username}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => alert("Profile icon clicked!")}
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{username}</span>
                  <span className="text-xs text-gray-500">{postDate}</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-1">Dish: &quot;{dishTitle}&quot;</h2>
            <p className="text-sm text-gray-600 mb-1">
              Cooked by <strong>{cookName}</strong>
            </p>
            <p className="text-sm text-gray-800 mb-3">{description}</p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Like & Share */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full text-sm"
                >
                  Like
                </button>
                <span className="text-sm text-gray-600">{likes} likes</span>
              </div>
              <button
                onClick={handleShare}
                className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full text-sm"
              >
                Share
              </button>
            </div>

            {/* "Save" and "See Full Recipe" Buttons */}
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

        {/* 
          MOBILE-ONLY STORY ARROWS 
          (shown on small screens, hidden on md+)
          Place them below the entire content, side by side
        */}
        <div className="block md:hidden mt-4 flex items-center justify-center space-x-4">
          {/* Prev Button */}
          {selectedIndex > 0 && (
            <button
              onClick={handlePrevStory}
              className="bg-gray-200 hover:bg-gray-300 text-base font-bold px-4 py-2 rounded-full"
            >
              &lt; Prev
            </button>
          )}
          {/* Next Button */}
          {selectedIndex < stories.length - 1 && (
            <button
              onClick={handleNextStory}
              className="bg-gray-200 hover:bg-gray-300 text-base font-bold px-4 py-2 rounded-full"
            >
              Next &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
