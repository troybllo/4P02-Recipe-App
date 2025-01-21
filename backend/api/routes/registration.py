from flask import Blueprint
from ..controllers.registration import register_user

register_blueprint = Blueprint('register', __name__)

@register_blueprint.route('/register', methods=['POST'])
def register():
    """
    Endpoint to register a new user by adding them to Firestore.
    """
    return register_user()
