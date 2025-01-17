from flask import Blueprint, request, jsonify
from ..controllers.login import authenticate_user

login_blueprint = Blueprint('login', __name__)

@login_blueprint.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    access_token, error = authenticate_user(username, password)
    if access_token:
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": error}), 401
