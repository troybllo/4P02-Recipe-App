from flask import Blueprint, jsonify, request
from ..controllers.recipes import (
    create_recipe,
    get_recipe,
    update_recipe,
    delete_recipe,
    get_most_liked_recipes,
    get_recent_recipes,
)
from ..services.recipe_database import (
    filter_recipes_by_difficulties,
)

recipes_blueprint = Blueprint('recipes', __name__)

@recipes_blueprint.route('/recipes', methods=['POST'])
def create_recipe_route():
    return create_recipe()

@recipes_blueprint.route('/recipes/<post_id>', methods=['GET'])
def get_recipe_route(post_id):
    return get_recipe(post_id)

@recipes_blueprint.route('/recipes/most-liked', methods=['GET'])
def get_most_liked_recipes_route():
    return get_most_liked_recipes()

@recipes_blueprint.route('/recipes/most-recent', methods=['GET'])
def get_recent_recipes_route():
    return get_recent_recipes()

@recipes_blueprint.route('/recipes/filter', methods=['GET'])
def filter_recipes_route():
    levels = request.args.get("difficulties", "")
    difficulties = [d.strip().lower() for d in levels.split(",") if d]
    recipes = filter_recipes_by_difficulties(difficulties)
    return jsonify({"recipes": recipes}), 200

@recipes_blueprint.route('/recipes/<post_id>', methods=['PUT'])
def update_recipe_route(post_id):
    return update_recipe(post_id)

@recipes_blueprint.route('/recipes/<post_id>', methods=['DELETE'])
def delete_recipe_route(post_id):
    return delete_recipe(post_id)