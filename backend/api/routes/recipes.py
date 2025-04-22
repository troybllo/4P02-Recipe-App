from flask import Blueprint, request, jsonify
from ..controllers.recipes import (
    create_recipe,
    get_recipe,
    update_recipe,
    delete_recipe,
    get_most_liked_recipes,
    get_recent_recipes,
    list_easy_recipes,
    list_quick_picks,
    like_recipe_controller,
    unlike_recipe_controller,
    get_recipe_global,
    get_recipe_from_firebase,
)

recipes_blueprint = Blueprint("recipes", __name__)

@recipes_blueprint.route("/recipes", methods=["POST"])
def create_recipe_route():
    return create_recipe()

@recipes_blueprint.route("/recipes/<post_id>", methods=["GET"])
def get_recipe_route(post_id):
    return get_recipe(post_id)

@recipes_blueprint.route("/recipes/most-liked", methods=["GET"])
def get_most_liked_recipes_route():
    return get_most_liked_recipes()

@recipes_blueprint.route("/recipes/most-recent", methods=["GET"])
def get_recent_recipes_route():
    return get_recent_recipes()

@recipes_blueprint.route("/recipes/easy-recipes", methods=["GET"])
def get_easy_recipes_route():
    return list_easy_recipes()

@recipes_blueprint.route("/recipes/quick-picks", methods=["GET"])
def get_quick_picks_route():
    return list_quick_picks()

@recipes_blueprint.route("/recipes/<post_id>", methods=["PUT"])
def update_recipe_route(post_id):
    return update_recipe(post_id)

@recipes_blueprint.route("/recipes/<post_id>", methods=["DELETE"])
def delete_recipe_route(post_id):
    return delete_recipe(post_id)

@recipes_blueprint.route("/recipes/like", methods=["POST"])
def like_route():
    return like_recipe_controller()

@recipes_blueprint.route("/recipes/unlike", methods=["POST"])
def unlike_route():
    return unlike_recipe_controller()


@recipes_blueprint.route("/recipes/like-status", methods=["GET"])
def like_status_route():
    owner_id = request.args.get("ownerId")
    post_id  = request.args.get("postId")
    liker_id = request.args.get("likerId")
    if not all([owner_id, post_id, liker_id]):
        return jsonify({"error": "Missing ownerId, postId, or likerId"}), 400

    # fetch the per-user doc first
    doc = get_recipe_from_firebase(owner_id, post_id)
    if not doc:
        # fallback to global scan
        resp, code = get_recipe_global(post_id)
        if code != 200:
            return resp, code
        doc = resp.get_json()

    liked_by   = doc.get("likedBy", [])
    like_count = doc.get("likes", len(liked_by))

    return jsonify({
        "isLiked":   liker_id in liked_by,
        "likeCount": like_count,
    }), 200