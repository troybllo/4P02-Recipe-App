from flask import Blueprint, jsonify, request
from ..controllers.recipes import (
    create_recipe,
    get_recipe,
    update_recipe,
    delete_recipe,
    get_most_liked_recipes,
    get_recent_recipes,
    list_easy_recipes,
    list_quick_picks,
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

@recipes_blueprint.route('/recipes/easy-recipes', methods=['GET'])
def get_easy_recipes_route():
    return list_easy_recipes()

@recipes_blueprint.route('/recipes/quick-picks', methods=['GET'])
def get_quick_picks_route():
    return list_quick_picks()

@recipes_blueprint.route("/recipes/<post_id>", methods=["PUT"])
def update_recipe_route(post_id):
    return update_recipe(post_id)


@recipes_blueprint.route("/recipes/<post_id>", methods=["DELETE"])
def delete_recipe_route(post_id):
    return delete_recipe(post_id)

