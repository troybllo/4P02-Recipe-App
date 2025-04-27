import types
import uuid
import pytest
from flask import Flask, jsonify
from datetime import datetime, timedelta

# a reusable Flask app – only for request-contexts
_app = Flask(__name__)

# helpers 
def _uid(prefix="x"):
    """Return a terse random string for ids, e.g. x_ac12ef."""
    return f"{prefix}_{uuid.uuid4().hex[:6]}"

@pytest.mark.parametrize(
    "wrapper_name, service_name",
    [
        ("list_most_liked_recipes", "get_most_liked_recipes"),
        ("get_recent_recipes",      "get_most_recent_recipes"),
        ("list_easy_recipes",       "get_easy_recipes"),
        ("list_quick_picks",        "get_quick_picks"),
    ],
)
def test_controller_list_wrappers(monkeypatch, wrapper_name, service_name):
    """
    Each list-style wrapper should:
      • call its backing service once
      • return 200 and the exact list from that service
    """
    dummy_list = [{"id": 1}]
    from backend.api import controllers as _pkg
    recipes_mod = _pkg.recipes

    # patch the underlying service fn to return `dummy_list`
    monkeypatch.setattr(recipes_mod, service_name, lambda **_: dummy_list)

    wrapper_fn = getattr(recipes_mod, wrapper_name)

    with _app.test_request_context():
        resp, status = wrapper_fn()
        assert status == 200
        assert resp.get_json()["recipes"] == dummy_list



@pytest.mark.parametrize(
    "route_name, helper_name, fake_json",
    [
        ("get_most_liked_recipes_route", "get_most_liked_recipes", {"recipes": []}),
        ("get_recent_recipes_route",     "get_recent_recipes",     {"recipes": [1]}),
        ("get_easy_recipes_route",       "list_easy_recipes",      {"recipes": [2]}),
        ("get_quick_picks_route",        "list_quick_picks",       {"recipes": [3]}),
    ],
)
def test_route_wrappers_delegate(monkeypatch, route_name, helper_name, fake_json):
    """
    Each “wrapper” in routes.recipes should simply forward the call
    to the helper it imported from controllers.recipes and return
    whatever that helper returns.

    We monkey-patch the **imported symbol inside the routes module**
    and make sure the wrapper forwards our canned Response unchanged.
    """
    from backend.api.routes import recipes as routes_mod
    from flask import jsonify

    # patch the helper *reference stored in the routes module*
    monkeypatch.setattr(
        routes_mod,
        helper_name,
        lambda **_: jsonify(fake_json),   # returns a Response (status_code 200)
    )

    wrapper_fn = getattr(routes_mod, route_name)

    with _app.test_request_context():
        response = wrapper_fn()               # routes fn returns Response
        assert response.status_code == 200
        assert response.get_json() == fake_json



def test_like_status_route(monkeypatch):
    """
    Verify /recipes/like-status delegates to get_recipe_from_firebase
    and builds the correct JSON response.

    Route returns (Response, status_code) → we unpack both.
    """
    from backend.api.routes import recipes as routes_mod
    from flask import jsonify

    owner, liker, post = _uid("own"), _uid("lik"), _uid("pid")

    # stub the imported helpers inside routes.recipes
    fake_doc = {"likedBy": [liker], "likes": 1}
    monkeypatch.setattr(
        routes_mod,
        "get_recipe_from_firebase",
        lambda o, p: fake_doc if (o, p) == (owner, post) else None,
    )
    # fallback (should not be reached in this test)
    monkeypatch.setattr(
        routes_mod,
        "get_recipe_global",
        lambda *_: (jsonify({"error": "not found"}), 404),
    )

    qs = f"ownerId={owner}&postId={post}&likerId={liker}"
    with _app.test_request_context(query_string=qs):
        resp, status = routes_mod.like_status_route()   # unpack tuple
        assert status == 200
        assert resp.get_json() == {"isLiked": True, "likeCount": 1}



