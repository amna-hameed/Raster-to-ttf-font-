import os
import cv2
import numpy as np
import tensorflow as tf
import pytesseract
from collections import Counter
import base64

# Load the trained model
model = tf.keras.models.load_model("models/deepfont_model.keras")

# Define image sizes
IMG_SIZE_SINGLE = (105, 105)
IMG_SIZE_DOUBLE = (128, 128)

# Font class names
index_to_class = {
    0: 'Arial-rounded-mt-regular',
    1: 'Alagard',
    2: 'JetBrains Mono',
    3: 'PressStart 2P',
    4: 'Russo One',
    5: 'ShareTech Mono',
    6: 'Tiny5',
    7: 'VT323',
    8: 'VT323',
    9: 'Times-roman'
}

import base64
import os

# Function to convert TTF file to base64
def convert_ttf_to_base64(file_path):
    with open(file_path, "rb") as font_file:
        encoded_font = base64.b64encode(font_file.read()).decode('utf-8')
    return encoded_font

# Folder paths for raster and vector fonts
raster_font_folder = "raster fonts ttf"  # Replace with your raster fonts folder path
vector_font_folder = "vector fonts ttf"  # Replace with your vector fonts folder path

# Get raster fonts from folder
def get_raster_fonts():
    raster_fonts = []
    for font_name in os.listdir(raster_font_folder):
        if font_name.endswith(".ttf"):
            font_path = os.path.join(raster_font_folder, font_name)
            base64_font = convert_ttf_to_base64(font_path)
            raster_fonts.append({
                "name": font_name.replace(".ttf", ""),  # Remove .ttf from the name
                "base64": f"data:font/ttf;base64,{base64_font}"
            })
    return raster_fonts

# Get vector fonts from folder
def get_vector_fonts():
    vector_fonts = []
    for font_name in os.listdir(vector_font_folder):
        if font_name.endswith(".ttf"):
            font_path = os.path.join(vector_font_folder, font_name)
            base64_font = convert_ttf_to_base64(font_path)
            vector_fonts.append({
                "name": font_name.replace(".ttf", ""),  # Remove .ttf from the name
                "base64": f"data:font/ttf;base64,{base64_font}"
            })
    return vector_fonts

def is_valid_text_image(image_path):
    """Validates if an image contains readable text."""
    if not os.path.exists(image_path):
        return False
    
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None or image.shape[0] < 30 or image.shape[1] < 30:
        return False
    
    _, thresh = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    edges = cv2.Canny(thresh, 10, 50)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    text_area = sum(cv2.contourArea(c) for c in contours)
    total_area = image.shape[0] * image.shape[1]
    if len(contours) < 10 or (text_area / total_area) < 0.002:
        return False
    
    ocr_data = pytesseract.image_to_data(image, config="--psm 6", output_type=pytesseract.Output.DICT)
    extracted_text = " ".join([ocr_data["text"][i] for i in range(len(ocr_data["text"])) if int(ocr_data["conf"][i]) > 60])
    return len(extracted_text) >= 3

def preprocess_image(image_path, img_size):
    """Preprocess the image for model prediction."""
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    image = cv2.resize(image, img_size) / 255.0
    return np.expand_dims(image, axis=(0, -1))

def predict_single_font(image_path):
    """Predicts the top 3 font matches for a given image."""
    if not is_valid_text_image(image_path):
        return []
    
    input_image = preprocess_image(image_path, IMG_SIZE_SINGLE)
    prediction = model.predict(input_image)[0]
    top_3_indices = np.argsort(prediction)[-3:][::-1]
    return [(index_to_class[idx], prediction[idx]) for idx in top_3_indices]

def predict_double_font(image_path):
    """Detects fonts in multi-font images by segmenting lines and letters."""
    if not is_valid_text_image(image_path):
        return []
    
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
    vertical_sum = np.sum(binary, axis=1)
    line_indices = np.where(vertical_sum > 0)[0]
    
    if len(line_indices) == 0:
        return []
    
    lines = []
    start_idx = line_indices[0]
    for i in range(1, len(line_indices)):
        if line_indices[i] - line_indices[i - 1] > 5:
            lines.append(image[start_idx:line_indices[i - 1] + 1])
            start_idx = line_indices[i]
    lines.append(image[start_idx:line_indices[-1] + 1])
    
    font_predictions = []
    for i, line in enumerate(lines):
        gray_line = cv2.cvtColor(line, cv2.COLOR_BGR2GRAY)
        _, binary_line = cv2.threshold(gray_line, 200, 255, cv2.THRESH_BINARY_INV)
        contours, _ = cv2.findContours(binary_line, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        letters = []
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            if w > 5 and h > 10:
                letter = binary_line[y:y+h, x:x+w]
                letter = cv2.resize(letter, IMG_SIZE_DOUBLE)
                letters.append(letter)
        
        all_predictions = []
        for letter in letters:
            input_image = np.expand_dims(letter / 255.0, axis=(0, -1))
            prediction = model.predict(input_image)[0]
            top_fonts = np.argsort(prediction)[-3:][::-1]
            all_predictions.extend(top_fonts)
        
        font_counts = Counter(all_predictions)
        top_k_fonts = font_counts.most_common(3)
        top_k_fonts = [(index_to_class[font], count / len(all_predictions)) for font, count in top_k_fonts]
        font_predictions.append((f"Line {i+1}", top_k_fonts, line))
    
    return font_predictions