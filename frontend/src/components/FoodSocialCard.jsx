import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/FoodSocialCard.module.css";
import EditPost from "../components/EditPost";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import feastlyLogo from "../images/feastly_black.png";
import Popup from "./Popup";

const FoodSocialCard = ({
  postId,
  id,
  title,
  author = "Recipe Creator",
  authorId,
  datePosted,
  description,
  cookingTime,
  difficulty,
  servings,
  imageUrl,
  imageList,
  ingredients,
  instructions,
  likes,
  isLiked,
  userId,
}) => {
  const recipeId = id || postId;

  const [authorData, setAuthorData] = useState({
    username: "",
    profileImageUrl: "",
  });

  const displayImageUrl =
    imageUrl || (imageList && imageList.length > 0 ? imageList[0].url : null);

  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isRecipeExpanded, setIsRecipeExpanded] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
    
  const triggerPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };

  const formattedDate = datePosted
    ? new Date(datePosted).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const [isEditPostOpen, setIsEditPostOpen] = useState(false);

  const handleEditPost = () => {
    setIsEditPostOpen(false);
  };

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
  
    const heart = document.createElement("div");
    const currentUserId = localStorage.getItem("userId");
    
    if (!currentUserId) {
      triggerPopup(`This feature requires sign in`, `error`);
      setIsLoading(false);
      return;
    }
    
    heart.className = styles.floatingHeart;
    cardRef.current.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  
    try {
      // Determine if we're liking or unliking
      const endpoint = liked 
        ? 'http://127.0.0.1:5000/api/recipes/unlike'
        : 'http://127.0.0.1:5000/api/recipes/like';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: authorId || userId,
          postId: recipeId,
          likerId: currentUserId
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        setLiked(!liked);
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
        
        if (triggerPopup) {
          if(liked) triggerPopup("Removed Like!");
          else triggerPopup("Liked Recipe!");
        }
      } else {
        console.error("Error toggling like:", data.error);
        triggerPopup(`Error: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      triggerPopup("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      });
    } catch (error) {
      console.log("Error sharing:", error);
      navigator.clipboard.writeText(window.location.href);

      const copyMsg = document.createElement("div");
      copyMsg.className = styles.copyMsg;
      copyMsg.innerText = "Link copied!";
      cardRef.current.appendChild(copyMsg);
      setTimeout(() => copyMsg.remove(), 2000);
    }
  };

  const handleTitleClick = () => {
    setIsTitleExpanded(!isTitleExpanded);
  };

  const handleRecipeClick = () => {
    setIsRecipeExpanded(!isRecipeExpanded);
  };

  const handleRecipeDownload = () => {
    downloadRecipeAsPDF({
      title,
      author,
      datePosted,
      cookingTime,
      difficulty,
      servings,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
    });
    console.log("Recipe downloaded!");
    triggerPopup && triggerPopup("Recipe downloaded!");
  };

  const currentUserId = localStorage.getItem("userId");
  const isOwner = currentUserId === (authorId || userId);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    hover: {
      y: -5,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.98 },
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 },
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  let parsedIngredients = ingredients;
  let parsedInstructions = instructions;

  if (typeof ingredients === "string") {
    try {
      parsedIngredients = JSON.parse(ingredients);
    } catch (e) {
      parsedIngredients = [ingredients];
    }
  }

  if (typeof instructions === "string") {
    try {
      parsedInstructions = JSON.parse(instructions);
    } catch (e) {
      parsedInstructions = [instructions];
    }
  }

  parsedIngredients = Array.isArray(parsedIngredients) ? parsedIngredients : [];
  parsedInstructions = Array.isArray(parsedInstructions)
    ? parsedInstructions
    : [];

    useEffect(() => {
      const checkLikedStatus = async () => {
        const currentUserId = localStorage.getItem("userId");
        if (!currentUserId || !recipeId) return;
        
        try {
          // Use the correct endpoint structure: /recipes/{postId}?userId={authorId}
          const response = await fetch(
            `http://127.0.0.1:5000/api/recipes/${recipeId}?userId=${authorId || userId}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.likedBy) {
              // Check if current user is in the likedBy array
              setLiked(data.likedBy.includes(currentUserId));
              // Update like count
              setLikeCount(data.likes || 0);
            }
          }
        } catch (error) {
          console.error("Error checking liked status:", error);
        }
      };
      
      checkLikedStatus();
    }, [recipeId, authorId, userId]);

  const downloadRecipeAsPDF = (recipe) => {
    const {
      title,
      author = authorData.username,
      datePosted,
      cookingTime = "N/A",
      difficulty = "N/A",
      servings = "N/A",
      ingredients = [],
      instructions = [],
    } = recipe;

    const doc = new jsPDF();

    const formattedDate = datePosted
      ? new Date(datePosted).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown Date";

    const loadImageAndGenerate = () => {
      const img = new Image();
      img.src = feastlyLogo;

      img.onload = () => {
        doc.addImage(img, "PNG", 15, 10, 15, 15); // (img, type, x, y, width, height)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Feastly Recipes", 35, 20);

        // Title & Meta
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(title, 20, 35);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        console.log("Author Data:", authorData);
        doc.text(`By: ${authorData.username}`, 20, 43);
        doc.text(`Date: ${formattedDate}`, 20, 49);
        doc.text(`Cooking Time: ${cookingTime}`, 20, 55);
        doc.text(`Difficulty: ${difficulty}`, 20, 61);
        doc.text(`Servings: ${servings}`, 20, 67);

        // Ingredients Table
        autoTable(doc, {
          startY: 75,
          head: [["Ingredients"]],
          body: ingredients.map((item) => [item]),
          theme: "striped",
          styles: { font: "helvetica", fontSize: 11 },
        });

        // Instructions Table
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [["Step", "Instruction"]],
          body: instructions.map((step, i) => [`${i + 1}`, step]),
          theme: "grid",
          styles: { font: "helvetica", fontSize: 11 },
          headStyles: { fillColor: [217, 237, 211], textColor: [0, 100, 0] },
        });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Generated by Feastly", 20, doc.internal.pageSize.height - 10);

        doc.save(`${title}.pdf`);
      };
    };

    loadImageAndGenerate();
  };

  return (
    <>
      <Popup show={showPopup} message={popupMessage} type={popupType} className="z-[9999]"/>
      <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative"
        ref={cardRef}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center">
            <Link to={`/profile/${authorData.username}`}>
              <motion.div
                className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0"
                whileHover={{ scale: 1.2 }}
              >
                {authorData.username && authorData.username[0]
                  ? authorData.username[0]
                  : "?"}
              </motion.div>
            </Link>
            <div className="ml-3 flex-1 min-w-0">
              <h3
                className="font-semibold text-gray-800"
                style={{
                  maxWidth: "100%",
                  wordBreak: "break-word",
                }}
              >
                {title || "Untitled Recipe"}
              </h3>
              <Link
                to={`/profile/${authorData.username}`}
                className="text-xs text-gray-500"
              >
                by {authorData.username || "Unknown"} • {formattedDate}
              </Link>
            </div>
          </div>

          {isOwner && (
            <motion.button
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Edit Post"
              onClick={() => setIsEditPostOpen(true)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              •••
            </motion.button>
          )}
        </div>

        {/* Card Image */}
        <div className="relative overflow-hidden">
        <Link
            to={`/recipes/${recipeId}`}
            onClick={() => {
              if (userId) {
                localStorage.setItem("viewedRecipeUserId", userId);
              }
            }}
          >
            <motion.div className="relative group">
              {displayImageUrl ? (
                <motion.img
                  src={displayImageUrl}
                  alt={title}
                  className="w-full h-56 md:h-64 object-cover"
                  loading="lazy"
                  variants={imageVariants}
                  whileHover="hover"
                />
              ) : (
                <div className="w-full h-56 md:h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
              {isHovered && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-white text-center pb-4 px-3 font-medium">
                    View full recipe
                  </p>
                </motion.div>
              )}
            </motion.div>
          </Link>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Recipe Metadata */}
          <motion.div
            className="flex flex-wrap gap-2 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.span
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              ⏱️ {cookingTime || "N/A"}
            </motion.span>
            <motion.span
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              📊 {difficulty || "Easy"}
            </motion.span>
            <motion.span
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              👥 {servings || "N/A"}
            </motion.span>
          </motion.div>

          <motion.p
            className="text-gray-600 text-sm mb-4 line-clamp-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {description || "No description available."}
          </motion.p>

          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <motion.button
                className={`p-2 rounded-full ${liked ? "text-red-500" : "text-gray-500 hover:text-red-500"} flex items-center`}
                onClick={handleLike}
                disabled={isLoading}
                aria-label={liked ? "Unlike" : "Like"}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {liked ? "❤️" : "🤍"}
                <motion.span
                  className="ml-1 text-sm font-medium"
                  key={likeCount} // Force animation when count changes
                  initial={{ scale: 1.5, y: -3 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {likeCount}
                </motion.span>
              </motion.button>

              <motion.button
                className="p-2 rounded-full text-gray-500 hover:text-gray-700"
                onClick={handleShare}
                aria-label="Share"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                📤
              </motion.button>

              <motion.button
                className="p-2 rounded-full text-gray-500 hover:text-gray-700"
                onClick={handleRecipeDownload}
                aria-label="Download"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                ⏬
              </motion.button>
            </div>

            <motion.button
              className="px-3 py-1.5 bg-[#eaf5e4] text-[#1d9c3f] rounded-md text-sm font-medium hover:bg-[#d5f9c5] transition-all duration-300"
              onClick={handleRecipeClick}
              aria-expanded={isRecipeExpanded}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRecipeExpanded ? "Hide Recipe" : "View Recipe"}
            </motion.button>
          </div>

          <AnimatePresence>
            {isRecipeExpanded && (
              <motion.div
                className="mt-4 pt-4 border-t border-gray-100"
                variants={expandVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                {/* Ingredients */}
                <div className="mb-4">
                  <h4 className="text-base font-semibold text-gray-800 mb-2">
                    Ingredients:
                  </h4>
                  <ul className="space-y-1">
                    {parsedIngredients.map((ingredient, index) => (
                      <motion.li
                        key={`ingredient-${recipeId}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="text-sm text-gray-600 pl-2 border-l-2 border-green-300"
                      >
                        {ingredient}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-2">
                    Instructions:
                  </h4>
                  <ol className="space-y-2">
                    {parsedInstructions.map((instruction, index) => (
                      <motion.li
                        key={`instruction-${recipeId}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="text-sm text-gray-600 pl-6 relative"
                      >
                        <span className="absolute left-0 top-0 flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          {index + 1}
                        </span>
                        {instruction}
                      </motion.li>
                    ))}
                  </ol>
                </div>

                {/* Full Recipe Link */}
                <motion.div
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to={`/recipes/${userId}/${recipeId}`}
                    className="text-[#1d9c3f] hover:text-[#187832] font-medium text-sm"
                  >
                    View full recipe page →
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <EditPost
        isOpen={isEditPostOpen}
        onClose={() => setIsEditPostOpen(false)}
        onSubmit={handleEditPost}
        postId={recipeId}
        userId={userId}
        title={title}
        description={description}
        cookingTime={cookingTime}
        difficulty={difficulty}
        servings={servings}
        ingredients={parsedIngredients}
        instructions={parsedInstructions}
        imageUrl={displayImageUrl}
        imageList={imageList}
      />
    </>
  );
};

FoodSocialCard.defaultProps = {
  likes: 0,
  isLiked: false,
  ingredients: [],
  instructions: [],
};

export default FoodSocialCard;
