from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from flask import Flask, request, send_file, jsonify, g
from flask_cors import CORS
import sqlite3
import bcrypt
import os
import pdfkit
from io import BytesIO
import tempfile
import requests
import json

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Define path to wkhtmltopdf executable based on OS
import platform

if platform.system() == 'Windows':
    wkhtmltopdf_path = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
    # Alternative common locations to check if the above doesn't work
    if not os.path.exists(wkhtmltopdf_path):
        alt_paths = [
            r'C:\Program Files (x86)\wkhtmltopdf\bin\wkhtmltopdf.exe',
            r'C:\wkhtmltopdf\bin\wkhtmltopdf.exe'
        ]
        for path in alt_paths:
            if os.path.exists(path):
                wkhtmltopdf_path = path
                break
elif platform.system() == 'Linux':
    wkhtmltopdf_path = '/usr/local/bin/wkhtmltopdf'
    if not os.path.exists(wkhtmltopdf_path):
        # Try to find using which command
        import subprocess
        try:
            wkhtmltopdf_path = subprocess.check_output(['which', 'wkhtmltopdf']).decode('utf-8').strip()
        except:
            pass
elif platform.system() == 'Darwin':  # macOS
    wkhtmltopdf_path = '/usr/local/bin/wkhtmltopdf'
    if not os.path.exists(wkhtmltopdf_path):
        # Try common macOS paths
        alt_paths = [
            '/opt/homebrew/bin/wkhtmltopdf',
            '/usr/bin/wkhtmltopdf'
        ]
        for path in alt_paths:
            if os.path.exists(path):
                wkhtmltopdf_path = path
                break

# Check if wkhtmltopdf exists at the specified path
if not os.path.exists(wkhtmltopdf_path):
    print(f"WARNING: wkhtmltopdf not found at {wkhtmltopdf_path}. PDF generation may fail.")
    # You might want to set it to None and let pdfkit try to find it automatically
    config = None
else:
    print(f"Using wkhtmltopdf at: {wkhtmltopdf_path}")
    config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path)


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

# Gemini API functions
def extract_theme(text, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

    prompt = (
        f"أنت نموذج معالجة نصوص. استخرج الموضوع العام للنص التالي:\n{text}\n\n"
        "أوجز الموضوع في كلمة واحدة واضحة ومختصرة."
    )

    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, headers=headers, data=json.dumps(data))
    if response.status_code == 200:
        theme = response.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
        return theme
    else:
        raise Exception(f"Theme API Error: {response.status_code} - {response.text}")

def generate_instruction(text, constraints, api_key, min_lines=10, max_lines=12):
    theme = extract_theme(text, api_key)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

    constraints_str = '، '.join(constraints)

    prompt = (
        f"اكتب تعليمة قصيرة ومباشرة لوضعية إدماجية موجهة لتلميذ في المرحلة الابتدائية.\n"
        f"الموضوع: {theme}.\n"
        f"التعليمة يجب أن تطلب من التلميذ كتابة فقرة من {min_lines} إلى {max_lines} أسطر، "
        f"تُبرز عناصر الموضوع، مع توظيف القواعد التالية: {constraints_str}.\n"
        f"لا تضف مقدمة ولا تشجيع، فقط التعليمة كما تُكتب في كراس التمارين."
    )

    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, headers=headers, data=json.dumps(data))
    if response.status_code == 200:
        instruction = response.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
        return instruction
    else:
        raise Exception(f"Instruction API Error: {response.status_code} - {response.text}")

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

# New route for Gemini API-based instruction generation
@app.route('/generate-instruction', methods=['POST'])
def generate_integration_instruction():
    try:
        data = request.get_json()
        text = data.get("text", "")
        constraints = data.get("constraints", [])
        min_lines = data.get("min_lines", 10)
        max_lines = data.get("max_lines", 12)
        api_key = data.get("api_key", "")
        
        if not text or not constraints or not api_key:
            return jsonify({"error": "Missing required fields (text, constraints, or API key)"}), 400
        
        # Generate instruction using Gemini API
        instruction = generate_instruction(text, constraints, api_key, min_lines, max_lines)
        
        return jsonify({
            "instruction": instruction,
            "theme": extract_theme(text, api_key)
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# PDF generation route - Changed to a different route name
@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    try:
        data = request.get_json()
        html_content = data.get("htmlContent")

        if not html_content:
            return jsonify({"error": "No HTML content provided"}), 400
            
        # Add proper HTML structure with UTF-8 encoding and right-to-left direction for Arabic
        # Include improved table styling
        html_with_encoding = f"""
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <style>
                body {{
                    font-family: 'Arial', 'Tahoma', sans-serif;
                    direction: rtl;
                    text-align: right;
                    padding: 20px;
                    font-size: 14px;
                }}
                
                /* Table styling */
                table {{
                    border-collapse: collapse;
                    width: 100%;
                    margin-bottom: 20px;
                    page-break-inside: auto;
                    border: 1px solid #ddd;
                }}
                
                table, th, td {{
                    border: 1px solid #ddd;
                }}
                
                th, td {{
                    padding: 8px;
                    text-align: right;
                }}
                
                th {{
                    background-color: #f2f2f2;
                    font-weight: bold;
                }}
                
                tr {{
                    page-break-inside: avoid;
                    page-break-after: auto;
                }}
                
                tr:nth-child(even) {{
                    background-color: #f9f9f9;
                }}
                
                thead {{
                    display: table-header-group;
                }}
                
                tfoot {{
                    display: table-footer-group;
                }}
                
                @font-face {{
                    font-family: 'Arabic';
                    src: url('https://fonts.googleapis.com/css2?family=Cairo&display=swap');
                }}
                
                h1, h2, h3, h4, h5, h6 {{
                    font-weight: bold;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }}
                
                p {{
                    margin-bottom: 10px;
                }}
            </style>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """

        # Create temporary file for PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            pdf_path = tmp_file.name
            
        # Enhanced options for table rendering
        options = {
            'encoding': 'UTF-8',
            'enable-local-file-access': None,
            'disable-smart-shrinking': None,
            'print-media-type': None,
            'page-size': 'A4',
            'dpi': 300,
            'image-dpi': 300,
            'image-quality': 100,
            'enable-javascript': None,
            'javascript-delay': 1000,  # 1 second delay for tables to render
            'no-stop-slow-scripts': None,
            'custom-header': [
                ('Content-Type', 'text/html; charset=UTF-8'),
            ],
            'margin-top': '20mm',
            'margin-right': '20mm',
            'margin-bottom': '20mm',
            'margin-left': '20mm',
        }
            
        # Generate PDF using pdfkit with the configuration
        if config:
            pdfkit.from_string(html_with_encoding, pdf_path, options=options, configuration=config)
        else:
            # Try without specific configuration
            try:
                pdfkit.from_string(html_with_encoding, pdf_path, options=options)
            except Exception as e:
                return jsonify({
                    "error": f"PDF generation failed: {str(e)}",
                    "solution": "Please install wkhtmltopdf from https://wkhtmltopdf.org/downloads.html"
                }), 500
        
        # Send the file
        return send_file(
            pdf_path,
            as_attachment=True,
            download_name="generated.pdf",
            mimetype='application/pdf'
        )
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