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

    token, status_code, error = authenticate_user(username, password)
    if token:
        # Firebase custom_token is bytes, so decode to string
        return jsonify({"firebase_custom_token": token.decode('utf-8')}), status_code
    else:
        return jsonify({"error": error}), status_code
