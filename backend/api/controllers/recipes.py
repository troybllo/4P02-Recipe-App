from flask import request, jsonify
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

        recipe_data["ingredients"] = json.loads(data.get("ingredients", "[]"))
        recipe_data["instructions"] = json.loads(data.get("instructions", "[]"))

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
            data["postId"] = doc.id
            return jsonify(data), 200

        return jsonify({"error": "Recipe not found"}), 404

    except Exception as e:
        print(f"[get_recipe_global ERROR]: {e}")
        return jsonify({"error": str(e)}), 500


def get_recipe(post_id):
    return jsonify({"message": "Use get_recipe_global instead."}), 501


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

