from flask import Blueprint
from ..controllers.recipes import (
    create_recipe,
    get_recipe,
    get_recipe_global,
    update_recipe,
    delete_recipe,
    get_most_liked_recipes,
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

@recipes_blueprint.route('/recipes/<post_id>', methods=['PUT'])
def update_recipe_route(post_id):
    return update_recipe(post_id)

@recipes_blueprint.route('/recipes/<post_id>', methods=['DELETE'])
def delete_recipe_route(post_id):
    return delete_recipe(post_id)

@recipes_blueprint.route("/recipes", methods=["GET"])
def list_recipes_route():
    return list_all_recipes()

