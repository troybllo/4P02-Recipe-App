from flask import Blueprint, request, jsonify
from ..controllers.recipes import (
    create_recipe,
    get_recipe_global,   # <- this must exist
    update_recipe,
    delete_recipe,
    list_all_recipes,
    get_all_recipes,
)

<<<<<<< Updated upstream
recipes_blueprint = Blueprint("recipes", __name__)


=======

# Define the blueprint
recipes_blueprint = Blueprint("recipes", __name__)

# === POST: Create a new recipe ===
>>>>>>> Stashed changes
@recipes_blueprint.route("/recipes", methods=["POST"])
def create_recipe_route():
    return create_recipe()

<<<<<<< Updated upstream

=======
# === GET: Retrieve a recipe globally using postId ===
>>>>>>> Stashed changes
@recipes_blueprint.route("/recipes/<post_id>", methods=["GET"])
def get_recipe_route(post_id):
    return get_recipe_global(post_id)

<<<<<<< Updated upstream

=======
# === PUT: Update a recipe by postId ===
>>>>>>> Stashed changes
@recipes_blueprint.route("/recipes/<post_id>", methods=["PUT"])
def update_recipe_route(post_id):
    return update_recipe(post_id)

<<<<<<< Updated upstream

=======
# === DELETE: Delete a recipe by postId ===
>>>>>>> Stashed changes
@recipes_blueprint.route("/recipes/<post_id>", methods=["DELETE"])
def delete_recipe_route(post_id):
    return delete_recipe(post_id)

<<<<<<< Updated upstream

@recipes_blueprint.route("/recipes", methods=["GET"])
def list_recipes_route():
    # optional: read query params for filters if needed
    recipes = list_all_recipes()
    return jsonify({"recipes": recipes}), 200


@recipes_blueprint.route("/recipes", methods=["GET"])
def get_all_recipes_route():
    return get_all_recipes()

=======
# === GET: List all recipes or filter by userId ===
@recipes_blueprint.route("/recipes", methods=["GET"])
def list_recipes_route():
    user_id = request.args.get("userId")

    if user_id:
        from ..controllers.list_filtered_recipes_controller import list_recipes_by_user
        recipes = list_recipes_by_user(user_id)
        return jsonify({"recipes": recipes}), 200
    else:
        recipes = list_all_recipes()
        return jsonify({"recipes": recipes}), 200
>>>>>>> Stashed changes
