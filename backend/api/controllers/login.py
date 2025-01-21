from flask_jwt_extended import create_access_token
from ..services.database_interface import get_user_by_username
from werkzeug.security import check_password_hash

def authenticate_user(username, password):
    user = get_user_by_username(username)
    if user and check_password_hash(user['password_hash'], password):
        return create_access_token(identity=username), None
    return None, "Invalid credentials"
