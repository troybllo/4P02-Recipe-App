import os
from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, get_app, initialize_app

def create_app():
    """
    Create and configure an instance of the Flask application.
    We'll call 'setup_firebase()' here once, so we have a default
    Firebase app ready (test or production, depending on environment).
    """
    app = Flask(__name__)
    CORS(app)

    # Initialize Firebase Admin (default app)
    setup_firebase()

    # blueprint registrations
    from .routes.registration import register_blueprint
    from .routes.login import login_blueprint
    app.register_blueprint(register_blueprint, url_prefix='/api')
    app.register_blueprint(login_blueprint, url_prefix='/api')

    return app


def setup_firebase():
    """
    If FLASK_ENV == 'testing', use Firebase_Test.
    Otherwise, use GOOGLE_APPLICATION_CREDENTIALS for dev or prod.
    """
    # 1. Check if there's already a default app:
    try:
        # If default app already exists, do nothing
        get_app()
        return
    except ValueError:
        pass  # Means no default app has been initialized yet

    # 2. Pick which creds to use
    env_mode = os.getenv("FLASK_ENV", "development").lower()
    if env_mode == "testing":
        cred_path = os.getenv("Firebase_Test")
        if not cred_path:
            raise ValueError("TEST_FIREBASE_CREDENTIALS not set, but FLASK_ENV=testing.")
    else:
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not cred_path:
            raise ValueError("GOOGLE_APPLICATION_CREDENTIALS not set (non-testing mode).")

    # 3. Initialize the *default* app with whichever creds we found
    cred = credentials.Certificate(cred_path)
    initialize_app(cred)  # default app
