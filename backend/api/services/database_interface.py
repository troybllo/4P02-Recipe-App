import firebase_admin
from firebase_admin import firestore

def add_user_to_firebase(user_data):
    db = firestore.client()
    users_ref = db.collection('users')
    
    
    doc_ref = users_ref.document(user_data['username'])
    doc_ref.set(user_data)

    return {"message": "User added successfully"}


def get_user_by_username(username):
    """
    Query Firestore for a user document with a matching username.
    Returns the first match or None if not found.
    """
    db = firestore.client()
    users_ref = db.collection('users').where('username', '==', username).limit(1)
    users = users_ref.stream()
    for user in users:
        return user.to_dict()
    return None
