import pytest
from werkzeug.security import check_password_hash

def test_registration_success_minimal(client):
    """Test registration with only required fields"""
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword"
    }
    response = client.post("/api/register", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert "message" in data
    assert data["user"]["username"] == "testuser"
    assert data["user"]["email"] == "test@example.com"
    assert "password_hash" in data["user"]
    assert data["user"]["country"] == ""
    assert data["user"]["preferences"] == []
    assert data["user"]["friend_list"] == []
    assert data["user"]["created_recipes"] == []

def test_registration_success_full(client):
    """Test registration with all optional fields"""
    payload = {
        "username": "fulluser",
        "email": "full@example.com",
        "password": "fullpassword",
        "country": "Canada",
        "preferences": ["vegan", "gluten-free"]
    }
    response = client.post("/api/register", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    user = data["user"]
    assert user["username"] == payload["username"]
    assert user["email"] == payload["email"]
    assert user["country"] == payload["country"]
    assert user["preferences"] == payload["preferences"]
    assert user["friend_list"] == []
    assert user["created_recipes"] == []

def test_registration_missing_required_fields(client):
    """Test all combinations of missing required fields"""
    required_fields = ["username", "email", "password"]
    
    for missing_field in required_fields:
        payload = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass"
        }
        del payload[missing_field]
        
        response = client.post("/api/register", json=payload)
        assert response.status_code == 400
        data = response.get_json()
        assert "error" in data
        assert "missing required fields" in data["error"].lower()

def test_registration_invalid_email(client):
    """Test registration with invalid email format"""
    payload = {
        "username": "emailtest",
        "email": "invalid-email",
        "password": "testpass"
    }
    response = client.post("/api/register", json=payload)
    assert response.status_code == 400
    assert "invalid email format" in response.get_json()["error"].lower()

def test_registration_duplicate_email(client):
    """Test registration with duplicate email"""
    payload = {
        "username": "user1",
        "email": "duplicate@example.com",
        "password": "testpass"
    }
    # First registration
    response1 = client.post("/api/register", json=payload)
    assert response1.status_code == 201
    
    # Second registration with same email but different username
    payload["username"] = "user2"
    response2 = client.post("/api/register", json=payload)
    assert response2.status_code == 409
    assert "email already exists" in response2.get_json()["error"].lower()

def test_registration_invalid_preferences(client):
    """Test registration with invalid preferences format"""
    payload = {
        "username": "preftest",
        "email": "pref@example.com",
        "password": "testpass",
        "preferences": "invalid-not-a-list"
    }
    response = client.post("/api/register", json=payload)
    assert response.status_code == 400
    assert "invalid preferences format" in response.get_json()["error"].lower()

def test_password_hashing(client):
    """Test that password is properly hashed"""
    payload = {
        "username": "hashtest",
        "email": "hash@example.com",
        "password": "testpass"
    }
    response = client.post("/api/register", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    
    # Verify password is hashed
    assert data["user"]["password_hash"] != payload["password"]
    assert check_password_hash(data["user"]["password_hash"], payload["password"])

def test_registration_empty_payload(client):
    """Test registration with empty payload"""
    response = client.post("/api/register", json={})
    assert response.status_code == 400
    assert "no data provided" in response.get_json()["error"].lower()

def test_registration_invalid_json(client):
    """Test registration with invalid JSON"""
    response = client.post("/api/register", data="invalid json")
    assert response.status_code == 400
    assert "invalid json" in response.get_json()["error"].lower()