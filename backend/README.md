# Backend Documentation for 4P02-Recipe-App

## API

The `api` directory manages all backend API-related modules, including request handling and interactions with external services like Firebase.

### Initializations

- **api/**init**.py**: Initializes the Flask application with API routing configurations.

### Routes

- **api/routes**: Defines URL routes for API endpoints.

### Models

- **api/models**: Contains data models that define the structure of the application data.

### Controllers

- **api/controllers**: Manages request handling and response preparation.
  - **recipe_operations.py**: Manages recipe creation, updates, and deletion.
  - **recipe_sharing.py**: Handles functionalities related to recipe sharing.

### Services

- **api/services**: Provides utility functions and manages database interactions.
  - **database_interface.py**: Manages operations with the Firebase database.

### Tests

- **api/tests**: Contains tests for backend functionality.
  - **test_recipe_operations.py**: Tests recipe management operations.
  - **test_recipe_sharing.py**: Tests recipe sharing functionalities.

## Configuration and Startup

- **config.py**: Stores configuration settings like API keys and database URLs.
- **start_server.py**: Entry point for running the Flask server.
