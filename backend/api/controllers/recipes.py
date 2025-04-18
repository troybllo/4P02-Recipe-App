import uuid
import datetime
import json
from flask import request, jsonify
from firebase_admin import firestore

# === Create a new recipe under user's subcollection ===
def create_recipe():
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

        # Parse ingredients and instructions
        recipe_data["ingredients"] = json.loads(data.get("ingredients", "[]"))
        recipe_data["instructions"] = json.loads(data.get("instructions", "[]"))

        # Parse imageList
        image_list = data.get("imageList")
        if image_list:
            try:
                recipe_data["imageList"] = json.loads(image_list)
            except:
                recipe_data["imageList"] = []
        else:
            recipe_data["imageList"] = []

        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.set(recipe_data)

        return jsonify({"message": "Recipe created", "postId": post_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === Get a recipe globally from all subcollections ===
def get_recipe_global(post_id):
    db = firestore.client()
    try:
        query = db.collection_group("created_recipes").where("postId", "==", post_id)
        docs = query.stream()

        for doc in docs:
            data = doc.to_dict()
            data["postId"] = doc.id
            return jsonify(data), 200

        return jsonify({"error": "Recipe not found"}), 404
    except Exception as e:
        print(f"[get_recipe_global ERROR]: {e}")
        return jsonify({"error": str(e)}), 500


# === Update a recipe ===
def update_recipe(post_id):
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
    db = firestore.client()
    try:
        user_id = request.args.get("userId")
        doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
        doc_ref.delete()
        return jsonify({"message": "Recipe deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === List all recipes (global) ===
def list_all_recipes():
    db = firestore.client()
    try:
        recipes = []
        docs = db.collection_group("created_recipes").stream()
        for doc in docs:
            data = doc.to_dict()
            data["postId"] = doc.id
            recipes.append(data)
        return recipes
    except Exception as e:
        print(f"[list_all_recipes ERROR]: {e}")
        return []
