from flask import request, jsonify
from datetime import datetime
from ..services.recipe_database import (
    create_recipe_in_firebase, get_recipe_from_firebase,
    update_recipe_in_firebase, delete_recipe_from_firebase,
    upload_images_to_cloudinary, delete_image_from_cloudinary,
    get_most_liked_recipes,
)

def create_recipe():
    """
    Expects in JSON or form-data:
      - userId (the unique ID returned at login)
      - other recipe fields
      - optional images in request.files.getlist('images')
    """
    data = request.form.to_dict() or request.get_json() or {}
    user_id = data.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    image_files = request.files.getlist('images')  # if multipart form-data in postman

    recipe_data = {
        "title": data.get("title"),
        "description": data.get("description"),
        "cookingTime": data.get("cookingTime"),
        "difficulty": data.get("difficulty"),
        "servings": data.get("servings"),
        "datePosted": datetime.utcnow().isoformat(),
        "likes": 0,
        "isLiked": False,
        "ingredients": data.get("ingredients"),
        "instructions": data.get("instructions")
    }

    # Upload images
    if image_files:
        image_entries = upload_images_to_cloudinary(image_files)
        recipe_data["imageList"] = image_entries
    else:
        recipe_data["imageList"] = []

    post_id = create_recipe_in_firebase(user_id, recipe_data)
    return jsonify({"message": "Recipe created", "postId": post_id}), 201

def get_recipe(post_id):
    # Use only query parameters for GET
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400
    recipe_doc = get_recipe_from_firebase(user_id, post_id)
    if not recipe_doc:
        return jsonify({"error": "Recipe not found"}), 404
    return jsonify(recipe_doc), 200

def update_recipe(post_id):
    data = request.form.to_dict() or request.get_json() or {}
    user_id = data.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    image_files = request.files.getlist('images') if request.files else []

    existing_doc = get_recipe_from_firebase(user_id, post_id)
    if not existing_doc:
        return jsonify({"error": "Recipe not found"}), 404

    updated_data = {}
    fields = ["title", "description", "cookingTime", "difficulty",
              "servings", "ingredients", "instructions"]
    for f in fields:
        if f in data:
            updated_data[f] = data[f]

    # Remove images
    remove_ids_str = data.get("removePublicIds")
    remove_ids = []
    if remove_ids_str:
        remove_ids = [rid.strip() for rid in remove_ids_str.split(",") if rid.strip()]

    current_images = existing_doc.get("imageList", [])
    remaining_images = []
    for img_obj in current_images:
        if img_obj["publicId"] in remove_ids:
            delete_image_from_cloudinary(img_obj["publicId"])
        else:
            remaining_images.append(img_obj)

    # Add new images
    new_images = []
    if image_files:
        new_images = upload_images_to_cloudinary(image_files)

    updated_data["imageList"] = remaining_images + new_images

    updated_recipe = update_recipe_in_firebase(user_id, post_id, updated_data)
    if not updated_recipe:
        return jsonify({"error": "Update failed"}), 404

    return jsonify({"message": "Recipe updated", "recipe": updated_recipe}), 200

def delete_recipe(post_id):
    # Use query parameter for DELETE to avoid unsupported media type issues
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400
    deleted = delete_recipe_from_firebase(user_id, post_id)
    if not deleted:
        return jsonify({"error": "Recipe not found"}), 404
    return jsonify({"message": "Recipe deleted"}), 200

def list_most_liked_recipes():
    recipes = get_most_liked_recipes()
    return jsonify({"recipes": recipes}), 200