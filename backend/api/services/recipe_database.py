import uuid
from typing import List, Dict
from firebase_admin import firestore
import cloudinary
import cloudinary.uploader



def _user_recipes_ref(uid: str):
    """Return users/{uid}/created_recipes Collection Reference."""
    db = firestore.client()
    return db.collection("users").document(uid).collection("created_recipes")


def create_recipe_in_firebase(user_id: str, recipe_data: Dict) -> str:
    post_id = recipe_data.get("postId") or str(uuid.uuid4())

    # like‑tracking fields are present at creation
    recipe_data.update({
        "postId":  post_id,
        "likes":   recipe_data.get("likes", 0),
        "likedBy": recipe_data.get("likedBy", []) 
    })

    _user_recipes_ref(user_id).document(post_id).set(recipe_data)
    return post_id


def get_recipe_from_firebase(user_id: str, post_id: str):
    snap = _user_recipes_ref(user_id).document(post_id).get()
    return snap.to_dict() if snap.exists else None


def update_recipe_in_firebase(user_id: str, post_id: str, updated_data: Dict):
    doc_ref = _user_recipes_ref(user_id).document(post_id)
    if not doc_ref.get().exists:
        return None
    doc_ref.update(updated_data)
    return doc_ref.get().to_dict()

def delete_recipe_from_firebase(user_id: str, post_id: str) -> bool:
    doc_ref = _user_recipes_ref(user_id).document(post_id)
    if not doc_ref.get().exists:
        return False
    doc_ref.delete()
    return True


def upload_images_to_cloudinary(file_list):
    image_entries = []
    for file_obj in file_list:
        public_id = "recipe_" + str(uuid.uuid4())
        result = cloudinary.uploader.upload(
            file_obj, public_id=public_id, folder="recipe_images"
        )
        image_entries.append(
            {"url": result["secure_url"], "publicId": result["public_id"]}
        )
    return image_entries


def delete_image_from_cloudinary(public_id):
    cloudinary.uploader.destroy(public_id)


def like_recipe(owner_id: str, post_id: str, liker_id: str):
    """Add liker_id to likedBy and increment likes (idempotent)."""
    doc_ref = _user_recipes_ref(owner_id).document(post_id)
    snap = doc_ref.get()
    if not snap.exists:
        return None

    if liker_id in snap.get("likedBy", []):    
        return snap.to_dict()

    doc_ref.update({
        "likedBy": firestore.ArrayUnion([liker_id]),
        "likes":   firestore.Increment(1)
    })
    return doc_ref.get().to_dict()


def unlike_recipe(owner_id: str, post_id: str, liker_id: str):
    """Remove liker_id from likedBy and decrement likes (idempotent)."""
    doc_ref = _user_recipes_ref(owner_id).document(post_id)
    snap = doc_ref.get()
    if not snap.exists:
        return None

    if liker_id not in snap.get("likedBy", []):     
        return snap.to_dict()

    doc_ref.update({
        "likedBy": firestore.ArrayRemove([liker_id]),
        "likes":   firestore.Increment(-1)
    })
    return doc_ref.get().to_dict()


def get_most_liked_recipes():
    db = firestore.client()
    recipes = []
    users_ref = db.collection("users")

    for user in users_ref.stream():
        user_id = user.id
        subcol = db.collection("users").document(user_id).collection("created_recipes")
        for recipe_doc in subcol.stream():
            data = recipe_doc.to_dict()
            data["postId"] = recipe_doc.id
            data["userId"] = user_id
            recipes.append(data)

    sorted_recipes = sorted(recipes, key=lambda x: x.get("likes", 0), reverse=True)
    return sorted_recipes


def get_most_recent_recipes(limit=100):
    db = firestore.client()
    recipes = []
    users_ref = db.collection("users")

    for user in users_ref.stream():
        user_id = user.id
        subcol = db.collection("users").document(user_id).collection("created_recipes")
        for recipe_doc in subcol.stream():
            data = recipe_doc.to_dict()
            data["postId"] = recipe_doc.id
            data["userId"] = user_id
            recipes.append(data)

    sorted_recipes = sorted(
        recipes, key=lambda x: x.get("datePosted", ""), reverse=True
    )
    return sorted_recipes[:limit]

def get_easy_recipes():
    db = firestore.client()
    recipes = []
    users_ref = db.collection('users')

    for user in users_ref.stream():
        user_id = user.id
        subcol = db.collection('users').document(user_id).collection('created_recipes')
        for recipe_doc in subcol.stream():
            data = recipe_doc.to_dict()
            if data.get("difficulty", "").lower() == "easy":
                data["postId"] = recipe_doc.id
                data["userId"] = user_id
                recipes.append(data)

    return recipes

def get_quick_picks():
    db = firestore.client()
    recipes = []
    users_ref = db.collection("users")

    for user in users_ref.stream():
        user_id = user.id
        subcol = db.collection("users").document(user_id).collection("created_recipes")
        for recipe_doc in subcol.stream():
            data = recipe_doc.to_dict()
            cooking_time = data.get("cookingTime", "")

            if isinstance(cooking_time, str) and "mins" in cooking_time:
                try:
                    minutes = int(cooking_time.split()[0])
                    if minutes <= 30:
                        data["postId"] = recipe_doc.id
                        data["parsedCookingTime"] = minutes  # Add temp field for sorting
                        data["userId"] = user_id
                        recipes.append(data)
                except (ValueError, IndexError):
                    pass

    # Sort by parsed time (ascending)
    sorted_recipes = sorted(recipes, key=lambda r: r["parsedCookingTime"])

    # Optionally remove the temp field before returning
    for r in sorted_recipes:
        r.pop("parsedCookingTime", None)

    return sorted_recipes

EDITORS_PICKS = {
    "Best Taste": [
        {"userId": "",
         "postId": ""}
    ],
    "Healthiest": [
        {"userId": "",
         "postId": ""}
    ],
    "Student's Favorite": [
        {"userId": "",
         "postId": ""}
    ],
}

def get_editors_picks_by_category():
    db = firestore.client()
    picks_response = {}

    for category, picks in EDITORS_PICKS.items():
        category_recipes = []
        for pick in picks:
            user_id = pick["userId"]
            post_id = pick["postId"]
            doc_ref = db.collection("users").document(user_id).collection("created_recipes").document(post_id)
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                data["postId"] = post_id
                data["userId"] = user_id
                category_recipes.append(data)
        picks_response[category] = category_recipes

    return picks_response

