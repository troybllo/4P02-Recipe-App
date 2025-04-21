from flask import Blueprint
from ..controllers.profile import (
    edit_profile,
    change_password,
    follow_user_controller,
    unfollow_user_controller,
    save_post_controller,
    unsave_post_controller,
    fetch_user_by_username,
    is_following_controller,
    fetch_username_by_user_id,
    get_followers_controller,
    get_following_controller,
    batch_get_user_info_controller
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

@profile_blueprint.route('/profile/isFollowing', methods=['GET'])
def check_is_following():
    """Route that delegates to the controller"""
    return is_following_controller()

@profile_blueprint.route('/profile/<username>', methods=['GET'])
def get_user_by_username_route(username):
    """
    GET /api/profile/<username>
    - Get a user profile by username
    """
    return fetch_user_by_username(username)

@profile_blueprint.route('/profile/username', methods=['GET'])
def get_username_from_user_id_route():
    """
    GET /api/profile/username?userId=...
    - Get a username from a user ID
    """
    return fetch_username_by_user_id()

@profile_blueprint.route('/profile/followers/<user_id>', methods=['GET'])
def get_followers_route(user_id):
    """
    GET /api/profile/followers/<user_id>
    - Get a list of users who follow the specified user
    """
    return get_followers_controller(user_id)

@profile_blueprint.route('/profile/following/<user_id>', methods=['GET'])
def get_following_route(user_id):
    """
    GET /api/profile/following/<user_id>
    - Get a list of users that the specified user follows
    """
    return get_following_controller(user_id)

@profile_blueprint.route('/profile/batch-info', methods=['POST'])
def batch_get_user_info_route():
    """
    POST /api/profile/batch-info
    - Get basic information for multiple users in one request
    - Body: { "userIds": ["id1", "id2", ...] }
    """
    return batch_get_user_info_controller()