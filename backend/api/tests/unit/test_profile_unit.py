import uuid
import pytest
from flask import Flask
import importlib

def _uid(prefix="u"):
    return f"{prefix}_{uuid.uuid4().hex[:6]}"

def _fake_user_doc(uid, *, following=None, followers=None, saved=None):
    return {
        "userId": uid,
        "username": f"name_{uid}",
        "profileImageUrl": f"https://img/{uid}.png",
        "following":  following  or [],
        "followers":  followers  or [],
        "savedPosts": saved      or [],
    }

_app = Flask(__name__)                 # single dummy Flask app for ctx mgr

@pytest.fixture(autouse=True)
def _stubs(monkeypatch):
    users: dict[str, dict] = {}
    recipes: set[str]      = set()

    # stand-ins 
    def _get_user_by_id(uid):           return users.get(uid)
    def _recipe_global(pid):            return {"dummy": "ok"} if pid in recipes else None
    def _save_post(uid, pid):
        usr = users.get(uid)
        if not usr: return None
        usr.setdefault("savedPosts", []).append(pid); return usr
    def _unsave_post(uid, pid):
        usr = users.get(uid)
        if not usr: return None
        usr.setdefault("savedPosts", []).remove(pid); return usr
    def _get_following_feed(uid):       return [{"authorId": f"friend_of_{uid}"}]
    def _get_suggested(uid, limit=5):   return [{"userId": f"sug{i}"} for i in range(limit)]
    def _users_by_query(q):
        return [{"userId": u["userId"], "username": u["username"], "profileImageUrl": u["profileImageUrl"]}
                for u in users.values() if q.lower() in u["username"].lower()]

    # patch *controller* attrs imported at module-level 
    prof = importlib.import_module("backend.api.controllers.profile")
    monkeypatch.setattr(prof, "get_user_by_id",    _get_user_by_id)
    monkeypatch.setattr(prof, "get_recipe_global", _recipe_global)
    monkeypatch.setattr(prof, "save_post",         _save_post)
    monkeypatch.setattr(prof, "unsave_post",       _unsave_post)

    # patch helpers that the controller imports lazily 
    svc_prof = importlib.import_module("backend.api.services.profile_database")
    monkeypatch.setattr(svc_prof, "get_following_feed",  _get_following_feed)
    monkeypatch.setattr(svc_prof, "get_suggested_users", _get_suggested)
    monkeypatch.setattr(svc_prof, "get_users_by_query",  _users_by_query)

    yield users, recipes


def test_save_post_success(_stubs):
    users, recipes = _stubs
    uid, pid = _uid("u"), _uid("p")
    users[uid] = _fake_user_doc(uid)
    recipes.add(pid)

    from backend.api.controllers.profile import save_post_controller
    with _app.test_request_context(json={"userId": uid, "postId": pid}):
        resp, status = save_post_controller()
        assert status == 200
        assert pid in users[uid]["savedPosts"]


@pytest.mark.parametrize(
    "body, expected",
    [({}, 400), ({"userId": "u"}, 400), ({"postId": "p"}, 400)],
)
def test_save_post_missing_fields(body, expected):
    from backend.api.controllers.profile import save_post_controller
    with _app.test_request_context(json=body):
        _, status = save_post_controller()
        assert status == expected


def test_save_post_recipe_not_found(_stubs):
    users, _ = _stubs
    uid, pid = _uid("u"), _uid("p")
    users[uid] = _fake_user_doc(uid)

    from backend.api.controllers.profile import save_post_controller
    with _app.test_request_context(json={"userId": uid, "postId": pid}):
        resp, status = save_post_controller()
        assert status == 404
        assert resp.get_json()["error"] == "Recipe not found"


def test_unsave_post_success(_stubs):
    users, recipes = _stubs
    uid, pid = _uid("u"), _uid("p")
    users[uid] = _fake_user_doc(uid, saved=[pid])
    recipes.add(pid)

    from backend.api.controllers.profile import unsave_post_controller
    with _app.test_request_context(json={"userId": uid, "postId": pid}):
        _, status = unsave_post_controller()
        assert status == 200
        assert pid not in users[uid]["savedPosts"]


@pytest.mark.parametrize("is_following_expected", [True, False])
def test_is_following_controller(_stubs, is_following_expected):
    users, _ = _stubs
    cur, tgt = _uid("cur"), _uid("tgt")
    users[cur] = _fake_user_doc(cur, following=[tgt] if is_following_expected else [])
    users[tgt] = _fake_user_doc(tgt)

    from backend.api.controllers.profile import is_following_controller
    with _app.test_request_context(query_string=f"userId={cur}&targetId={tgt}"):
        resp, status = is_following_controller()
        assert status == 200
        assert resp.get_json()["isFollowing"] is is_following_expected

