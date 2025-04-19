import os
from flask import Flask, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, get_app, initialize_app
import cloudinary

from .routes.registration import register_blueprint
from .routes.login import login_blueprint
from .routes.recipes import recipes_blueprint
#from .routes.profile import profile_blueprint

def create_app():
    app = Flask(__name__)

    # ✅ Full CORS setup with credentials + wildcard for methods
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # ✅ Initialize Firebase and Cloudinary
    setup_firebase()
    cloudinary.config(cloudinary_url=os.getenv("CLOUDINARY_URL"))

    # ✅ Register all route blueprints
    app.register_blueprint(register_blueprint, url_prefix="/api")
    app.register_blueprint(login_blueprint, url_prefix="/api")
    app.register_blueprint(recipes_blueprint, url_prefix="/api")
    #app.register_blueprint(profile_blueprint, url_prefix="/api")

    # ✅ Global CORS headers applied manually
    @app.after_request
    def apply_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response

    # ✅ Optional: Explicit OPTIONS handler to avoid 500s
    @app.route("/api/<path:path>", methods=["OPTIONS"])
    def handle_options(path):
        response = app.make_default_options_response()
        return response

    return app

def setup_firebase():
    try:
        get_app()
        return
    except ValueError:
        pass

    env_mode = os.getenv("FLASK_ENV", "development").lower()
    cred_path = os.getenv("Firebase_Test") if env_mode == "testing" else os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if not cred_path:
        raise ValueError("Missing Firebase credentials for environment")

    cred = credentials.Certificate(cred_path)
    initialize_app(cred)
