import firebase_admin
from firebase_admin import firestore

def add_user_to_firebase(user_data):
    db = firestore.client()
    users_ref = db.collection('users')
    users_ref.add(user_data)
    return {"message": "User added successfully"}

def get_user_by_username(username):
    db = firestore.client()
    users_ref = db.collection('users').where('username', '==', username).limit(1)
    users = users_ref.stream()
    for user in users:
        return user.to_dict()  # Assumes a single match due to 'limit(1)'
    return None
