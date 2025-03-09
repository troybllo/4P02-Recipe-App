import firebase_admin
from firebase_admin import firestore

def add_user_to_firebase(user_data):
    """
    Creates a new user doc in the 'users' collection with a random doc ID.
    Also stores that docRef's ID in the doc under 'userId'.
    """
    db = firestore.client()
    users_ref = db.collection('users')

    # Generate a new doc reference with a random ID
    doc_ref = users_ref.document()
    user_id = doc_ref.id  # The auto-generated doc ID

    # Add userId to the user_data dict so it's also stored in the doc
    user_data["userId"] = user_id

    # Write the doc to Firestore
    doc_ref.set(user_data)

    return {"message": "User added successfully", "userId": user_id}


def get_user_by_username(username):
    """
    Query Firestore for a user doc with the given 'username'.
    Returns the first match as a dict, or None if not found.
    """
    db = firestore.client()
    users_ref = db.collection('users').where('username', '==', username).limit(1)
    users = users_ref.stream()
    for user in users:
        return user.to_dict()
    return None

def get_user_by_email(email):
    """
    Query Firestore for a user doc with the given 'email'.
    Returns the first match as a dict, or None if not found.
    """
    db = firestore.client()
    users_ref = db.collection('users').where('email', '==', email).limit(1)
    users = users_ref.stream()
    for user in users:
        return user.to_dict()
    return None


def add_recipe_card_to_firebase(recipe_dict):
    """
    (Unchanged) Add a new recipe to Firestore's 'recipes' collection.
    If you decide to store them under users/<userId>/created_recipes, you'd modify here.
    """
    db = firestore.client()
    recipes_ref = db.collection("recipes")
    new_recipe_ref = recipes_ref.add(recipe_dict)
    return new_recipe_ref[1].id  # Return the ID of the newly created recipe
