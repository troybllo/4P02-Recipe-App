from flask import request, jsonify
from datetime import datetime
from ..services.recipe_database import (
    create_recipe_in_firebase, get_recipe_from_firebase,
    update_recipe_in_firebase, delete_recipe_from_firebase,
    upload_images_to_cloudinary, delete_image_from_cloudinary,
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

def get_recipe_global(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        docs = db.collection_group("created_recipes").where("postId", "==", post_id).stream()
        for doc in docs:
            recipe_data = doc.to_dict()
            recipe_data["postId"] = doc.id

            # Infer userId from path
            path_parts = doc.reference.path.split("/")
            if "users" in path_parts:
                user_id_index = path_parts.index("users") + 1
                recipe_data["userId"] = path_parts[user_id_index]

                # Fetch username from parent doc
                user_doc = db.collection("users").document(recipe_data["userId"]).get()
                if user_doc.exists:
                    user_data = user_doc.to_dict()
                    recipe_data["author"] = user_data.get("username", "Unknown")

            return jsonify(recipe_data), 200

        return jsonify({"error": "Recipe not found"}), 404

    except Exception as e:
        print(f"[get_recipe_global ERROR]: {e}")
        return jsonify({"error": str(e)}), 500

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

def list_all_recipes():
    from firebase_admin import firestore
    db = firestore.client()

    try:
        include_user_id = request.args.get("userId")
        exclude_user_id = request.args.get("excludeUserId")
        recipes = []

        docs = db.collection_group("created_recipes").stream()
        for doc in docs:
            path_parts = doc.reference.path.split("/")
            recipe_owner_id = path_parts[path_parts.index("users") + 1]

            if include_user_id and recipe_owner_id != include_user_id:
                continue
            if exclude_user_id and recipe_owner_id == exclude_user_id:
                continue

            data = doc.to_dict()
            data["postId"] = doc.id
            data["userId"] = recipe_owner_id

            # ✅ Fetch username from parent user doc
            user_doc = db.collection("users").document(recipe_owner_id).get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                data["author"] = user_data.get("username", "Unknown")
            else:
                data["author"] = "Unknown"

            recipes.append(data)

        return jsonify({"recipes": recipes}), 200

    except Exception as e:
        print(f"[list_all_recipes ERROR]: {e}")
        return jsonify({"error": str(e)}), 500

