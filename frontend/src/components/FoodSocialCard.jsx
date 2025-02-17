import React, { useState } from "react";
import styles from "../styles/FoodSocialCard.module.css";

// Import images
// import meal1 from "../assets/meal1.jpeg";
import meal2 from "../assets/meal2.jpg";

const FoodSocialCard = ({
  title = "Shrimp and Chorizo Paella",
  author = "RecipeMaster",
  date = "February 5, 2025",
  description = "This impressive paella is a perfect party dish and a fun meal to cook together with your guests.",
  cookingTime = "45 mins",
  difficulty = "Medium",
  servings = "4",
  image = meal2, // Default image, can be overridden via props
}) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>{author[0]}</div>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.authorInfo}>
            by {author} • {date}
          </p>
        </div>
        <button className={styles.iconButton}>•••</button>
      </div>

      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
      </div>

      {/* Rest of the component remains the same */}
      <div className={styles.content}>
        <div className={styles.metadata}>
          <span>⏱️ {cookingTime}</span>
          <span>📊 {difficulty}</span>
          <span>👥 Serves {servings}</span>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          <div className={styles.actionButtons}>
            <button
              className={`${styles.iconButton} ${liked ? styles.liked : ""}`}
              onClick={() => setLiked(!liked)}
            >
              {liked ? "❤️" : "🤍"}
            </button>
            <button className={styles.iconButton}>📤</button>
          </div>
          <button
            className={styles.expandButton}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide Recipe ▼" : "Show Recipe ▶"}
          </button>
        </div>

        {expanded && (
          <div className={styles.expandedContent}>
            <h4 className={styles.sectionTitle}>Ingredients:</h4>
            <ul className={styles.ingredientsList}>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>

            <h4 className={styles.sectionTitle}>Instructions:</h4>
            <ol className={styles.instructionsList}>
              <li>Lorem ipsum odor amet, consectetuer adipiscing elit. 1</li>
              <li>Lorem ipsum odor amet, consectetuer adipiscing elit. 2</li>
              <li>Lorem ipsum odor amet, consectetuer adipiscing elit. 3</li>
              <li>Lorem ipsum odor amet, consectetuer adipiscing elit. 4</li>
              <li>Lorem ipsum odor amet, consectetuer adipiscing elit. 5</li>
              <li>Lorem ipsum odor amet, consectetuer adipiscing elit. 6</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodSocialCard;
