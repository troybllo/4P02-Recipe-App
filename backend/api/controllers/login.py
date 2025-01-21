from firebase_admin import auth
from ..services.database_interface import get_user_by_username
from werkzeug.security import check_password_hash

def authenticate_user(username, password):
    """
    Retrieve the user from Firestore by username and verify the password.
    If valid, return a Firebase custom token; otherwise return None.
    """
    user = get_user_by_username(username)
    if user and check_password_hash(user['password_hash'], password):
        # Create a Firebase custom token using the username or user ID as the identity
        custom_token = auth.create_custom_token(user['username'])
        return custom_token
    return None
