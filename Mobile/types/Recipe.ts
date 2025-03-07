// src/types/Recipe.ts

export interface Recipe {
  postId: string;
  title: string;
  author: string;
  authorId: string;
  datePosted: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  servings: number; // Changed from string to number to match your data
  imageUrl: any;
  ingredients: string[];
  instructions: string[];
  likes: number;
  isLiked: boolean;
}

// If you need FoodSocialCardProps separately
export interface FoodSocialCardProps extends Recipe {}
