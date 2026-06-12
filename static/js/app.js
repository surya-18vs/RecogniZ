// Canvas Drawing Application
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const predictBtn = document.getElementById('predictBtn');
    const clearBtn = document.getElementById('clearBtn');
    const predictionValue = document.getElementById('predictionValue');
    const confidenceValue = document.getElementById('confidenceValue');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Initialize canvas with white background
    function initCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    initCanvas();

    // Get mouse/touch position relative to canvas
    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    // Start drawing
    function startDrawing(e) {
        isDrawing = true;
        const pos = getPosition(e);
        lastX = pos.x;
        lastY = pos.y;
        e.preventDefault();
    }

    // Draw
    function draw(e) {
        if (!isDrawing) return;
        
        const pos = getPosition(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        
        lastX = pos.x;
        lastY = pos.y;
        
        e.preventDefault();
    }

    // Stop drawing
    function stopDrawing(e) {
        isDrawing = false;
        e.preventDefault();
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    // Clear canvas
    clearBtn.addEventListener('click', function() {
        initCanvas();
        resetPrediction();
    });

    // Reset prediction display
    function resetPrediction() {
        predictionValue.textContent = '-';
        confidenceValue.textContent = '0%';
        errorMessage.classList.add('hidden');
    }

    // Show loading indicator
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        predictBtn.disabled = true;
    }

    // Hide loading indicator
    function hideLoading() {
        loadingIndicator.classList.add('hidden');
        predictBtn.disabled = false;
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    // Hide error message
    function hideError() {
        errorMessage.classList.add('hidden');
    }

    // Check if canvas is empty
    function isCanvasEmpty() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        for (let i = 0; i < pixels.length; i += 4) {
            // Check if any pixel is not white
            if (pixels[i] !== 255 || pixels[i + 1] !== 255 || pixels[i + 2] !== 255) {
                return false;
            }
        }
        return true;
    }

    // Predict digit
    predictBtn.addEventListener('click', async function() {
        hideError();
        
        // Check if canvas is empty
        if (isCanvasEmpty()) {
            showError('Please draw a digit first');
            return;
        }

        showLoading();

        try {
            // Get canvas image as base64
            const imageData = canvas.toDataURL('image/png');
            
            // Send prediction request
            const response = await fetch('/predict/canvas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: imageData
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update prediction display
                predictionValue.textContent = data.prediction;
                confidenceValue.textContent = data.confidence + '%';
            } else {
                showError(data.error || 'Prediction failed');
            }
        } catch (error) {
            showError('Network error: ' + error.message);
        } finally {
            hideLoading();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'P' to predict
        if (e.key === 'p' || e.key === 'P') {
            predictBtn.click();
        }
        // Press 'C' to clear
        if (e.key === 'c' || e.key === 'C') {
            clearBtn.click();
        }
    });
});
