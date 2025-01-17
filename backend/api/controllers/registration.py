from flask import request, jsonify
from ..services.database_interface import add_user_to_firebase

def register_user():
    user_data = request.get_json()
    result = add_user_to_firebase(user_data)
    return jsonify(result)
