from flask import request, jsonify
from ..services.database_interface import add_user_to_firebase
from ..models.user import User

def register_user():
    print("DEBUG: This is the UPDATED register_user function.")
    user_data = request.get_json()

    user_obj = User(
        username=user_data['username'],
        email=user_data['email'],
        password=user_data['password']
    )

    firestore_data = {
        "username": user_obj.username,
        "email": user_obj.email,
        "password_hash": user_obj.password_hash
    }

    result = add_user_to_firebase(firestore_data)
    return jsonify(result)
