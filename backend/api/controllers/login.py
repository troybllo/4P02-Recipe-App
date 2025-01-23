from firebase_admin import auth
from werkzeug.security import check_password_hash
from ..services.database_interface import get_user_by_username

def authenticate_user(username, password):
    """
    Validate input, fetch user from Firestore, check password.
    If valid, return (custom_token, status_code, None).
    Otherwise, return (None, status_code, error_message).
    """
    # Basic Input Checking
    if not username or not password:
        return None, 400, "Missing username or password"

    user = get_user_by_username(username)
    if not user:
        return None, 401, "Invalid credentials"

    if not check_password_hash(user['password_hash'], password):
        return None, 401, "Invalid credentials"

    # Generate a Firebase custom token
    custom_token = auth.create_custom_token(user['username'])
    return custom_token, 200, None
