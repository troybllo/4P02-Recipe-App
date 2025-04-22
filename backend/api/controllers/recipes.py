# controllers/recipes.py

from flask import request, jsonify
from datetime import datetime
from firebase_admin import firestore
import json
import cloudinary.uploader

from ..services.recipe_database import (
    create_recipe_in_firebase,
    get_recipe_from_firebase,
    update_recipe_in_firebase,
    delete_recipe_from_firebase,
    upload_images_to_cloudinary,
    delete_image_from_cloudinary,
    get_most_liked_recipes,
    get_most_recent_recipes,
    get_easy_recipes,
    get_quick_picks,
    like_recipe,
    unlike_recipe,
)


def create_recipe():
    data = request.form.to_dict() or request.get_json() or {}
    user_id = data.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    image_files = request.files.getlist("images")

    recipe_data = {
        "title":        data.get("title"),
        "description":  data.get("description"),
        "cookingTime":  data.get("cookingTime"),
        "difficulty":   data.get("difficulty"),
        "servings":     data.get("servings"),
        "datePosted":   datetime.utcnow().isoformat(),
        "likes":        0,
        "likedBy":      [],
        "ingredients":  data.get("ingredients"),
        "instructions": data.get("instructions"),
    }

    # Upload images
    if image_files:
        recipe_data["imageList"] = upload_images_to_cloudinary(image_files)
    else:
        recipe_data["imageList"] = []

    post_id = create_recipe_in_firebase(user_id, recipe_data)
    return jsonify({"message": "Recipe created", "postId": post_id}), 201


def get_recipe(post_id):
    """
    GET /api/recipes/<post_id>
    Try per-user lookup, else fall back to collection_group.
    """
    user_id = request.args.get("userId")
    if user_id:
        doc = get_recipe_from_firebase(user_id, post_id)
        if doc:
            doc["userId"] = user_id
            return jsonify(doc), 200

    return get_recipe_global(post_id)

def get_recipe_global(post_id):
    """
    Naive “scan all users” fallback—no collectionGroup index needed.
    """
    from firebase_admin import firestore
    db = firestore.client()

    try:
        # 1) fetch every user ID
        users = db.collection("users").stream()

        # 2) for each user, check their created_recipes subcollection
        for u in users:
            uid = u.id
            snap = (
                db.collection("users")
                  .document(uid)
                  .collection("created_recipes")
                  .document(post_id)
                  .get()
            )
            if snap.exists:
                data = snap.to_dict()
                data["postId"] = snap.id
                data["userId"] = uid
                # optional: pull username from the parent user doc
                data["author"] = u.to_dict().get("username", "Unknown")
                return jsonify(data), 200

        return jsonify({"error": "Recipe not found"}), 404

    except Exception as e:
        print(f"[get_recipe_global ERROR]: {e}")
        return jsonify({"error": str(e)}), 500



def update_recipe(post_id):
    data = request.form.to_dict() or request.get_json() or {}
    user_id = data.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    image_files = request.files.getlist("images") if request.files else []

    existing = get_recipe_from_firebase(user_id, post_id)
    if not existing:
        return jsonify({"error": "Recipe not found"}), 404

    updated_data = {}
    for field in ("title", "description", "cookingTime", "difficulty", "servings", "ingredients", "instructions"):
        if field in data:
            updated_data[field] = data[field]

    # Remove images
    remove_ids = [rid.strip() for rid in (data.get("removePublicIds") or "").split(",") if rid.strip()]
    kept = []
    for img in existing.get("imageList", []):
        if img.get("publicId") in remove_ids:
            delete_image_from_cloudinary(img["publicId"])
        else:
            kept.append(img)

    # Add new
    new_imgs = upload_images_to_cloudinary(image_files) if image_files else []
    updated_data["imageList"] = kept + new_imgs

    result = update_recipe_in_firebase(user_id, post_id, updated_data)
    if not result:
        return jsonify({"error": "Update failed"}), 404

    return jsonify({"message": "Recipe updated", "recipe": result}), 200


def delete_recipe(post_id):
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    deleted = delete_recipe_from_firebase(user_id, post_id)
    if not deleted:
        return jsonify({"error": "Recipe not found"}), 404

    return jsonify({"message": "Recipe deleted"}), 200


def list_most_liked_recipes():
    return jsonify({"recipes": get_most_liked_recipes()}), 200


def get_recent_recipes():
    limit = int(request.args.get("limit", 100))
    return jsonify({"recipes": get_most_recent_recipes(limit=limit)}), 200


def list_easy_recipes():
    return jsonify({"recipes": get_easy_recipes()}), 200


def list_quick_picks():
    return jsonify({"recipes": get_quick_picks()}), 200


def like_recipe_controller():
    body = request.get_json(silent=True) or {}
    owner, post, liker = body.get("ownerId"), body.get("postId"), body.get("likerId")
    if not all([owner, post, liker]):
        return jsonify({"error": "Missing ownerId, postId, or likerId"}), 400

    updated = like_recipe(owner, post, liker)
    if not updated:
        return jsonify({"error": "Recipe not found"}), 404

    return jsonify({"message": "liked", "recipe": updated}), 200


def unlike_recipe_controller():
    body = request.get_json(silent=True) or {}
    owner, post, liker = body.get("ownerId"), body.get("postId"), body.get("likerId")
    if not all([owner, post, liker]):
        return jsonify({"error": "Missing ownerId, postId, or likerId"}), 400

    updated = unlike_recipe(owner, post, liker)
    if not updated:
        return jsonify({"error": "Recipe not found"}), 404

    return jsonify({"message": "unliked", "recipe": updated}), 200
    from ..services.recipe_database import get_recipe_from_firebase
