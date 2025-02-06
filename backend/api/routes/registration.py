from flask import Blueprint
from ..controllers.registration import register_user

register_blueprint = Blueprint("register", __name__)


@register_blueprint.route("/register", methods=["POST"])
def register():
    return register_user()
