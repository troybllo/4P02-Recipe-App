from api import create_app
from flask_cors import CORS

app = create_app()

# Enable CORS for the app, allowing requests from localhost:3000 (React dev server)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

if __name__ == '__main__':
    app.run(debug=True)
