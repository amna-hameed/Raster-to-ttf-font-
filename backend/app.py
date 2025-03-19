from flask import Flask, request, render_template, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import os
from werkzeug.utils import secure_filename
import cv2
import numpy as np
import base64
import tensorflow as tf
import pytesseract
from backend import predict_single_font, predict_double_font, is_valid_text_image, get_raster_fonts, get_vector_fonts
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from PIL import Image
from io import BytesIO

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Initialize Flask App
app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = 'uploads'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({"message": "Login successful!"})
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/signup', methods=['POST'])
def api_signup():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Account created successfully!"})

@app.route('/get_fonts', methods=['GET'])
def get_fonts():
    try:
        raster_fonts = get_raster_fonts()
        vector_fonts = get_vector_fonts()
        return jsonify({"raster_fonts": raster_fonts, "vector_fonts": vector_fonts})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    feedback_text = db.Column(db.Text, nullable=False)
    file_path = db.Column(db.String(255), nullable=True)

@app.route("/submit_feedback", methods=["POST"])
def submit_feedback():
    try:
        feedback_text = request.form.get("feedback")
        file = request.files.get("file")

        if not feedback_text:
            return jsonify({"error": "Feedback text is required"}), 400

        file_path = None
        if file:
            filename = secure_filename(file.filename)
            if not os.path.exists(app.config["UPLOAD_FOLDER"]):
                os.makedirs(app.config["UPLOAD_FOLDER"])
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(file_path)

        # Save feedback in database
        new_feedback = Feedback(feedback_text=feedback_text, file_path=file_path)
        db.session.add(new_feedback)
        db.session.commit()

        return jsonify({"message": "Feedback submitted successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'success')
    return redirect(url_for('home'))

@app.route('/font-matcher')
def font_matcher():
    return render_template('index.html')

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = 'uploads'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Helper function to convert numpy ndarray to base64
def image_to_base64(image: np.ndarray) -> str:
    pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    buffered = BytesIO()
    pil_image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

@app.route('/upload', methods=['POST'])
def upload_image():
    font_type = request.form.get('fontType')
    if font_type not in ['single', 'multi']:
        return jsonify({'error': 'Invalid font type specified. Use "single" or "multi".'}), 400

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        if not is_valid_text_image(filepath):
            return jsonify({'error': 'Invalid Input: No text found in the image'}), 400

        results = {}
        try:
            if font_type == 'single':
                predictions = predict_single_font(filepath)
                if not predictions:
                    return jsonify({'error': 'Error: Unable to process the image'}), 400
                results = {
                    'predictions': [{'font': font, 'score': float(score)} for font, score in predictions],
                    'original_image': image_to_base64(cv2.imread(filepath, cv2.IMREAD_GRAYSCALE))
                }
            else:
                results['lines'] = []
                font_predictions = predict_double_font(filepath)
                if not font_predictions:
                    return jsonify({'error': 'Error: Unable to process the image'}), 400
                for line_label, fonts, line_img in font_predictions:
                    if not fonts:
                        fonts = [('No match found', 0.0)]
                    results['lines'].append({
                        'line_label': line_label,
                        'fonts': [{'font': font, 'score': float(score)} for font, score in fonts],
                        'original_image': image_to_base64(line_img)
                    })
            return jsonify(results)
        except Exception as e:
            return jsonify({'error': f'Processing error: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Invalid file type'}), 400

# Initialize Database
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
