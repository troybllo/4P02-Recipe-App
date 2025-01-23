from flask import request, jsonify
from werkzeug.security import generate_password_hash
from ..services.database_interface import add_user_to_firebase, get_user_by_username

def register_user():
    """
    Handle user registration with basic checks:
      - Check if required fields are present
      - Check if user already exists in Firestore
      - Hash password and store user in Firestore
    """
    user_data = request.get_json()
    if not user_data:
        return jsonify({"error": "No data provided."}), 400

    username = user_data.get("username")
    email = user_data.get("email")
    password = user_data.get("password")

    # Basic field checks
    if not username or not email or not password:
        return jsonify({"error": "Missing required fields (username, email, password)."}), 400

    # Check if user already exists
    existing_user = get_user_by_username(username)
    if existing_user:
        return jsonify({"error": "User with this username already exists."}), 409

    # Everything looks good, add the user
    user_dict = {
        "username": username,
        "email": email,
        "password_hash": generate_password_hash(password)
    }
    result = add_user_to_firebase(user_dict)
    return jsonify(result), 200
