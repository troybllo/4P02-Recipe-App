# helper that guarantees a unique string every run
import uuid
def _uid(prefix="usr"):
    return f"{prefix}_{uuid.uuid4().hex[:6]}"

def test_login_success(client):
    """
    Register a user, then login with correct credentials.
    Expect 200 and a firebase_custom_token in response.
    """
    # Register
    reg_payload = {
        "username": _uid("login"),
        "email":    f"{_uid('l')}@example.com",
        "password": "loginpassword"
    }
    reg_resp = client.post("/api/register", json=reg_payload)
    assert reg_resp.status_code == 201  

    # Login
    login_payload = {
        "username": reg_payload["username"],
        "password": "loginpassword"
    }
    login_resp = client.post("/api/login", json=login_payload)
    assert login_resp.status_code == 200
    data = login_resp.get_json()
    assert "firebase_custom_token" in data


def test_login_missing_fields(client):
    """
    Attempt login without providing password.
    Expect 400 missing username or password.
    """
    login_payload = {
        "username": "someuser"
        # no 'password'
    }
    login_resp = client.post("/api/login", json=login_payload)
    assert login_resp.status_code == 400
    data = login_resp.get_json()
    assert "error" in data
    assert "missing username or password" in data["error"].lower()


def test_login_invalid_credentials(client):
    """
    Attempt login with bad password or user that doesn't exist.
    Expect 401 Invalid credentials.
    """
    login_payload = {
        "username": "nonexistent",
        "password": "wrongpassword"
    }
    login_resp = client.post("/api/login", json=login_payload)
    assert login_resp.status_code == 401
    data = login_resp.get_json()
    assert data["error"] == "Invalid credentials"
