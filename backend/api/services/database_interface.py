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
