from flask import Flask, render_template, request, jsonify
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from tensorflow import keras
import os

app = Flask(__name__)

# Global variable to store the loaded model
model = None

def load_model():
    """
    Load the trained CNN model once at startup
    """
    global model
    model_path = os.path.join(os.path.dirname(__file__), 'digit_model.h5')
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found at {model_path}. "
            "Please run train_model.py first to train and save the model."
        )
    
    print(f"Loading model from {model_path}...")
    model = keras.models.load_model(model_path)
    print("Model loaded successfully!")
    return model

def preprocess_canvas_image(image_data):
    """
    Convert canvas image data to MNIST format (28x28 grayscale)
    """
    try:
        # Convert base64 image data to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to grayscale
        image = image.convert('L')
        
        # Resize to 28x28 (MNIST format)
        image = image.resize((28, 28), Image.Resampling.LANCZOS)
        
        # Convert to numpy array
        image_array = np.array(image)
        
        # Normalize pixel values to [0, 1]
        image_array = image_array.astype('float32') / 255.0
        
        # Invert colors if needed (MNIST has white digits on black background)
        # Canvas typically has black digits on white background
        image_array = 1.0 - image_array
        
        # Add channel dimension (28, 28, 1)
        image_array = np.expand_dims(image_array, axis=-1)
        
        # Add batch dimension (1, 28, 28, 1)
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")

@app.route('/')
def index():
    """
    Render the main page with the drawing canvas
    """
    return render_template('index.html')

@app.route('/predict/canvas', methods=['POST'])
def predict_canvas():
    """
    Predict digit from canvas drawing
    Expects: JSON with 'image' field containing base64 encoded image data
    Returns: JSON with 'prediction' and 'confidence'
    """
    try:
        # Get image data from request
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        image_data = data['image']
        
        # Remove data URL prefix if present (e.g., "data:image/png;base64,")
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 image data
        import base64
        image_bytes = base64.b64decode(image_data)
        
        # Preprocess image
        processed_image = preprocess_canvas_image(image_bytes)
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        
        # Get the predicted class and confidence
        predicted_class = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_class] * 100)
        
        return jsonify({
            'prediction': predicted_class,
            'confidence': round(confidence, 2)
        })
        
    except FileNotFoundError as e:
        return jsonify({'error': str(e)}), 500
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Load model before starting the app
    try:
        load_model()
        print("\nStarting Flask server...")
        app.run(debug=True, host='0.0.0.0', port=5005)
    except FileNotFoundError as e:
        print(f"\nError: {e}")
        print("Please run 'python train_model.py' first to train and save the model.")
    except Exception as e:
        print(f"\nError starting server: {e}")
