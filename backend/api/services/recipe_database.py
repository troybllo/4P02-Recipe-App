import uuid
from firebase_admin import firestore
import cloudinary
import cloudinary.uploader

def create_recipe_in_firebase(user_id, recipe_data):
    db = firestore.client()
    user_ref = db.collection('users').document(user_id)
    subcol_ref = user_ref.collection('created_recipes')

    post_id = recipe_data.get("postId") or str(uuid.uuid4())
    recipe_data["postId"] = post_id

    doc_ref = subcol_ref.document(post_id)
    doc_ref.set(recipe_data)
    return post_id

def get_recipe_from_firebase(user_id, post_id):
    db = firestore.client()
    doc_ref = db.collection('users').document(user_id).collection('created_recipes').document(post_id)
    doc = doc_ref.get()
    return doc.to_dict() if doc.exists else None

def update_recipe_in_firebase(user_id, post_id, updated_data):
    db = firestore.client()
    doc_ref = db.collection('users').document(user_id).collection('created_recipes').document(post_id)
    if not doc_ref.get().exists:
        return None
    doc_ref.update(updated_data)
    return doc_ref.get().to_dict()

def delete_recipe_from_firebase(user_id, post_id):
    db = firestore.client()
    doc_ref = db.collection('users').document(user_id).collection('created_recipes').document(post_id)
    if not doc_ref.get().exists:
        return False
    doc_ref.delete()
    return True

def upload_images_to_cloudinary(file_list):
    image_entries = []
    for file_obj in file_list:
        public_id = "recipe_" + str(uuid.uuid4())
        result = cloudinary.uploader.upload(
            file_obj,
            public_id=public_id,
            folder="recipe_images"
        )
        image_entries.append({
            "url": result["secure_url"],
            "publicId": result["public_id"]
        })
    return image_entries

def delete_image_from_cloudinary(public_id):
    cloudinary.uploader.destroy(public_id)
