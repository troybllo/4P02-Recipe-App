import uuid
from firebase_admin import firestore
import cloudinary
import cloudinary.uploader
from werkzeug.security import generate_password_hash

def get_user_doc(user_id):
    """
    Returns a Firestore doc reference for the user doc with ID 'user_id'.
    """
    db = firestore.client()
    return db.collection('users').document(user_id)


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
        file_obj,
        public_id=public_id,
        folder="profile_images"
    )
    return {
        "url": result["secure_url"],
        "publicId": result["public_id"]
    }

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
    batch.update(current_user_ref, {
        "following": firestore.ArrayUnion([target_user_id])
    })
    batch.update(target_user_ref, {
        "followers": firestore.ArrayUnion([current_user_id])
    })
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
    batch.update(current_user_ref, {
        "following": firestore.ArrayRemove([target_user_id])
    })
    batch.update(target_user_ref, {
        "followers": firestore.ArrayRemove([current_user_id])
    })
    batch.commit()

    return current_user_ref.get().to_dict()


def save_post(user_id, post_id):
    """
    Adds 'post_id' to the user's 'savedPosts' array.
    """
    user_ref = get_user_doc(user_id)
    if not user_ref.get().exists:
        return None

    user_ref.update({
        "savedPosts": firestore.ArrayUnion([post_id])
    })
    return user_ref.get().to_dict()

def unsave_post(user_id, post_id):
    """
    Removes 'post_id' from the user's 'savedPosts' array.
    """
    user_ref = get_user_doc(user_id)
    if not user_ref.get().exists:
        return None

    user_ref.update({
        "savedPosts": firestore.ArrayRemove([post_id])
    })
    return user_ref.get().to_dict()
