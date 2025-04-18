from flask import Blueprint, request, jsonify
from ..controllers.recipes import (
    create_recipe,
    get_recipe,
    update_recipe,
    delete_recipe,
    list_all_recipes
)
from ..controllers.list_filtered_recipes_controller import list_recipes_by_user

recipes_blueprint = Blueprint('recipes', __name__)

@recipes_blueprint.route('/recipes', methods=['POST'])
def create_recipe_route():
    return create_recipe()

@recipes_blueprint.route('/recipes/<post_id>', methods=['GET'])
def get_recipe_route(post_id):
    return get_recipe(post_id)

@recipes_blueprint.route('/recipes/<post_id>', methods=['PUT'])
def update_recipe_route(post_id):
    return update_recipe(post_id)

@recipes_blueprint.route('/recipes/<post_id>', methods=['DELETE'])
def delete_recipe_route(post_id):
    return delete_recipe(post_id)

@recipes_blueprint.route('/recipes', methods=['GET'])
def list_recipes_route():
    user_id = request.args.get('userId')

    if user_id:
        recipes = list_recipes_by_user(user_id)
        return jsonify({"recipes": recipes}), 200
    else:
        # fallback to full list if userId isn't passed
        recipes = list_all_recipes()
        return jsonify({"recipes": recipes}), 200