def test__user_recipes_ref_builds_correct_path(monkeypatch):
    """
    Ensure the helper hits ‘users/<uid>/created_recipes’.
    We stub Firestore so no network call is made.
    """

    calls = []

    class _DummyDoc:
        def __init__(self, doc_id):
            self.doc_id = doc_id
        def collection(self, name):
            calls.append(("collection", name))
            return f"COLLECTION:{self.doc_id}/{name}"

    class _DummyCol:
        def __init__(self, name):
            self.name = name
        def document(self, doc_id):
            calls.append(("document", doc_id))
            return _DummyDoc(doc_id)

    class _DummyFS:
        def collection(self, name):
            calls.append(("collection_root", name))
            return _DummyCol(name)

    from backend.api.services import recipe_database as svc
    monkeypatch.setattr(svc, "firestore", types.SimpleNamespace(client=lambda: _DummyFS()))

    uid = _uid("fire")
    ref = svc._user_recipes_ref(uid)
    # path string isn't important; the recorded call order is.
    assert calls == [
        ("collection_root", "users"),
        ("document", uid),
        ("collection", "created_recipes"),
    ]


def test_delete_image_from_cloudinary(monkeypatch):
    """
    Verifies that the wrapper forwards the public_id to cloudinary.uploader.destroy.
    """
    captured = {}
    import backend.api.services.recipe_database as svc

    monkeypatch.setattr(
        svc.cloudinary.uploader,
        "destroy",
        lambda public_id: captured.setdefault("id", public_id),
    )

    pid = "img_123"
    svc.delete_image_from_cloudinary(pid)
    assert captured["id"] == pid


# helpers
def _uid(prefix="x"):
    return f"{prefix}_{uuid.uuid4().hex[:6]}"

def _ts(offset_days: int) -> str:
    """Return an ISO-timestamp offset ‘offset_days’ from now (negative = past)."""
    return (datetime.utcnow() + timedelta(days=offset_days)).isoformat()


# small Firestore stand-in
class _Snap:
    def __init__(self, doc_id, data):
        self.id = doc_id
        self._data = dict(data)

    @property
    def exists(self):
        return True

    def to_dict(self):
        return dict(self._data)


class _Collection:
    def __init__(self, docs=None):
        # `docs` is {id: data, …}
        self._docs = {doc_id: _Snap(doc_id, data) for doc_id, data in (docs or {}).items()}

    # behaves like `for d in collection_ref.stream():`
    def stream(self):
        return list(self._docs.values())

    def document(self, doc_id):
        # return a DocumentRef-like shim
        snap = self._docs.get(doc_id)
        return _DocRef(doc_id, snap)

class _DocRef:
    def __init__(self, doc_id, snap):
        self.id   = doc_id
        self._snap = snap                        

    # .get()
    def get(self):
        return self._snap or _EmptySnap()

    # .collection("created_recipes")
    def collection(self, _sub):
        return _Collection({})                    # default empty; overridden below

class _EmptySnap:
    exists = False
    def to_dict(self): return None


class _FakeDB:
    """
    Minimal hierarchy used by the recipe helpers:

        db.collection("users") -> Collection
        … .document(uid)       -> DocRef
        … .collection("created_recipes") -> Collection
    """
    def __init__(self, users):
        # users = {uid: {"doc": <data>, "recipes": {rid: <data>, …}}, …}
        self._users = users

    def collection(self, name):
        if name != "users":
            return _Collection()
        # build the user Collection lazily
        docs = {uid: data["doc"] for uid, data in self._users.items()}
        col  = _Collection(docs)

        # patch each user DocRef so .collection("created_recipes") works
        for uid, udata in self._users.items():
            recipes_col = _Collection(udata.get("recipes", {}))
            # monkey-patch a bound method returning this recipes_col
            def _col(self, sub, _col_inst=recipes_col):
                if sub == "created_recipes":
                    return _col_inst
                return _Collection()
            docref = col.document(uid)
            docref.collection = types.MethodType(_col, docref)     # type: ignore

        return col


