from flask import request, jsonify
from werkzeug.security import generate_password_hash
from ..services.database_interface import add_user_to_firebase, get_user_by_username, get_user_by_email
from ..models.user import User
import re

def register_user():
    if request.content_type != 'application/json':
        return jsonify({"error": "Invalid JSON format"}), 400

    try:
        user_data = request.get_json()
    except:
        return jsonify({"error": "Invalid JSON format"}), 400

    if not user_data:
        return jsonify({"error": "No data provided."}), 400

    # Required fields
    username = user_data.get("username")
    email = user_data.get("email")
    password = user_data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # Email validation
    if not User.validate_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    # Check for existing username or email
    existing_user = get_user_by_username(username)
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    existing_email = get_user_by_email(email)
    if existing_email:
        return jsonify({"error": "Email already exists"}), 409

    preferences = user_data.get("preferences", [])
    if not isinstance(preferences, list):
        return jsonify({"error": "Invalid preferences format"}), 400

    country = user_data.get("country", "")

    new_user = User(
        username=username,
        email=email,
        password=password,
        country=country,
        preferences=preferences,
        following=[],
        followers=[],
        created_recipes=[]
    )

    # Convert to dict for Firestore
    user_dict = {
        "username": new_user.username,
        "email": new_user.email,
        "password_hash": new_user.password_hash,
        "country": new_user.country,
        "preferences": new_user.preferences,
        "following": [],
        "followers": [],
        "savedPosts": [],
        "created_recipes": []
    }

    # This now returns: {"message": "...", "userId": "..."}
    result = add_user_to_firebase(user_dict)

    return jsonify({
        "message": "User registered successfully",
        "user": user_dict,               # includes the final doc fields
        "userId": result["userId"]       # for convenience in your client
    }), 201
