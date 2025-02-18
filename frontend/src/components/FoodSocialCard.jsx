import React, { useState } from "react";
import styles from "../styles/FoodSocialCard.module.css"; // Import styles

const FoodSocialCard = ({
  postId, 
  title,
  author,
  authorId,
  datePosted,
  description,
  cookingTime,
  difficulty,
  servings,
  imageUrl,
  ingredients,
  instructions,
  likes,
  isLiked,
}) => {
  const [isTitleExpanded, setIsTitleExpanded] = useState(false); // Title expand state
  const [isRecipeExpanded, setIsRecipeExpanded] = useState(false); // Recipe expand state
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = new Date(datePosted).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      setLiked(!liked);
      setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error("Error toggling like:", error);
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
    }
  };

  // Handle title expansion
  const handleTitleClick = () => {
    setIsTitleExpanded(!isTitleExpanded); // Toggle title expansion
  };

  // Handle recipe content expansion
  const handleRecipeClick = () => {
    setIsRecipeExpanded(!isRecipeExpanded); // Toggle recipe content visibility
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>{author[0]}</div>
        <div className={styles.headerContent}>
          <h3
            className={`${styles.title} ${isTitleExpanded ? styles.expanded : ""}`}
            onClick={handleTitleClick}
          >
            {isTitleExpanded ? title : `${title.slice(0, 40)}...`} {/* Truncate or show full title */}
          </h3>
          <p className={styles.authorInfo}>
            by {author} • {formattedDate}
          </p>
        </div>
        <button
          className={styles.iconButton}
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
          loading="lazy"
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
            onClick={handleRecipeClick} // Toggle recipe visibility separately
            aria-expanded={isRecipeExpanded}
          >
            {isRecipeExpanded ? "Hide Recipe ▼" : "Show Recipe ▶"}
          </button>
        </div>

        {isRecipeExpanded && (
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

FoodSocialCard.defaultProps = {
  likes: 0,
  isLiked: false,
  ingredients: [],
  instructions: [],
};

export default FoodSocialCard;