@pytest.fixture
def fake_firestore(monkeypatch):
    """
    Provide recipe_database with an in-memory Firestore stub that works with
    *every* DocumentRef the code later creates.
    """
    from backend.api.services import recipe_database as rdb

    # sample data 
    u1, u2 = _uid("u1"), _uid("u2")
    data = {
        u1: {
            "doc": {"username": "alice"},
            "recipes": {
                "r1": {  # most-liked & easy & quick
                    "title": "A", "likes": 9, "difficulty": "easy",
                    "cookingTime": "20 mins", "datePosted": _ts(-1)
                },
                "r2": {  # newest
                    "title": "B", "likes": 3, "difficulty": "medium",
                    "cookingTime": "45 mins", "datePosted": _ts(0)
                },
            },
        },
        u2: {
            "doc": {"username": "bob"},
            "recipes": {
                "r3": {  # quick pick
                    "title": "C", "likes": 5, "difficulty": "Easy",
                    "cookingTime": "15 mins", "datePosted": _ts(-2)
                },
            },
        },
    }

    # Firestore shims 
    class Snap:
        def __init__(self, doc_id, payload): self.id, self._d = doc_id, payload
        @property
        def exists(self): return True
        def to_dict(self): return dict(self._d)

    class EmptySnap: exists = False; to_dict = lambda self: None  # type: ignore

    class Collection:
        def __init__(self, docs):          # docs: {id: payload}
            self._docs = {i: Snap(i, p) for i, p in docs.items()}

        def stream(self):
            return list(self._docs.values())

        def document(self, doc_id):
            # every new DocRef gets a dynamic .collection() when needed
            snap = self._docs.get(doc_id)
            return DocRef(doc_id, snap, parent_docs)

    class DocRef:
        def __init__(self, doc_id, snap, users_dict):
            self.id, self._snap, self._users = doc_id, snap, users_dict

        def get(self):  # noqa: D401  (simple method)
            return self._snap or EmptySnap()

        def collection(self, name):
            if name != "created_recipes":
                return Collection({})
            recipes = self._users[self.id]["recipes"]
            return Collection(recipes)

    # root .collection("users") behaviour
    parent_docs = data                           # shared into DocRef
    users_col   = Collection({uid: u["doc"] for uid, u in data.items()})
    fake_db     = types.SimpleNamespace(collection=lambda n: users_col if n=="users" else Collection({}))

    # monkey-patch firebase_admin.firestore.client()
    monkeypatch.setattr(rdb.firestore, "client", lambda: fake_db)

    yield data




def test__user_recipes_ref_returns_collection(fake_firestore):
    """
    _user_recipes_ref() should return a collection whose .stream()
    yields all recipe snapshots for that user.
    """
    from backend.api.services.recipe_database import _user_recipes_ref
    uid = next(iter(fake_firestore.keys()))
    col = _user_recipes_ref(uid)
    snap_ids = {snap.id for snap in col.stream()}
    assert snap_ids == set(fake_firestore[uid]["recipes"].keys())


def test_get_most_liked_recipes(fake_firestore):
    """
    Should return recipes sorted descending by likes.
    """
    from backend.api.services.recipe_database import get_most_liked_recipes
    out = get_most_liked_recipes()
    assert out[0]["likes"] >= out[1]["likes"]
    assert out[0]["likes"] == 9


def test_get_most_recent_recipes(fake_firestore):
    """
    Should return at most *limit* docs, newest first.
    """
    from backend.api.services.recipe_database import get_most_recent_recipes
    out = get_most_recent_recipes(limit=2)
    assert len(out) == 2
    dates = [r["datePosted"] for r in out]
    assert dates == sorted(dates, reverse=True) 


def test_get_easy_recipes(fake_firestore):
    from backend.api.services.recipe_database import get_easy_recipes
    out = get_easy_recipes()
    assert all(r["difficulty"].lower() == "easy" for r in out)
    assert {"r1"} <= {r["postId"] for r in out}


def test_get_quick_picks(fake_firestore):
    from backend.api.services.recipe_database import get_quick_picks
    out = get_quick_picks()
    mins = [int(r["cookingTime"].split()[0]) for r in out]
    assert all(m <= 30 for m in mins)
    assert mins == sorted(mins)


def test_get_editors_picks_by_category(fake_firestore, monkeypatch):
    """
    Patch EDITORS_PICKS so it points to one of our fake docs and
    confirm the helper returns it.
    """
    from backend.api.services import recipe_database as db
    uid, rid = next(iter(fake_firestore.items()))[0], "r1"
    monkeypatch.setattr(
        db, "EDITORS_PICKS",
        {"Featured": [{"userId": uid, "postId": rid}]},
        raising=False,
    )
    picks = db.get_editors_picks_by_category()
    assert picks["Featured"][0]["postId"] == rid


def test_get_recipe_global(fake_firestore):
    from backend.api.services.recipe_database import get_recipe_global
    any_uid = next(iter(fake_firestore.keys()))
    rid = next(iter(fake_firestore[any_uid]["recipes"].keys()))
    doc = get_recipe_global(rid)
    assert doc is not None
    assert doc["postId"] == rid

