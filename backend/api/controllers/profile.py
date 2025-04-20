from flask import request, jsonify
from werkzeug.security import check_password_hash
from ..services.profile_database import (
    update_profile_in_firestore,
    upload_profile_image_to_cloudinary,
    change_user_password,
    follow_user,
    unfollow_user,
    save_post,
    unsave_post,
    get_user_with_recipes
)
from ..services.database_interface import get_user_by_username , get_user_by_id 

def edit_profile(user_id):
    """
    PUT /api/profile/<user_id>
    - Accepts JSON or multipart/form-data
    - Fields like 'about', 'profileImage' (file), etc.
    """
    content_type = request.content_type or ""
    if "multipart/form-data" in content_type:
        # parse form data
        form_data = request.form.to_dict()
        print("This is formdata",form_data)
        updated_bio = form_data.get("bio")
        image_file = request.files.get("profileImage")
        changed_username = form_data.get("username")

        updates = {}
        if updated_bio is not None:
            updates["bio"] = updated_bio

        
        if changed_username is not None:
    # Check if the new username is already taken
            if not get_user_by_username(changed_username):  # Note: checking the new username
                updates["username"] = changed_username
            else:
            # Username already taken, return an error response
                return jsonify({"error": "Username already taken"}), 400
        # If a new profile image is uploaded
        if image_file:
            img_result = upload_profile_image_to_cloudinary(image_file)
            updates["profileImageUrl"] = img_result["url"]

        updated_doc = update_profile_in_firestore(user_id, updates)
        if not updated_doc:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"message": "Profile updated", "profile": updated_doc}), 200
    else:
        # JSON approach
        data = request.get_json(silent=True) or {}
        print("This is formdata /json",data)
        about = data.get("about")

        updates = {}
        if about is not None:
            updates["about"] = about

        updated_doc = update_profile_in_firestore(user_id, updates)
        if not updated_doc:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"message": "Profile updated", "profile": updated_doc}), 200


def change_password(user_id):
    """
    PUT /api/profile/<user_id>/password
    Body: { "username": "...", "oldPassword": "...", "newPassword": "..." }
    - Verifies old password, sets new password.
    """
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    if not (username and old_password and new_password):
        return jsonify({"error": "Missing username, oldPassword, or newPassword"}), 400

    # Fetch user doc by username
    user_doc = get_user_by_username(username)
    if not user_doc:
        return jsonify({"error": "User not found"}), 404

    # Confirm that doc's userId matches the path param user_id
    if user_doc.get("userId") != user_id:
        return jsonify({"error": "Mismatched userId"}), 403

    # check old password
    if not check_password_hash(user_doc["password_hash"], old_password):
        return jsonify({"error": "Incorrect old password"}), 401

    # If correct, set the new password
    updated_doc = change_user_password(user_id, new_password)
    if not updated_doc:
        return jsonify({"error": "User not found for password change"}), 404
    return jsonify({"message": "Password changed successfully"}), 200


def follow_user_controller():
    """
    POST /api/profile/follow
    Body: { "currentUserId": "...", "targetUserId": "..." }
    """
    data = request.get_json(silent=True) or {}
    print(data)
    current_user_id = data.get("currentUserId")
    target_user_id = data.get("targetUserId")
    if not current_user_id or not target_user_id:
        return jsonify({"error": "Missing user IDs"}), 400

    updated_doc = follow_user(current_user_id, target_user_id)
    if not updated_doc:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "Followed successfully", "profile": updated_doc}), 200

def is_following_controller():
    """
    Controller for checking follow status
    Query params: userId (current user), targetId (profile being viewed)
    Returns: { "isFollowing": boolean }
    """
    print("we get in the function")
    current_user_id = request.args.get("userId")
    target_user_id = request.args.get("targetId")
    
    
    # Validate input
    if not current_user_id or not target_user_id:
        return jsonify({"error": "Missing user IDs"}), 400

    # Get user data
    current_user = get_user_by_id(current_user_id)

    if not current_user:
        print(current_user_id)
        print(target_user_id)
        return jsonify({"error": "Current user not found"}), 404
    
    # Business logic
    following = current_user.get("following", [])
    is_following = target_user_id in following
    
    return jsonify({"isFollowing": is_following}), 200

def unfollow_user_controller():
    """
    POST /api/profile/unfollow
    Body: { "currentUserId": "...", "targetUserId": "..." }
    """
    data = request.get_json(silent=True) or {}
    current_user_id = data.get("currentUserId")
    target_user_id = data.get("targetUserId")
    if not current_user_id or not target_user_id:
        return jsonify({"error": "Missing user IDs"}), 400

    updated_doc = unfollow_user(current_user_id, target_user_id)
    if not updated_doc:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "Unfollowed successfully", "profile": updated_doc}), 200

def save_post_controller():
    """
    POST /api/profile/savePost
    { "userId": "...", "postId": "..." }
    """
    data = request.get_json(silent=True) or {}
    user_id = data.get("userId")
    post_id = data.get("postId")
    if not user_id or not post_id:
        return jsonify({"error": "Missing userId or postId"}), 400

    updated_doc = save_post(user_id, post_id)
    if not updated_doc:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "Post saved", "profile": updated_doc}), 200

def unsave_post_controller():
    """
    POST /api/profile/unsavePost
    { "userId": "...", "postId": "..." }
    """
    data = request.get_json(silent=True) or {}
    user_id = data.get("userId")
    post_id = data.get("postId")
    if not user_id or not post_id:
        return jsonify({"error": "Missing userId or postId"}), 400

    updated_doc = unsave_post(user_id, post_id)
    if not updated_doc:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "Post unsaved", "profile": updated_doc}), 200

def fetch_user_by_username(username):
    user_data = get_user_with_recipes(username)
    print(user_data)
    if not user_data:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user_data), 200

def fetch_username_by_user_id():
    """
    GET /api/profile/username?userId=...
    Returns: { "username": "...", "profileImageUrl": "...", ... }
    """
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    user_doc = get_user_by_id(user_id)
    if not user_doc:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "username": user_doc.get("username"),
        "profileImageUrl": user_doc.get("profileImageUrl"),
        "userId": user_id
    }), 200