def test_get_following_feed_controller(_stubs):
    users, _ = _stubs
    uid = _uid("viewer")
    users[uid] = _fake_user_doc(uid)

    from backend.api.controllers.profile import get_following_feed_controller
    with _app.test_request_context():
        resp, status = get_following_feed_controller(uid)
        assert status == 200
        assert resp.get_json()["recipes"][0]["authorId"] == f"friend_of_{uid}"


def test_fetch_username_by_user_id(_stubs):
    users, _ = _stubs
    uid = _uid("u")
    users[uid] = _fake_user_doc(uid)

    from backend.api.controllers.profile import fetch_username_by_user_id
    with _app.test_request_context(query_string=f"userId={uid}"):
        resp, status = fetch_username_by_user_id()
        assert status == 200 and resp.get_json()["userId"] == uid


def test_get_followers_controller(_stubs):
    users, _ = _stubs
    me, fol = _uid("me"), _uid("fol")
    users[me]  = _fake_user_doc(me,  followers=[fol])
    users[fol] = _fake_user_doc(fol)

    from backend.api.controllers.profile import get_followers_controller
    with _app.test_request_context():
        resp, status = get_followers_controller(me)
        assert status == 200 and resp.get_json()["users"][0]["userId"] == fol


def test_get_following_controller(_stubs):
    users, _ = _stubs
    me, tgt = _uid("me"), _uid("tgt")
    users[me]  = _fake_user_doc(me, following=[tgt])
    users[tgt] = _fake_user_doc(tgt)

    from backend.api.controllers.profile import get_following_controller
    with _app.test_request_context():
        resp, status = get_following_controller(me)
        assert status == 200 and resp.get_json()["users"][0]["userId"] == tgt


def test_batch_get_user_info_controller(_stubs):
    users, _ = _stubs
    u1, u2 = _uid("a"), _uid("b")
    users[u1] = _fake_user_doc(u1); users[u2] = _fake_user_doc(u2)

    from backend.api.controllers.profile import batch_get_user_info_controller
    with _app.test_request_context(json={"userIds": [u1, u2]}):
        resp, status = batch_get_user_info_controller()
        assert status == 200 and sorted([u["userId"] for u in resp.get_json()["users"]]) == sorted([u1, u2])


def test_suggested_users_controller(_stubs):
    users, _ = _stubs
    uid = _uid("me"); users[uid] = _fake_user_doc(uid)

    from backend.api.controllers.profile import suggested_users_controller
    with _app.test_request_context():
        resp, status = suggested_users_controller(uid)
        assert status == 200 and len(resp.get_json()["users"]) == 5


def test_search_users(_stubs):
    users, _ = _stubs
    uid = _uid("bob")

    # create minimal doc then add username field 
    users[uid] = _fake_user_doc(uid)
    users[uid]["username"] = "BobbyTables"


import inspect
import importlib
from flask import jsonify
from backend.api.tests.unit.test_profile_unit import _app

def _assert_route_delegates(route_func, attr_name):
    """
    Ensure thin wrappers in routes/profile.py delegate to the controller
    function with the same name.  Supports wrappers that take 0 or 1 path-arg.
    """
    called = {"flag": False}

    def _fake(*_a, **_kw):
        called["flag"] = True
        return jsonify(ok=True), 200

    routes = importlib.import_module("backend.api.routes.profile")
    ctrl   = importlib.import_module("backend.api.controllers.profile")

    setattr(routes, attr_name, _fake)
    setattr(ctrl,   attr_name, _fake)

    params = inspect.signature(route_func).parameters

    # invoke wrapper inside app-context so jsonify works
    with _app.app_context():
        if len(params) == 0:
            route_func()
        elif len(params) == 1:
            route_func("x")      # supply dummy user_id / username
        else:
            raise RuntimeError("helper supports only 0- or 1-arg wrappers")

    assert called["flag"] is True


def test_route_wrappers_delegate():
    from backend.api.routes import profile as routes
    _assert_route_delegates(routes.check_is_following,             "is_following_controller")
    _assert_route_delegates(routes.get_username_from_user_id_route,"fetch_username_by_user_id")
    _assert_route_delegates(routes.get_followers_route,            "get_followers_controller")
    _assert_route_delegates(routes.get_following_route,            "get_following_controller")
    _assert_route_delegates(routes.batch_get_user_info_route,      "batch_get_user_info_controller")
    _assert_route_delegates(routes.get_following_feed_route,       "get_following_feed_controller")
    _assert_route_delegates(routes.get_suggested_users_route,      "suggested_users_controller")
    _assert_route_delegates(routes.search_users_route,             "search_users")

import types, importlib, datetime as _dt, pytest

# tiny Firestore stand-ins 
class _Snap:
    def __init__(self, doc_id, payload):
        self.id, self._d = doc_id, payload

    # make snapshots look “existent” to the helper code
    @property
    def exists(self) -> bool:
        return True

    def to_dict(self):
        return dict(self._d)


class _UserSnap(_Snap):
    """Identical to _Snap – a named subclass makes the intent explicit."""
    pass

