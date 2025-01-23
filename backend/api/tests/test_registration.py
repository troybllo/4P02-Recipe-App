def test_registration_success(client):
    """
    Test a valid registration. Should return 200 and success message.
    """
    payload = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    response = client.post("/api/register", json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data.get("message") == "User added successfully"


def test_registration_missing_fields(client):
    """
    Test registration with missing 'password'.
    Expect 400 and an error message.
    """
    payload = {
        "username": "testuser2",
        "email": "test2@example.com"
        # 'password' is missing
    }
    response = client.post("/api/register", json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    assert "missing required fields" in data["error"].lower()


def test_registration_duplicate_username(client):
    """
    Register the same username twice. 
    Expect 409 conflict on second attempt.
    """
    payload = {
        "username": "duplicateuser",
        "email": "duplicate@example.com",
        "password": "somepassword"
    }

    # First registration
    response_1 = client.post("/api/register", json=payload)
    assert response_1.status_code == 200
    
    # Second registration with same username
    response_2 = client.post("/api/register", json=payload)
    assert response_2.status_code == 409
    data_2 = response_2.get_json()
    assert "error" in data_2
    assert "already exists" in data_2["error"].lower()
