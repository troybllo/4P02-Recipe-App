from flask import Blueprint
from ..controllers.profile import (
    edit_profile,
    change_password,
    follow_user_controller,
    unfollow_user_controller,
    save_post_controller,
    unsave_post_controller
)

profile_blueprint = Blueprint('profile_features', __name__)

@profile_blueprint.route('/profile/<user_id>', methods=['PUT'])
def edit_profile_route(user_id):
    """
    PUT /api/profile/<user_id>
    - for editing user profile (bio, image, etc.)
    """
    return edit_profile(user_id)

@profile_blueprint.route('/profile/<user_id>/password', methods=['PUT'])
def change_password_route(user_id):
    """
    PUT /api/profile/<user_id>/password
    - for changing password
    """
    return change_password(user_id)

@profile_blueprint.route('/profile/follow', methods=['POST'])
def follow_user_route():
    """
    POST /api/profile/follow
    - { "currentUserId": "...", "targetUserId": "..." }
    """
    return follow_user_controller()

@profile_blueprint.route('/profile/unfollow', methods=['POST'])
def unfollow_user_route():
    """
    POST /api/profile/unfollow
    - { "currentUserId": "...", "targetUserId": "..." }
    """
    return unfollow_user_controller()

@profile_blueprint.route('/profile/savePost', methods=['POST'])
def save_post_route():
    """
    POST /api/profile/savePost
    - { "userId": "...", "postId": "..." }
    """
    return save_post_controller()

@profile_blueprint.route('/profile/unsavePost', methods=['POST'])
def unsave_post_route():
    """
    POST /api/profile/unsavePost
    - { "userId": "...", "postId": "..." }
    """
    return unsave_post_controller()
