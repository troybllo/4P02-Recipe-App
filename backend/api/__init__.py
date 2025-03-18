import os
from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, get_app, initialize_app
import cloudinary
from .routes.registration import register_blueprint
from .routes.login import login_blueprint
from .routes.recipes import recipes_blueprint


def create_app():
    """
    Create and configure an instance of the Flask application.
    We'll call 'setup_firebase()' here once, so we have a default
    Firebase app ready (test or production, depending on environment).
    Then we configure Cloudinary using CLOUDINARY_URL.
    """
    app = Flask(__name__)
    CORS(app)

    # Initialize Firebase Admin (default app)
    setup_firebase()

    # Configure Cloudinary using CLOUDINARY_URL, e.g.
    #   export CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
    cloudinary.config(cloudinary_url=os.getenv("CLOUDINARY_URL"))

    # Register blueprints
    app.register_blueprint(register_blueprint, url_prefix="/api")
    app.register_blueprint(login_blueprint, url_prefix="/api")
    app.register_blueprint(recipes_blueprint, url_prefix="/api")

    return app


def setup_firebase():
    """
    If FLASK_ENV == 'testing', use Firebase_Test.
    Otherwise, use GOOGLE_APPLICATION_CREDENTIALS for dev or prod.
    """
    try:
        # If default app already exists, do nothing
        get_app()
        return
    except ValueError:
        pass  # Means no default app has been initialized yet

    env_mode = os.getenv("FLASK_ENV", "development").lower()
    if env_mode == "testing":
        cred_path = os.getenv("Firebase_Test")
        if not cred_path:
            raise ValueError(
                "TEST_FIREBASE_CREDENTIALS not set, but FLASK_ENV=testing."
            )
    else:
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not cred_path:
            raise ValueError(
                "GOOGLE_APPLICATION_CREDENTIALS not set (non-testing mode)."
            )

    cred = credentials.Certificate(cred_path)
    initialize_app(cred)
