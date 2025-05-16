from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from flask import Flask, request, jsonify, g
from flask_cors import CORS
import sqlite3
import bcrypt
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Database setup
DATABASE = './users.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row  # This enables column access by name: row['column_name']
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Load ML model and tokenizer
token = "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"

model = AutoModelForSeq2SeqLM.from_pretrained("NadirFartas/AraT5-trained-11epochs", use_auth_token=token)
tokenizer = AutoTokenizer.from_pretrained(
    "NadirFartas/AraT5-trained-11epochs",
    use_fast=False  # force slow tokenizer
)

def segment_by_points_grouped(text, tokenizer, max_tokens=60, min_tokens=30):
    words = text.split()
    chunks = []
    current_chunk = []
    
    for word in words:
        current_chunk.append(word)
        encoded = tokenizer(' '.join(current_chunk), return_tensors="pt", add_special_tokens=False)
        length = encoded.input_ids.shape[1]
        
        if length >= max_tokens:
            # Remove last word to keep it under max
            last_word = current_chunk.pop()
            chunks.append(' '.join(current_chunk))
            current_chunk = [last_word]
    
    # Handle the final chunk
    if current_chunk:
        encoded = tokenizer(' '.join(current_chunk), return_tensors="pt", add_special_tokens=False)
        if chunks and encoded.input_ids.shape[1] < min_tokens:
            # Merge with previous if too small
            chunks[-1] += ' ' + ' '.join(current_chunk)
        else:
            chunks.append(' '.join(current_chunk))
    
    return chunks

# User authentication routes
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, email, password]):
            return jsonify({"message": "Missing required fields"}), 400
        
        # Check if user exists
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM user WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if user:
            return jsonify({"message": "User already exists!"}), 400
        
        # Hash password
        salt = bcrypt.gensalt(10)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        # Insert user
        cursor.execute(
            "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password.decode('utf-8'))
        )
        db.commit()
        
        return jsonify({"message": "User registered successfully!"}), 201
    
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({"message": "Missing required fields"}), 400
        
        # Check if user exists
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM user WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"message": "Invalid email or password!"}), 400
        
        # Check password
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({
                "username": user['username'],
                "email": user['email']
            }), 200
        else:
            return jsonify({"message": "Invalid email or password!"}), 400
    
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

# ML model routes
@app.route('/generate', methods=['POST'])
def generate_questions():
    try:
        # Get the text input from the frontend
        data = request.get_json()
        input_text = data.get("text", "")
        paragraphs = segment_by_points_grouped(input_text, tokenizer)
        
        # Check if paragraphs are empty   
        if not paragraphs:
            return jsonify({"error": "No valid paragraphs found."}), 400
        
        generated = []
        # Tokenize and generate
        for paragraph in paragraphs:
            # Tokenize the input text
            inputs = tokenizer(paragraph, return_tensors="pt", truncation=True)
            outputs = model.generate(
                inputs["input_ids"],
                max_length=100,
                num_beams=4,
                early_stopping=True
            )

            # Decode and return the result
            decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
            # Append the generated question to the list
            generated.append(decoded)
        # Return the generated questions
        return jsonify({
            "questions": generated,
            "count": len(generated),
            "paragraph": input_text
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate-subject', methods=['POST'])
def generate_subject_options():
    try:
        data = request.get_json()
        input_text = data.get("text", "")
        paragraphs = segment_by_points_grouped(input_text, tokenizer)

        if not paragraphs:
            return jsonify({"error": "No valid paragraphs found."}), 400

        generated = []
        for paragraph in paragraphs:
            inputs = tokenizer(paragraph, return_tensors="pt", truncation=True)
            outputs = model.generate(
                inputs["input_ids"],
                max_length=100,
                num_beams=4,
                early_stopping=True
            )

            decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
            generated.append(decoded)

        return jsonify({
            "subject_options": generated,
            "count": len(generated),
            "original_text": input_text
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Database initialization script
def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        
        # Create user table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
        ''')
        db.commit()

if __name__ == '__main__':
    # Initialize the database
    init_db()
    
    # Run the Flask app
    app.run(port=5000, debug=True)