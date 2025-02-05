import firebase_admin
from firebase_admin import firestore

def add_user_to_firebase(user_data):
    
    db = firestore.client()
    users_ref = db.collection('users')

    # If you want the doc ID to be the 'username':
    doc_ref = users_ref.document(user_data['username'])
    doc_ref.set(user_data)

    return {"message": "User added successfully"}


def get_user_by_username(username):
    db = firestore.client()
    users_ref = db.collection('users').where('username', '==', username).limit(1)
    users = users_ref.stream()
    for user in users:
        return user.to_dict()
    return None

def get_user_by_email(email):
    db = firestore.client()
    users_ref = db.collection('users').where('email', '==', email).limit(1)
    users = users_ref.stream()
    for user in users:
        return user.to_dict()
    return None



def add_recipe_card_to_firebase(recipe_dict):

    """
    Add a new recipe to Firestore.
    """
    recipes_ref = db.collection("recipes")
    new_recipe_ref = recipes_ref.add(recipe_dict)
    return new_recipe_ref[1].id  # Return the ID of the newly created recipe