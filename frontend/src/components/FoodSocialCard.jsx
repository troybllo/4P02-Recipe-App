// src/components/FoodSocialCard.jsx
import React, { useState } from "react";
import styles from "../styles/FoodSocialCard.module.css";

const FoodSocialCard = ({
  postId, // Unique identifier for the post
  title,
  author,
  authorId, // For user profile linking
  datePosted, // ISO date string from backend
  description,
  cookingTime,
  difficulty,
  servings,
  imageUrl, // URL from backend storage
  ingredients, // Array of ingredients
  instructions, // Array of instructions
  likes, // Initial likes count
  isLiked, // Whether current user has liked
}) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);

  // Format the date from ISO string
  const formattedDate = new Date(datePosted).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle like toggle with backend integration
  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Backend call will go here
      // const response = await fetch(`/api/posts/${postId}/like`, {
      //   method: liked ? 'DELETE' : 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Authorization header will go here
      //   }
      // });

      // if (response.ok) {
      setLiked(!liked);
      setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
      // }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Add error handling/notification here
    } finally {
      setIsLoading(false);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: description,
        url: window.location.href, // Will need to be updated with actual post URL
      });
    } catch (error) {
      console.log("Error sharing:", error);
      // Fallback to copying link to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Add notification of "Link copied" here
    }
  };

  // Handle report/menu functionality
  const handleMenuClick = () => {
    // Implement report/menu functionality
    console.log("Menu clicked for post:", postId);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>{author[0]}</div>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.authorInfo}>
            by {author} • {formattedDate}
          </p>
        </div>
        <button
          className={styles.iconButton}
          onClick={handleMenuClick}
          aria-label="More options"
        >
          •••
        </button>
      </div>

      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={title}
          className={styles.image}
          loading="lazy" // For better performance
        />
      </div>

      <div className={styles.content}>
        <div className={styles.metadata}>
          <span title="Cooking Time">⏱️ {cookingTime}</span>
          <span title="Difficulty">📊 {difficulty}</span>
          <span title="Servings">👥 Serves {servings}</span>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          <div className={styles.actionButtons}>
            <button
              className={`${styles.iconButton} ${liked ? styles.liked : ""}`}
              onClick={handleLike}
              disabled={isLoading}
              aria-label={liked ? "Unlike" : "Like"}
            >
              {liked ? "❤️" : "🤍"}
              <span className={styles.likeCount}>{likeCount}</span>
            </button>
            <button
              className={styles.iconButton}
              onClick={handleShare}
              aria-label="Share"
            >
              📤
            </button>
          </div>
          <button
            className={styles.expandButton}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? "Hide Recipe ▼" : "Show Recipe ▶"}
          </button>
        </div>

        {expanded && (
          <div className={styles.expandedContent}>
            <h4 className={styles.sectionTitle}>Ingredients:</h4>
            <ul className={styles.ingredientsList}>
              {ingredients?.map((ingredient, index) => (
                <li key={`ingredient-${postId}-${index}`}>{ingredient}</li>
              ))}
            </ul>

            <h4 className={styles.sectionTitle}>Instructions:</h4>
            <ol className={styles.instructionsList}>
              {instructions?.map((instruction, index) => (
                <li key={`instruction-${postId}-${index}`}>{instruction}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes for better development experience
FoodSocialCard.defaultProps = {
  likes: 0,
  isLiked: false,
  ingredients: [],
  instructions: [],
};

export default FoodSocialCard;
