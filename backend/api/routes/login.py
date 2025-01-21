from flask import Blueprint, request, jsonify
from ..controllers.login import authenticate_user

login_blueprint = Blueprint('login', __name__)

@login_blueprint.route('/login', methods=['POST'])
def login():
    """
    Handle user login. Verifies credentials and, if successful, returns
    a Firebase custom token for the client to use.
    """
    username = request.json.get('username')
    password = request.json.get('password')

    custom_token = authenticate_user(username, password)
    if custom_token:
        # Firebase returns a bytes object, so decode to string before sending to client
        return jsonify({"firebase_custom_token": custom_token.decode('utf-8')}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
