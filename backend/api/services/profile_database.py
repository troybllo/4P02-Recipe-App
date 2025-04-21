import uuid
from firebase_admin import firestore
import cloudinary
import cloudinary.uploader
from werkzeug.security import generate_password_hash
from .database_interface import get_user_by_username


def get_user_doc(user_id):
    """
    Returns a Firestore doc reference for the user doc with ID 'user_id'.
    """
    db = firestore.client()
    return db.collection("users").document(user_id)


def update_profile_in_firestore(user_id, updates):
    """
    Merges 'updates' into the user doc with doc ID = user_id.
    Returns the updated doc, or None if not found.
    """
    doc_ref = get_user_doc(user_id)
    doc = doc_ref.get()
    if not doc.exists:
        return None

    doc_ref.update(updates)
    return doc_ref.get().to_dict()


def upload_profile_image_to_cloudinary(file_obj):
    """
    Upload a profile image to Cloudinary.
    Returns {"url": "...", "publicId": "..."}.
    """
    public_id = "profile_" + str(uuid.uuid4())
    result = cloudinary.uploader.upload(
        file_obj, public_id=public_id, folder="profile_images"
    )
    return {"url": result["secure_url"], "publicId": result["public_id"]}


def change_user_password(user_id, new_password):
    """
    Sets a new password hash for the user doc.
    (We assume the old password check is done in the controller.)
    """
    doc_ref = get_user_doc(user_id)
    if not doc_ref.get().exists:
        return None

    new_hash = generate_password_hash(new_password)
    doc_ref.update({"password_hash": new_hash})
    return doc_ref.get().to_dict()


def follow_user(current_user_id, target_user_id):
    """
    currentUser follows targetUser:
      - currentUser's 'following' += targetUserId
      - targetUser's 'followers' += currentUserId
    Uses a batch to update both docs.
    """
    db = firestore.client()
    current_user_ref = get_user_doc(current_user_id)
    target_user_ref = get_user_doc(target_user_id)

    if not current_user_ref.get().exists or not target_user_ref.get().exists:
        return None

    batch = db.batch()
    batch.update(
        current_user_ref, {"following": firestore.ArrayUnion([target_user_id])}
    )
    batch.update(
        target_user_ref, {"followers": firestore.ArrayUnion([current_user_id])}
    )
    batch.commit()

    # Return the updated current user doc
    return current_user_ref.get().to_dict()


def unfollow_user(current_user_id, target_user_id):
    """
    Reverse the follow process:
      - currentUser's 'following' -= targetUserId
      - targetUser's 'followers' -= currentUserId
    """
    db = firestore.client()
    current_user_ref = get_user_doc(current_user_id)
    target_user_ref = get_user_doc(target_user_id)

    if not current_user_ref.get().exists or not target_user_ref.get().exists:
        return None

    batch = db.batch()
    batch.update(
        current_user_ref, {
            "following": firestore.ArrayRemove([target_user_id])}
    )
    batch.update(
        target_user_ref, {
            "followers": firestore.ArrayRemove([current_user_id])}
    )
    batch.commit()

    return current_user_ref.get().to_dict()


def save_post(user_id, post_id):
    """
    Adds 'post_id' to the user's 'savedPosts' array.
    """
    user_ref = get_user_doc(user_id)
    if not user_ref.get().exists:
        return None

    user_ref.update({"savedPosts": firestore.ArrayUnion([post_id])})
    return user_ref.get().to_dict()


def unsave_post(user_id, post_id):
    """
    Removes 'post_id' from the user's 'savedPosts' array.
    """
    user_ref = get_user_doc(user_id)
    if not user_ref.get().exists:
        return None

    user_ref.update({"savedPosts": firestore.ArrayRemove([post_id])})
    return user_ref.get().to_dict()


def get_user_with_recipes(username):
    # First get the user document
    db = firestore.client()
    users_ref = db.collection("users").where(
        "username", "==", username).limit(1)
    user_docs = list(users_ref.stream())

    if not user_docs:
        return None

    # Get the user data
    user_doc = user_docs[0]
    user_data = user_doc.to_dict()

    # Now get the recipes subcollection using the document reference
    recipes_ref = user_doc.reference.collection("created_recipes")
    print(f"Recipes reference: {recipes_ref}")

    # Debug the actual documents in the collection
    recipes = []
    recipe_count = 0

    # Try to retrieve the recipes
    try:
        recipe_docs = list(recipes_ref.stream())
        print(f"Number of recipe documents found: {len(recipe_docs)}")

        for recipe in recipe_docs:
            recipe_count += 1
            recipe_data = recipe.to_dict()
            print(f"Recipe {recipe_count} ID: {recipe.id}")
            print(f"Recipe {recipe_count} data: {recipe_data}")
            recipes.append(recipe_data)
    except Exception as e:
        print(f"Error retrieving recipes: {e}")

    # Add recipes to user data
    user_data["recipes"] = recipes
    return user_data


def get_following_feed(user_id):
    """
    Get all recipes from users that the specified user follows
    Returns a list of recipes with author information included
    """
    db = firestore.client()
    user_ref = get_user_doc(user_id)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return None

    user_data = user_doc.to_dict()
    following = user_data.get("following", [])

    # If user doesn't follow anyone, return empty list
    if not following:
        return []

    all_following_recipes = []

    # Get recipes from each followed user
    for followed_user_id in following:
        followed_user_ref = get_user_doc(followed_user_id)
        followed_user_doc = followed_user_ref.get()

        if not followed_user_doc.exists:
            continue

        followed_user_data = followed_user_doc.to_dict()

        # Get recipes from the followed user's created_recipes subcollection
        recipes_ref = followed_user_ref.collection("created_recipes")
        recipe_docs = list(recipes_ref.stream())

        for recipe_doc in recipe_docs:
            recipe_data = recipe_doc.to_dict()
            # Add author information to each recipe
            recipe_data.update(
                {
                    "id": recipe_doc.id,
                    "authorId": followed_user_id,
                    "userId": followed_user_id,
                    "username": followed_user_data.get("username", ""),
                    "profileImageUrl": followed_user_data.get("profileImageUrl", ""),
                }
            )
            all_following_recipes.append(recipe_data)

    # Sort by timestamp (newest first)
    all_following_recipes.sort(
        key=lambda x: x.get("timestamp") or x.get(
            "datePosted") or x.get("date") or 0,
        reverse=True,
    )

    return all_following_recipes


def get_suggested_users(user_id, limit=5):
    """
    Get a list of suggested users for the specified user to follow
    Excludes users that the user already follows
    Returns a list of user documents with basic profile info
    """
    db = firestore.client()
    user_ref = get_user_doc(user_id)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return None

    user_data = user_doc.to_dict()
    following = user_data.get("following", [])
    # Add the user's own ID to exclude from suggestions
    following.append(user_id)

    # Get random sample of users that the user doesn't follow
    # Limit the results to the specified number
    users_ref = db.collection("users").limit(20)
    all_users = list(users_ref.stream())

    # Filter out users that the current user already follows
    suggested_users = []
    for user in all_users:
        if user.id not in following:
            user_data = user.to_dict()
            suggested_users.append(
                {
                    "userId": user.id,
                    "username": user_data.get("username", ""),
                    "profileImageUrl": user_data.get("profileImageUrl", ""),
                }
            )
            if len(suggested_users) >= limit:
                break

    return suggested_users
