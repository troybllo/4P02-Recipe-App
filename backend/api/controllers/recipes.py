from flask import request, jsonify
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
from datetime import datetime
from firebase_admin import firestore
from ..services.recipe_database import (
    create_recipe_in_firebase,
    get_recipe_from_firebase,
    update_recipe_in_firebase,
    delete_recipe_from_firebase,
    upload_images_to_cloudinary,
    delete_image_from_cloudinary,
    get_all_recipes_from_firebase,
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

    # if multipart form-data in postman
    image_files = request.files.getlist("images")

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
        "instructions": data.get("instructions"),
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


def get_all_recipes():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    recipes = get_all_recipes_from_firebase(user_id)
    return jsonify(recipes), 200


def update_recipe(post_id):
    data = request.form.to_dict() or request.get_json() or {}
    user_id = data.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    image_files = request.files.getlist("images") if request.files else []

    existing_doc = get_recipe_from_firebase(user_id, post_id)
    if not existing_doc:
        return jsonify({"error": "Recipe not found"}), 404

    updated_data = {}
    fields = [
        "title",
        "description",
        "cookingTime",
        "difficulty",
        "servings",
        "ingredients",
        "instructions",
    ]
    for f in fields:
        if f in data:
            updated_data[f] = data[f]

    # Remove images
    remove_ids_str = data.get("removePublicIds")
    remove_ids = []
    if remove_ids_str:
        remove_ids = [rid.strip()
                      for rid in remove_ids_str.split(",") if rid.strip()]

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
    db = firestore.client()
    recipes = []
    users_ref = db.collection("users")
    for user in users_ref.stream():
        user_id = user.id
        subcol = db.collection("users").document(
            user_id).collection("created_recipes")
        for recipe_doc in subcol.stream():
            data = recipe_doc.to_dict()
            data["postId"] = recipe_doc.id
            recipes.append(data)

    return recipes

=======
import uuid
import datetime
import json

# === Create a new recipe under user's subcollection ===
def create_recipe():
    from firebase_admin import firestore
    db = firestore.client()

    try:
        data = request.form.to_dict()
        user_id = data.get("userId")
        post_id = str(uuid.uuid4())

        recipe_data = {
            "postId": post_id,
            "title": data.get("title"),
            "description": data.get("description"),
            "cookingTime": data.get("cookingTime"),
            "difficulty": data.get("difficulty"),
            "servings": int(data.get("servings", 0)),
            "likes": 0,
            "isLiked": False,
            "datePosted": datetime.datetime.now().isoformat(),
        }

        # Parse ingredients and instructions (expecting JSON strings)
        recipe_data["ingredients"] = json.loads(data.get("ingredients", "[]"))
        recipe_data["instructions"] = json.loads(data.get("instructions", "[]"))

        # Parse image list if provided
        image_list = data.get("imageList")
        if image_list:
            try:
                recipe_data["imageList"] = json.loads(image_list)
            except:
                recipe_data["imageList"] = []

        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.set(recipe_data)

        return jsonify({"message": "Recipe created", "postId": post_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === Get a recipe globally from all subcollections ===
def get_recipe_global(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        query = db.collection_group("created_recipes").where("postId", "==", post_id)
        docs = query.stream()

        for doc in docs:
            data = doc.to_dict()
            data["postId"] = doc.id  # Optional but helpful
            return jsonify(data), 200

        return jsonify({"error": "Recipe not found"}), 404

    except Exception as e:
        print(f"[get_recipe_global ERROR]: {e}")
        return jsonify({"error": str(e)}), 500



# === Placeholder fallback ===
def get_recipe(post_id):
    return jsonify({"message": "Use get_recipe_global instead."}), 501


# === Update a recipe ===
def update_recipe(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        data = request.json
        user_id = data.get("userId")
        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.update(data)
        return jsonify({"message": "Recipe updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === Delete a recipe ===
def delete_recipe(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        user_id = request.args.get("userId")
        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.delete()
        return jsonify({"message": "Recipe deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === List all recipes ===
def list_all_recipes():
    from firebase_admin import firestore
    db = firestore.client()

    try:
        recipes = []
        docs = db.collection_group("created_recipes").stream()
        for doc in docs:
            data = doc.to_dict()
            data["postId"] = doc.id
            recipes.append(data)
=======
import uuid
import datetime
import json

# === Create a new recipe under user's subcollection ===
def create_recipe():
    from firebase_admin import firestore
    db = firestore.client()

    try:
        data = request.form.to_dict()
        user_id = data.get("userId")
        post_id = str(uuid.uuid4())

        recipe_data = {
            "postId": post_id,
            "title": data.get("title"),
            "description": data.get("description"),
            "cookingTime": data.get("cookingTime"),
            "difficulty": data.get("difficulty"),
            "servings": int(data.get("servings", 0)),
            "likes": 0,
            "isLiked": False,
            "datePosted": datetime.datetime.now().isoformat(),
        }

        # Parse ingredients and instructions (expecting JSON strings)
        recipe_data["ingredients"] = json.loads(data.get("ingredients", "[]"))
        recipe_data["instructions"] = json.loads(data.get("instructions", "[]"))

        # Parse image list if provided
        image_list = data.get("imageList")
        if image_list:
            try:
                recipe_data["imageList"] = json.loads(image_list)
            except:
                recipe_data["imageList"] = []

        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.set(recipe_data)

        return jsonify({"message": "Recipe created", "postId": post_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === Get a recipe globally from all subcollections ===
def get_recipe_global(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        query = db.collection_group("created_recipes").where("postId", "==", post_id)
        docs = query.stream()

        for doc in docs:
            data = doc.to_dict()
            data["postId"] = doc.id  # Optional but helpful
            return jsonify(data), 200

        return jsonify({"error": "Recipe not found"}), 404

    except Exception as e:
        print(f"[get_recipe_global ERROR]: {e}")
        return jsonify({"error": str(e)}), 500



# === Placeholder fallback ===
def get_recipe(post_id):
    return jsonify({"message": "Use get_recipe_global instead."}), 501


# === Update a recipe ===
def update_recipe(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        data = request.json
        user_id = data.get("userId")
        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.update(data)
        return jsonify({"message": "Recipe updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === Delete a recipe ===
def delete_recipe(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        user_id = request.args.get("userId")
        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.delete()
        return jsonify({"message": "Recipe deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === List all recipes ===
def list_all_recipes():
    from firebase_admin import firestore
    db = firestore.client()

    try:
        recipes = []
        docs = db.collection_group("created_recipes").stream()
        for doc in docs:
            data = doc.to_dict()
            data["postId"] = doc.id
            recipes.append(data)
>>>>>>> Stashed changes
=======
import uuid
import datetime
import json

# === Create a new recipe under user's subcollection ===
def create_recipe():
    from firebase_admin import firestore
    db = firestore.client()

    try:
        data = request.form.to_dict()
        user_id = data.get("userId")
        post_id = str(uuid.uuid4())

        recipe_data = {
            "postId": post_id,
            "title": data.get("title"),
            "description": data.get("description"),
            "cookingTime": data.get("cookingTime"),
            "difficulty": data.get("difficulty"),
            "servings": int(data.get("servings", 0)),
            "likes": 0,
            "isLiked": False,
            "datePosted": datetime.datetime.now().isoformat(),
        }

        # Parse ingredients and instructions (expecting JSON strings)
        recipe_data["ingredients"] = json.loads(data.get("ingredients", "[]"))
        recipe_data["instructions"] = json.loads(data.get("instructions", "[]"))

        # Parse image list if provided
        image_list = data.get("imageList")
        if image_list:
            try:
                recipe_data["imageList"] = json.loads(image_list)
            except:
                recipe_data["imageList"] = []

        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.set(recipe_data)

        return jsonify({"message": "Recipe created", "postId": post_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === Get a recipe globally from all subcollections ===
def get_recipe_global(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        query = db.collection_group("created_recipes").where("postId", "==", post_id)
        docs = query.stream()

        for doc in docs:
            data = doc.to_dict()
            data["postId"] = doc.id  # Optional but helpful
            return jsonify(data), 200

        return jsonify({"error": "Recipe not found"}), 404

    except Exception as e:
        print(f"[get_recipe_global ERROR]: {e}")
        return jsonify({"error": str(e)}), 500



# === Placeholder fallback ===
def get_recipe(post_id):
    return jsonify({"message": "Use get_recipe_global instead."}), 501


# === Update a recipe ===
def update_recipe(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        data = request.json
        user_id = data.get("userId")
        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.update(data)
        return jsonify({"message": "Recipe updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === Delete a recipe ===
def delete_recipe(post_id):
    from firebase_admin import firestore
    db = firestore.client()

    try:
        user_id = request.args.get("userId")
        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.delete()
        return jsonify({"message": "Recipe deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === List all recipes ===
def list_all_recipes():
    from firebase_admin import firestore
    db = firestore.client()

    try:
        recipes = []
        docs = db.collection_group("created_recipes").stream()
        for doc in docs:
            data = doc.to_dict()
            data["postId"] = doc.id
            recipes.append(data)
>>>>>>> Stashed changes
        return recipes
    except Exception as e:
        print(f"[list_all_recipes ERROR]: {e}")
        return []
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