class _DocRef:
    """
    Represents users/<uid> in Firestore.  Supplies:
      • .get()               → _UserSnap
      • .collection("created_recipes") → _Collection of recipe docs
    """
    def __init__(self, snap: _UserSnap, recipes: dict):
        self._snap = snap
        self._recipes = recipes              # dict[recipeId → dict]

    def get(self):                  # users/<uid>.get()
        return self._snap

    def collection(self, name: str):
        if name != "created_recipes":
            return _Collection({})
        snaps = {rid: _Snap(rid, rec) for rid, rec in self._recipes.items()}
        return _Collection(snaps)

    @property                       # helpers sometimes check .exists
    def exists(self) -> bool:
        return True

    def to_dict(self) -> dict:      # parity with real DocumentSnapshot
        return self._snap.to_dict()

    id = property(                  # a handful of helpers access .id
        lambda self: self._snap.id
    )


class _Collection:
    """Simple mapping id → _Snap.  Only the subset needed by helpers."""
    def __init__(self, docs: dict[str, _Snap]):
        self._docs = docs                        # id → _Snap

    # for helpers that call .document(id).get()
    def document(self, doc_id: str):
        snap = self._docs.get(doc_id)
        return _DocRef(snap, {}) if snap else _EmptyRef()

    # iterable of snapshots
    def stream(self):
        return list(self._docs.values())

    # we don’t enforce .limit(n); just return self to keep the chain alive
    def limit(self, *_):
        return self

class _UsersCollection(_Collection):
    """
    Top-level “users” collection:
      • .stream() must yield _UserSnap so helpers can access .id
      • .document(uid) returns a _DocRef (inherits from _Collection)
    """
    def __init__(self, user_snaps: dict[str, _UserSnap], recipes_map: dict):
        super().__init__({uid: _DocRef(snap, recipes_map[uid])
                          for uid, snap in user_snaps.items()})
        self._snaps = user_snaps                 # preserve raw snaps too

    def stream(self):
        return list(self._snaps.values())

class _EmptyRef:
    """Returned when a document does **not** exist."""
    def get(self):
        return types.SimpleNamespace(exists=False)

@pytest.fixture
def _firestore_stub(monkeypatch):
    """
    Build an in-memory Firestore layout:

      * u1 follows u2
      * u2 owns one “easy / 15 mins” recipe dated yesterday
      * u3 is another random user (for suggestions & query)
    """
    today = _dt.datetime.utcnow()
    iso   = lambda d: d.isoformat(timespec="seconds")

    u1, u2, u3 = _uid("u1"), _uid("u2"), _uid("u3")

    # user docs
    users_payload = {
        u1: {"userId": u1, "username": "Alice",   "following": [u2], "followers": []},
        u2: {"userId": u2, "username": "Bob",     "following": [],   "followers": [u1]},
        u3: {"userId": u3, "username": "Charlie", "following": [],   "followers": []},
    }

    # recipes per user 
    recipes_map = {
        u1: {},        # no recipes
        u2: {
            "rSoup": {
                "title":       "Bob’s Soup",
                "datePosted":  iso(today - _dt.timedelta(days=1)),
                "difficulty":  "Easy",
                "cookingTime": "15 mins",
                "likes":       10,
            }
        },
        u3: {},
    }

    # convert to snapshots / docs
    user_snaps = {uid: _UserSnap(uid, payload) for uid, payload in users_payload.items()}
    users_col  = _UsersCollection(user_snaps, recipes_map)

    # fake Firestore db
    fake_db = types.SimpleNamespace(
        collection=lambda name: users_col if name == "users" else _Collection({})
    )

    # patch the real module’s firestore.client()
    pdb = importlib.reload(importlib.import_module("backend.api.services.profile_database"))
    monkeypatch.setattr(pdb, "firestore", types.SimpleNamespace(client=lambda: fake_db))

    return pdb, {"u1": u1, "u2": u2, "u3": u3}

def test_service_get_following_feed(_firestore_stub):
    pdb, ids = _firestore_stub
    feed = pdb.get_following_feed(ids["u1"])
    assert len(feed) == 1
    assert feed[0]["authorId"] == ids["u2"]
    assert feed[0]["difficulty"].lower() == "easy"

def test_service_get_suggested_users(_firestore_stub):
    pdb, ids = _firestore_stub
    sug = pdb.get_suggested_users(ids["u1"], limit=5)
    returned_ids = {u["userId"] for u in sug}
    # u1 follows u2; neither should appear
    assert ids["u1"] not in returned_ids and ids["u2"] not in returned_ids
    # Charlie must be suggested
    assert ids["u3"] in returned_ids

def test_service_get_users_by_query(_firestore_stub):
    pdb, ids = _firestore_stub
    res = pdb.get_users_by_query("char")         # matches “Charlie”
    assert len(res) == 1
    assert res[0]["userId"] == ids["u3"]
