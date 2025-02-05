from flask import jsonify
from werkzeug.utils import secure_filename
from google.cloud import storage

class CompleteRecipe:
    def __init__(self, recipe_name, tags, image, rating, author_id, card_id, created_at, updated_at):
        self.recipe_name = recipe_name
        self.tags = tags
        self.image = image
        self.rating = rating
        self.author_id = author_id
        self.card_id = card_id
        self.created_at = created_at
        self.updated_at = updated_at
    
    def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

    def handle_image_upload(image_file):
    """
    Handle image upload and validation.
    Returns:
        - On success: The public URL of the uploaded image.
        - On error: A tuple containing (error_message, status_code).
    """
    # Check if the file is empty
    if image_file.filename == '':
        return jsonify({"error": "No selected file."}), 400

    # Check if the file type is allowed
    if not allowed_file(image_file.filename):
        return jsonify({"error": "File type not allowed. Allowed types: png, jpg, jpeg, gif."}), 400

    # Secure the filename
    filename = secure_filename(image_file.filename)

    # Upload the image to Firebase Storage
    try:
        bucket = storage.bucket()  # Get the default Firebase Storage bucket
        blob = bucket.blob(f"recipe_images/{filename}")  # Store in a 'recipe_images' folder
        blob.upload_from_file(image_file, content_type=image_file.content_type)
        blob.make_public()  # Make the file publicly accessible
        image_url = blob.public_url  # Get the public URL of the uploaded file
        return image_url
    except Exception as e:
        return jsonify({"error": f"Failed to upload image: {str(e)}"}), 500


