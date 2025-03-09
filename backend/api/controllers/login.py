from firebase_admin import auth
from werkzeug.security import check_password_hash
from ..services.database_interface import get_user_by_username

def authenticate_user(username, password):
    """
    Validate user credentials.
    If valid, return (custom_token, status_code, None, user_doc).
    Otherwise, return (None, status_code, error, None).
    """
    if not username or not password:
        return None, 400, "Missing username or password", None

    user_doc = get_user_by_username(username)
    if not user_doc:
        return None, 401, "Invalid credentials", None

    if not check_password_hash(user_doc['password_hash'], password):
        return None, 401, "Invalid credentials", None

    # If you want the custom token to represent user['userId'] instead of 'username', do:
    # custom_token = auth.create_custom_token(user_doc['userId'])
    # For now, we’ll keep it as username-based:
    custom_token = auth.create_custom_token(user_doc['username'])

    # Return the doc so we can provide userId in /login response
    return custom_token, 200, None, user_doc
