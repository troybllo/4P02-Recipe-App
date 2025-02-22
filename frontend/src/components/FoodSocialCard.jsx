import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import styles from "../styles/FoodSocialCard.module.css"; // Import styles
import EditPost from "../components/EditPost";

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
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isRecipeExpanded, setIsRecipeExpanded] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = new Date(datePosted).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [isEditPostOpen, setIsEditPostOpen] = useState(false);

  const handleEditPost = () => {
    setIsEditPostOpen(false);
  }

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

  const handleTitleClick = () => {
    setIsTitleExpanded(!isTitleExpanded);
  };

  const handleRecipeClick = () => {
    setIsRecipeExpanded(!isRecipeExpanded);
  };

  const handleRecipeDownload = () => {
    // Downloads a PDF of the recipe with all the details
  };

  // Made-up variables for logged in state and current user ID
  const isLoggedIn = true;
  const currentUserId = "user_789";
  const isOwner = isLoggedIn && currentUserId === authorId;

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar} style={{ flexShrink: 0 }}>
            {author[0]}
          </div>
          <div className={styles.headerContent} style={{ maxWidth: "200px" }}>
            <h3
              className={`${styles.title} ${isTitleExpanded ? styles.expanded : ""}`}
              onClick={handleTitleClick}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {isTitleExpanded ? title : `${title.slice(0, 30)}...`}
            </h3>
            <p
              className={styles.authorInfo}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              by {author} {formattedDate}
            </p>
          </div>
          {isOwner && (
            <button className={styles.iconButton} aria-label="Edit Post" onClick={() => setIsEditPostOpen(true)}>
              •••
            </button>
          )}
        </div>

        <div className={styles.imageContainer}>
          {/* Only the image is wrapped with a Link */}
          <Link to={`/recipe/${postId}`}>
            <img src={imageUrl} alt={title} className={styles.image} loading="lazy" />
          </Link>
        </div>

        <div className={styles.content}>
          <div className={styles.metadata}>
            <span title="Cooking Time">⏱️ {cookingTime}</span>
            <span title="Difficulty">📊 {difficulty}</span>
            <span title="Servings">👥 {servings}</span>
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
              <button className={styles.iconButton} onClick={handleShare} aria-label="Share">
                📤
              </button>
              <button className={styles.downloadButton} onClick={handleRecipeDownload} aria-label="Download">
                ⏬
              </button>
            </div>

            <button className={styles.expandButton} onClick={handleRecipeClick} aria-expanded={isRecipeExpanded}>
              {isRecipeExpanded ? "Shrink" : "Expand"}
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
      <EditPost
        isOpen={isEditPostOpen}
        onClose={() => setIsEditPostOpen(false)}
        onSubmit={handleEditPost}
        postId={postId}
        title={title}
        description={description}
        cookingTime={cookingTime}
        difficulty={difficulty}
        servings={servings}
        ingredients={ingredients}
        instructions={instructions}
        imageUrl={imageUrl}
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
