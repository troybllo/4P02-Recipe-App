from flask import Blueprint, request, jsonify
from ..controllers.registration import register_user
from firebase_admin import firestore
import cloudinary.uploader
from werkzeug.utils import secure_filename

register_blueprint = Blueprint("register", __name__)

# === POST: Register New User ===
@register_blueprint.route("/register", methods=["POST"])
def register():
    """
    Endpoint: POST /api/register
    """
    return register_user()


# === PUT: Update Profile ===
@register_blueprint.route("/users/<user_id>/update_profile", methods=["PUT", "OPTIONS"])
def update_profile(user_id):
    """
    Endpoint: PUT /api/users/<user_id>/update_profile
    Expects multipart/form-data with keys: username, bio, image
    """
    try:
        db = firestore.client()
        user_ref = db.collection("users").document(user_id)

        username = request.form.get("username")
        bio = request.form.get("bio")
        image = request.files.get("image")

        update_data = {}

        if username:
            update_data["username"] = username
        if bio:
            update_data["bio"] = bio
        if image:
            # Upload image to Cloudinary
            result = cloudinary.uploader.upload(image, folder="profile_pictures")
            update_data["profileImage"] = result["secure_url"]

        user_ref.update(update_data)

        return jsonify({"message": "Profile updated successfully."}), 200

    except Exception as e:
        print("[update_profile ERROR]:", str(e))
        return jsonify({"error": str(e)}), 500
