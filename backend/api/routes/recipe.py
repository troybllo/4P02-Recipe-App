from flask import Blueprint, request, jsonify
from ..controllers.create_recipe import create_recipe

login_blueprint = Blueprint('recipe', __name__)

@create_recipe_blueprint.route('/recipe', methods=['POST'])
def create_recipe():
    return create_recipe()
