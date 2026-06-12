# DigitAI - Handwritten Digit Recognition

A modern web application for recognizing handwritten digits (0-9) using a Convolutional Neural Network (CNN) trained on the MNIST dataset. Built with Flask, TensorFlow/Keras, and a clean, responsive UI.

## Features

- **Interactive Drawing Canvas**: Draw digits directly in the browser
- **CNN Model**: Deep learning model trained on MNIST dataset with ~99% accuracy
- **Real-time Prediction**: Instant digit recognition with confidence scores
- **Modern UI**: Clean, professional SaaS-style interface with two-column dashboard layout
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile devices
- **Touch Support**: Works with both mouse and touch input

## Project Structure

```
DigitAI/
├── app.py                 # Flask application with prediction routes
├── train_model.py         # CNN model training script
├── digit_model.h5         # Trained model file (generated after training)
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Modern CSS styling
│   └── js/
│       └── app.js        # Canvas drawing and prediction logic
└── README.md             # This file
```

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. **Navigate to the project directory**:
   ```bash
   cd DigitAI
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Training the Model

Before running the application, you need to train the CNN model on the MNIST dataset:

```bash
python train_model.py
```

This will:
- Download the MNIST dataset (60,000 training images, 10,000 test images)
- Train a CNN model for 10 epochs
- Save the trained model as `digit_model.h5`
- Display training progress and final accuracy

**Expected Output**:
- Training accuracy: ~99.5%
- Test accuracy: ~99.0%
- Model file: `digit_model.h5` (~2.5 MB)

## Running the Application

After training the model, start the Flask server:

```bash
python app.py
```

The application will start on `http://localhost:5000`

Open your browser and navigate to `http://localhost:5000` to use the application.

## Usage

1. **Draw a Digit**: Use your mouse or touch to draw a single digit (0-9) on the canvas
2. **Predict**: Click the "Predict" button (or press 'P') to recognize the digit
3. **View Results**: See the predicted digit and confidence percentage in the right panel
4. **Clear**: Click the "Clear" button (or press 'C') to reset the canvas and try again

## API Endpoints

### `GET /`
Renders the main application page.

### `POST /predict/canvas`
Accepts canvas image data and returns prediction.

**Request Body**:
```json
{
  "image": "data:image/png;base64,..."
}
```

**Response**:
```json
{
  "prediction": 7,
  "confidence": 99.23
}
```

## Model Architecture

The CNN model consists of:

- **Input**: 28x28 grayscale image
- **Conv2D** (32 filters, 3x3 kernel, ReLU activation)
- **Conv2D** (64 filters, 3x3 kernel, ReLU activation)
- **MaxPooling2D** (2x2 pool size)
- **Dropout** (0.25)
- **Flatten**
- **Dense** (128 units, ReLU activation)
- **Dropout** (0.5)
- **Output** (10 units, Softmax activation)

## Technologies Used

- **Backend**: Flask (Python web framework)
- **Machine Learning**: TensorFlow/Keras (CNN model)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Dataset**: MNIST (handwritten digits)

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Model file not found error
If you see "Model file not found", ensure you've run `python train_model.py` first to generate the `digit_model.h5` file.

### TensorFlow installation issues
If you encounter TensorFlow installation errors, try:
```bash
pip install --upgrade pip
pip install tensorflow==2.15.0
```

### Canvas not responding
Ensure JavaScript is enabled in your browser. Try refreshing the page.

## Performance

- **Training Time**: ~5-10 minutes (depending on your hardware)
- **Prediction Time**: < 100ms per prediction
- **Model Size**: ~2.5 MB
- **Accuracy**: ~99% on MNIST test set

## License

This project is open source and available for educational purposes.

## Future Enhancements

- Support for multiple digits in a single image
- Model improvement with data augmentation
- Export prediction history
- Dark mode theme
- Additional language support
