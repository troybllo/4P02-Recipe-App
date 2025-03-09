from werkzeug.security import generate_password_hash, check_password_hash
import re

class User:
    def __init__(self, username, email, password, country, preferences, friend_list, created_recipes):
        self.username = username
        self.password_hash = generate_password_hash(password)
        self.email = email
        self.country = country
        self.preferences = preferences
        self.friend_list = friend_list
        self.created_recipes = created_recipes

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    
    @staticmethod
    def validate_email(email):
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        return bool(re.match(pattern, email))
