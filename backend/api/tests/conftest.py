import os
import cloudinary.uploader
import uuid, os
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

@pytest.fixture(autouse=True)
def _mock_cloudinary(monkeypatch):
    """
    Replace real Cloudinary calls during the test‑suite so we never need
    a network request or real API‑key.
    """
    # make cloudinary.config() happy even if the env‑var is missing
    os.environ.setdefault(
        "CLOUDINARY_URL",
        "cloudinary://dummy_key:dummy_secret@dummy_cloud"
    )

    def _fake_upload(file_obj, public_id=None, folder=None, **_):
        # return a predictable fake‑response
        pub = public_id or f"mock_{uuid.uuid4().hex}"
        return {
            "secure_url": f"https://mock.cloud/{folder}/{pub}.png",
            "public_id":  pub,
        }

    monkeypatch.setattr(cloudinary.uploader, "upload",  _fake_upload)
    monkeypatch.setattr(cloudinary.uploader, "destroy", lambda *_: None)
    yield


@pytest.fixture(scope="session")
def client(app):
    """
    Returns a Flask test client that uses the default app,
    now initialized with test credentials.
    """
    return app.test_client()
