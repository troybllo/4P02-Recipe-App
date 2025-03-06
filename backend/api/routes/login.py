from flask import Blueprint, request, jsonify
from ..controllers.login import authenticate_user

login_blueprint = Blueprint('login', __name__)

@login_blueprint.route('/login', methods=['POST'])
def login():
    """
    Endpoint: POST /api/login
    """
    data = request.get_json()
    username = data.get('username') if data else None
    password = data.get('password') if data else None

    token, status_code, error, user_doc = authenticate_user(username, password)

    if token:
        # Note: custom_token is bytes; decode to string
        return jsonify({
            "firebase_custom_token": token.decode('utf-8'),
            "userId": user_doc["userId"]  # the random doc ID from Firestore
        }), status_code
    else:
        return jsonify({"error": error}), status_code
