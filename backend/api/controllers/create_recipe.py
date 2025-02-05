from flask import request, jsonify
from datetime import datetime
from werkzeug.security import generate_password_hash  # Not needed for recipes, but kept for consistency
from ..services.database_interface import  add_recipe_card_to_firebase  # Replace with your actual Firestore functions
from ..models.complete_recipe import handle_image_upload

def create_recipe():
    """
    Handle recipe creation with image upload.
    """
    # Check if the request contains a file
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    image_file = request.files['image']

    # Handle image upload
    image_upload_result = handle_image_upload(image_file)

    # Check if the image upload was successful
    if isinstance(image_upload_result, tuple):  # If it's an error response
        return image_upload_result

    # If successful, get the image URL
    image_url = image_upload_result

    # Get JSON data for the recipe
    recipe_data = request.form.to_dict()  # Use request.form for other fields
    if not recipe_data:
        return jsonify({"error": "No recipe data provided."}), 400

    # Extract fields from the request
    recipe_name = recipe_data.get("recipe_name")
    tags = recipe_data.get("tags", [])  # Default to empty list if not provided
    rating = recipe_data.get("rating", 0)  # Default to 0 if not provided
    author_id = recipe_data.get("author_id")
    card_id = recipe_data.get("card_id")

    # Basic field checks
    if not recipe_name or not author_id or not card_id:
        return jsonify({"error": "Missing required fields (recipe_name, author_id, card_id)."}), 400

    # # Optional: Check if recipe already exists (e.g., by recipe_name or card_id)
    # existing_recipe = get_recipe_by_name(recipe_name)  # Replace with your Firestore query function
    # if existing_recipe:
    #     return jsonify({"error": "Recipe with this name already exists."}), 409

    # Get current timestamps
    current_time = datetime.utcnow()

    # Create a CompleteRecipe object
    new_recipe = CompleteRecipe(
        recipe_name=recipe_name,
        tags=tags,
        image=image_url,  # Use the image URL from handle_image_upload
        rating=rating,
        author_id=author_id,
        card_id=card_id,
        created_at=current_time,
        updated_at=current_time
    )

    # Convert the recipe object to a dictionary for Firestore
    recipe_dict = {
        "recipe_name": new_recipe.recipe_name,
        "tags": new_recipe.tags,
        "image": new_recipe.image,  # Store the Firebase Storage URL
        "rating": new_recipe.rating,
        "author_id": new_recipe.author_id,
        "card_id": new_recipe.card_id,
        "created_at": new_recipe.created_at,
        "updated_at": new_recipe.updated_at
    }

    # Add the recipe to Firestore
    result = add_recipe_to_firebase(recipe_dict)  # Replace with your Firestore function
    return jsonify({"message": "Recipe created successfully", "recipe": result}), 201