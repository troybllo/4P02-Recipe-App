from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from firebase_admin import credentials, initialize_app, get_app, App
import firebase_admin
import os


def create_app() -> Flask:
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)

    # Configurations for JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
    jwt = JWTManager(app)  # Initialize JWT Manager

    # Initialize CORS
    CORS(
        app,
        resources={
            r"/*": {  # Allow all routes
                "origins": ["http://localhost:3000"],  # Allow only this origin
                # Allow these methods
                "methods": ["GET", "POST", "PUT", "DELETE"],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                ],  # Allow these headers
            }
        },
    )

    # Initialize Firebase Admin
    firebase_app = setup_firebase()

    # Import and register blueprints for registration and login
    from .routes.registration import register_blueprint
    from .routes.login import login_blueprint

    app.register_blueprint(register_blueprint, url_prefix="/api")
    app.register_blueprint(login_blueprint, url_prefix="/api")

    return app


def setup_firebase() -> App:
    """
    Setup and initialize the Firebase Admin SDK. If the default app is already
    initialized, return it. Otherwise, initialize a new one using credentials.
    """
    try:
        # If Firebase has already been initialized, just return the default app.
        return get_app()
    except ValueError:
        # "ValueError" will be raised if no default app exists yet.
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not cred_path:
            raise ValueError("Missing environment variable for Firebase credentials")

        cred = credentials.Certificate(cred_path)
        return initialize_app(cred)
