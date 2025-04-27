import types
import uuid
import pytest

def _fake_user(username: str, ok_password_hash: str = "hash") -> dict:
    """Return a minimal Firestore-like user document."""
    return {
        "username": username,
        "password_hash": ok_password_hash,
        "userId": f"id_{uuid.uuid4().hex[:6]}",
    }

@pytest.mark.parametrize(
    "username,password,expected_status,expected_error",
    [
        (None,      "pw", 400, "Missing username or password"),  # missing user
        ("user",    None, 400, "Missing username or password"),  # missing pw
    ],
)
def test_auth_missing_fields(monkeypatch, username, password,
                             expected_status, expected_error):
    """authenticate_user should short-circuit when params are missing."""
    from backend.api.controllers.login import authenticate_user
    token, status, err, _ = authenticate_user(username, password)

    assert token is None
    assert status == expected_status
    assert err.startswith(expected_error)


def test_auth_user_not_found(monkeypatch):
    """Returns 401 when no document is returned for the username."""
    from backend.api.controllers import login

    # monkeypatch dependencies 
    monkeypatch.setattr(
        login, "get_user_by_username", lambda u: None
    )

    # password hash checker is never reached, but we stub it anyway
    monkeypatch.setattr(login, "check_password_hash",
                        lambda _hash, pw: False)

    token, status, err, _ = login.authenticate_user("ghost", "pw!")

    assert token is None
    assert status == 401
    assert err == "Invalid credentials"


def test_auth_bad_password(monkeypatch):
    """401 when check_password_hash returns False."""
    from backend.api.controllers import login

    monkeypatch.setattr(
        login, "get_user_by_username",
        lambda u: _fake_user(u)
    )
    monkeypatch.setattr(
        login, "check_password_hash",
        lambda _hash, pw: False  # force mismatch
    )

    token, status, err, _ = login.authenticate_user("bob", "wrong")

    assert token is None
    assert status == 401
    assert err == "Invalid credentials"


def test_auth_success(monkeypatch):
    """Happy-path: correct creds → custom token + user doc returned."""
    from backend.api.controllers import login

 
    user_doc = _fake_user("alice")
    monkeypatch.setattr(
        login, "get_user_by_username",
        lambda u: user_doc
    )

    monkeypatch.setattr(
        login, "check_password_hash",
        lambda _hash, pw: True
    )

    fake_token_bytes = b"FAKE_TOKEN"
    fake_auth_module = types.SimpleNamespace(
        create_custom_token=lambda uid: fake_token_bytes
    )
    monkeypatch.setattr(login, "auth", fake_auth_module)

    token, status, err, doc = login.authenticate_user("alice", "secret")

    assert status == 200
    assert err is None
    assert token == fake_token_bytes          # raw bytes
    assert doc == user_doc
