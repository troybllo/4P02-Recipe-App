from flask import Flask
from flask_cors import CORS
from firebase_admin import credentials, initialize_app, get_app, App
import firebase_admin
import os

def create_app() -> Flask:
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)

    # Remove or comment out any JWT-related config:
    # app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
    # jwt = JWTManager(app)

    # Initialize CORS
    CORS(app)

    # Initialize Firebase Admin
    firebase_app = setup_firebase()

    # Import and register blueprints
    from .routes.registration import register_blueprint
    from .routes.login import login_blueprint

    app.register_blueprint(register_blueprint, url_prefix='/api')
    app.register_blueprint(login_blueprint, url_prefix='/api')

    return app

def setup_firebase() -> App:
    """
    Setup and initialize the Firebase Admin SDK. If the default app is already
    initialized, return it. Otherwise, initialize a new one using credentials.
    """
    try:
        return get_app()
    except ValueError:
        cred_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        if not cred_path:
            raise ValueError("Missing environment variable for Firebase credentials")

        cred = credentials.Certificate(cred_path)
        return initialize_app(cred)
