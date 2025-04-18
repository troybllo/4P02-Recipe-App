import uuid
import pytest
from io import BytesIO
from werkzeug.security import check_password_hash


def unique(val="user"):
    return f"{val}_{uuid.uuid4().hex[:8]}"

# minimal 1×1 PNG (base‑64 decoded once)
MIN_PNG = (
    b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR'
    b'\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00'
    b'\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x00\x00\x02'
    b'\x00\x01\xe2!\xbc\x33\x00\x00\x00\x00IEND\xaeB\x82'
)

# Fixtures that register two users up‑front (so we can follow/unfollow)

@pytest.fixture(scope="module")
def user_pair(client):
    """Returns (user1_id, user2_id, user1_creds, user2_creds)"""
    def _reg(username, email):
        payload = {"username": username, "email": email, "password": "secret123"}
        res = client.post("/api/register", json=payload)
        assert res.status_code == 201, res.get_json()
        return res.get_json()["userId"]

    u1_name = unique("profile1")
    u2_name = unique("profile2")
    u1_id = _reg(u1_name, f"{u1_name}@example.com")
    u2_id = _reg(u2_name, f"{u2_name}@example.com")
    return u1_id, u2_id, (u1_name, "secret123"), (u2_name, "secret123")


# Edit profile (about only)

def test_edit_profile_about(client, user_pair):
    user1, *_ = user_pair
    res = client.put(f"/api/profile/{user1}", json={"about": "I love cooking"})
    assert res.status_code == 200
    assert res.get_json()["profile"]["about"] == "I love cooking"

# Edit profile (upload profile image)

def test_edit_profile_image(client, user_pair):
    user1, *_ = user_pair
    file_obj = BytesIO(MIN_PNG)
    res = client.put(
        f"/api/profile/{user1}",
        data={"profileImage": (file_obj, "avatar.png")},
        content_type="multipart/form-data",
    )
    j = res.get_json()
    assert res.status_code == 200
    assert "profileImageUrl" in j["profile"]
    assert j["profile"]["profileImageUrl"].startswith("https://")

# Change password – success

def test_change_password_success(client, user_pair):
    user1, _, (uname, old_pw), _ = user_pair
    body = {"username": uname, "oldPassword": old_pw, "newPassword": "newSecret"}
    res = client.put(f"/api/profile/{user1}/password", json=body)
    assert res.status_code == 200
    assert res.get_json()["message"] == "Password changed successfully"

# Change password – wrong old password

def test_change_password_wrong_old(client, user_pair):
    user1, _, (uname, _), _ = user_pair
    body = {"username": uname, "oldPassword": "badpw", "newPassword": "x"}
    res = client.put(f"/api/profile/{user1}/password", json=body)
    assert res.status_code == 401
    assert res.get_json()["error"] == "Incorrect old password"

# Follow + Unfollow

def test_follow_and_unfollow(client, user_pair):
    user1, user2, *_ = user_pair

    # Follow
    body = {"currentUserId": user1, "targetUserId": user2}
    res = client.post("/api/profile/follow", json=body)
    assert res.status_code == 200
    assert user2 in res.get_json()["profile"]["following"]

    # Unfollow
    res2 = client.post("/api/profile/unfollow", json=body)
    assert res2.status_code == 200
    assert user2 not in res2.get_json()["profile"]["following"]

# Save + Unsave Post

def test_save_and_unsave_post(client, user_pair):
    user1, user2, *_ = user_pair

    # user1 creates a simple recipe (JSON)
    payload = {
        "userId": user1,
        "title": "Quick Soup",
        "description": "Test recipe",
    }
    c_res = client.post("/api/recipes", json=payload)
    assert c_res.status_code == 201
    post_id = c_res.get_json()["postId"]

    # user2 saves it
    save_body = {"userId": user2, "postId": post_id}
    res = client.post("/api/profile/savePost", json=save_body)
    assert res.status_code == 200
    assert post_id in res.get_json()["profile"]["savedPosts"]

    # user2 unsaves it
    res2 = client.post("/api/profile/unsavePost", json=save_body)
    assert res2.status_code == 200
    assert post_id not in res2.get_json()["profile"]["savedPosts"]

# Edit profile – user not found

def test_edit_profile_user_not_found(client):
    res = client.put("/api/profile/doesNotExist", json={"about": "x"})
    assert res.status_code == 404

# 8.  Follow – missing fields

def test_follow_missing_fields(client):
    res = client.post("/api/profile/follow", json={"currentUserId": "abc"})
    assert res.status_code == 400
    assert res.get_json()["error"] == "Missing user IDs"

# Test fetching userid from username

def test_get_user_by_username(client, user_pair):
    user1_id, _, (user1_username, _), _ = user_pair
    
    res = client.get(f"/api/profile/{user1_username }")
    assert res.status_code == 200

    data = res.get_json()
    assert data["username"] == user1_username
    assert "userId" in data
    assert data["userId"] == user1_id

def test_get_user_by_username_not_found(client):
    res = client.get("/api/user/profile/doesNotExist")
    assert res.status_code == 404
    assert res.get_json()["error"] == "User not found"