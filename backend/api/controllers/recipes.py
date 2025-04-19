from flask import request, jsonify
from datetime import datetime
import cloudinary.uploader
import json

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
    from firebase_admin import firestore
    import cloudinary.uploader
    db = firestore.client()

    try:
        if request.content_type.startswith("multipart/form-data"):
            data = request.form.to_dict()
            user_id = data.get("userId")

            ingredients = json.loads(data.get("ingredients", "[]"))
            instructions = json.loads(data.get("instructions", "[]"))

            # Upload new image to Cloudinary if provided
            image_file = request.files.get("image")
            image_list = []

            if image_file:
                upload_result = cloudinary.uploader.upload(image_file)
                image_list.append({ "url": upload_result["secure_url"] })

            # Update Firestore
            doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
            doc_ref.update({
                "title": data.get("title"),
                "description": data.get("description"),
                "cookingTime": data.get("cookingTime"),
                "difficulty": data.get("difficulty"),
                "servings": int(data.get("servings", 0)),
                "ingredients": ingredients,
                "instructions": instructions,
                "imageList": image_list if image_list else firestore.DELETE_FIELD,  # Replace if image uploaded
            })

            return jsonify({"message": "Recipe updated", "imageList": image_list}), 200

        else:
            return jsonify({"error": "Unsupported Content-Type"}), 400

    except Exception as e:
        print(f"[update_recipe ERROR]: {e}")
        return jsonify({"error": str(e)}), 500


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

