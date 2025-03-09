import pytest
import uuid
from io import BytesIO

# Helper Functions

def unique_username(base="testuser"):
    """
    Generates a unique username by appending a random 8-character hex string.
    This avoids registration conflicts during testing.
    """
    return f"{base}_{uuid.uuid4().hex[:8]}"

# A minimal valid 1x1 PNG image in bytes.
# This is a known valid PNG header and data for a 1x1 pixel image.
MINIMAL_PNG = (
    b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR'
    b'\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00'
    b'\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc`\x00\x00\x00\x02'
    b'\x00\x01\xe2!\xbc\x33\x00\x00\x00\x00IEND\xaeB\x82'
)

# Test: Create Recipe

def test_create_recipe_success(client):
    """
    Test Flow:
      1. Register a new user and retrieve the unique userId.
      2. Create a new recipe (using multipart/form-data) for that user,
         including an image file.
    """
    # Step 1: Register a new user.
    reg_payload = {
        "username": unique_username("createRecipe"),  # Unique username
        "email": f"{uuid.uuid4().hex[:6]}@example.com", # Random email
        "password": "secret123"
    }
    # Send POST request to /api/register with JSON payload.
    reg_resp = client.post("/api/register", json=reg_payload)
    # Expect HTTP 201 Created.
    assert reg_resp.status_code == 201, reg_resp.get_json()
    # Extract userId from the response.
    reg_data = reg_resp.get_json()
    user_id = reg_data["user"]["userId"]

    # Step 2: Create a recipe using multipart/form-data.
    data = {
        "userId": user_id,  # Unique user identifier from registration.
        "title": "Chocolate Cake",
        "description": "A delicious chocolate cake recipe",
        "cookingTime": "45 min",
        "difficulty": "Medium",
        "servings": "8",
        "ingredients": "Flour, Sugar, Cocoa, Eggs",
        "instructions": "Mix and bake at 350F."
    }
    # Prepare an in-memory file object using the minimal PNG.
    file_data = BytesIO(MINIMAL_PNG)
    # Send POST request to /api/recipes with text fields and file.
    response = client.post(
        "/api/recipes",
        data={**data, "images": (file_data, "test_image.png")},
        content_type="multipart/form-data"
    )
    # Expect HTTP 201 Created.
    assert response.status_code == 201, response.get_json()
    resp_data = response.get_json()
    # Verify that a recipe postId is returned.
    assert "postId" in resp_data
    # Confirm the success message.
    assert resp_data["message"] == "Recipe created"

# Test: Get Recipe

def test_get_recipe_success(client):
    """
    Test Flow:
      1. Register a new user.
      2. Create a recipe (without image) for that user.
      3. Retrieve the recipe using GET with userId passed as query parameter.
    """
    # Register a new user.
    reg_payload = {
        "username": unique_username("getRecipe"),
        "email": f"{uuid.uuid4().hex[:6]}@example.com",
        "password": "secret123"
    }
    reg_resp = client.post("/api/register", json=reg_payload)
    assert reg_resp.status_code == 201, reg_resp.get_json()
    user_id = reg_resp.get_json()["user"]["userId"]

    # Create a recipe using JSON (no image uploaded).
    recipe_payload = {
        "userId": user_id,
        "title": "Test Pie",
        "description": "Just a test"
    }
    create_resp = client.post("/api/recipes", json=recipe_payload)
    assert create_resp.status_code == 201, create_resp.get_json()
    post_id = create_resp.get_json()["postId"]

    # Retrieve the recipe using GET.
    # Pass the userId as a query parameter so the endpoint can identify the user.
    get_resp = client.get(f"/api/recipes/{post_id}", query_string={"userId": user_id})
    # Expect HTTP 200 OK.
    assert get_resp.status_code == 200, get_resp.get_json()
    recipe_data = get_resp.get_json()
    # Verify that the returned recipe matches the created data.
    assert recipe_data["title"] == "Test Pie"
    assert recipe_data["description"] == "Just a test"

# Test: Update Recipe

def test_update_recipe_success(client):
    """
    Test Flow:
      1. Register a new user.
      2. Create a recipe with an initial title.
      3. Update the recipe: change the title and add an image.
    """
    # Register a new user.
    reg_payload = {
        "username": unique_username("updateRecipe"),
        "email": f"{uuid.uuid4().hex[:6]}@example.com",
        "password": "secret123"
    }
    reg_resp = client.post("/api/register", json=reg_payload)
    assert reg_resp.status_code == 201, reg_resp.get_json()
    user_id = reg_resp.get_json()["user"]["userId"]

    # Create a recipe with an initial title.
    recipe_payload = {
        "userId": user_id,
        "title": "Old Title"
    }
    create_resp = client.post("/api/recipes", json=recipe_payload)
    assert create_resp.status_code == 201, create_resp.get_json()
    post_id = create_resp.get_json()["postId"]

    # Prepare new title and an in-memory valid PNG image for update.
    new_title = "New Title"
    file_data = BytesIO(MINIMAL_PNG)
    # Send PUT request to update the recipe.
    update_resp = client.put(
        f"/api/recipes/{post_id}",
        data={
            "userId": user_id,
            "title": new_title,
            "images": (file_data, "update_image.png")
        },
        content_type="multipart/form-data"
    )
    # Expect HTTP 200 OK.
    assert update_resp.status_code == 200, update_resp.get_json()
    updated_recipe = update_resp.get_json()["recipe"]
    # Verify that the title has been updated.
    assert updated_recipe["title"] == new_title
    # Confirm that the updated recipe now contains an image list.
    assert "imageList" in updated_recipe
    assert len(updated_recipe["imageList"]) > 0

# Test: Delete Recipe

def test_delete_recipe_success(client):
    """
    Test Flow:
      1. Register a new user.
      2. Create a recipe for that user.
      3. Delete the recipe.
      4. Confirm that a GET request for that recipe returns a 404.
    """
    # Register a new user.
    reg_payload = {
        "username": unique_username("deleteRecipe"),
        "email": f"{uuid.uuid4().hex[:6]}@example.com",
        "password": "secret123"
    }
    reg_resp = client.post("/api/register", json=reg_payload)
    assert reg_resp.status_code == 201, reg_resp.get_json()
    user_id = reg_resp.get_json()["user"]["userId"]

    # Create a recipe.
    recipe_payload = {
        "userId": user_id,
        "title": "Disposable Recipe"
    }
    create_resp = client.post("/api/recipes", json=recipe_payload)
    assert create_resp.status_code == 201, create_resp.get_json()
    post_id = create_resp.get_json()["postId"]

    # Delete the recipe using DELETE.
    # We send the userId as a query parameter.
    delete_resp = client.delete(f"/api/recipes/{post_id}", query_string={"userId": user_id})
    assert delete_resp.status_code == 200, delete_resp.get_json()
    assert delete_resp.get_json()["message"] == "Recipe deleted"

    # Confirm that a GET for this recipe now returns a 404.
    get_resp = client.get(f"/api/recipes/{post_id}", query_string={"userId": user_id})
    assert get_resp.status_code == 404, get_resp.get_json()
