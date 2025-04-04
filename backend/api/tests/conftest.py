import os
import pytest

from backend.api import create_app
import firebase_admin
from firebase_admin import delete_app, get_app

@pytest.fixture(scope="session")
def app():
    """
    Force FLASK_ENV=testing and ensure Firebase_Test is set
    before creating the Flask app. This will cause setup_firebase() to
    initialize the *default* app with test credentials.
    """
    # If a default app is already loaded from a previous run, delete it
    try:
        default_app = get_app()
        delete_app(default_app)
    except ValueError:
        pass

    # Mark environment as 'testing'
    os.environ["FLASK_ENV"] = "testing"

    # Ensure Firebase_Test is set
    test_cred_path = os.getenv("Firebase_Test")
    if not test_cred_path:
        raise RuntimeError("Firebase_Test not set, but FLASK_ENV=testing")

    # Create our Flask app, which calls 'setup_firebase()'
    flask_app = create_app()
    flask_app.config["TESTING"] = True

    yield flask_app

    # (Optional) after all tests, we can delete the default app if you want
    try:
        default_app = get_app()
        delete_app(default_app)
    except ValueError:
        pass


@pytest.fixture(scope="session")
def client(app):
    """
    Returns a Flask test client that uses the default app,
    now initialized with test credentials.
    """
    return app.test_client()
