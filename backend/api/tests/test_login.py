def test_login_success(client):
    """
    Register a user, then login with correct credentials.
    Expect 200 and a firebase_custom_token in response.
    """
    # 1. Register
    reg_payload = {
        "username": "loginuser",
        "email": "loginuser@example.com",
        "password": "loginpassword"
    }
    reg_resp = client.post("/api/register", json=reg_payload)
    assert reg_resp.status_code == 200

    # 2. Login
    login_payload = {
        "username": "loginuser",
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
