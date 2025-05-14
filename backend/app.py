
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])


# Load model and tokenizer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

token = "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"

model = AutoModelForSeq2SeqLM.from_pretrained("NadirFartas/AraT5-trained-11epochs", use_auth_token=token)
tokenizer = AutoTokenizer.from_pretrained(
    "NadirFartas/AraT5-trained-11epochs",
    use_fast=False # force slow tokenizer
)

def segment_by_points_grouped(text):
    # Split the text by periods
    segments = text.split('.')
    
    # Clean up the segments and remove empty ones
    paragraphs = [segment.strip() for segment in segments if segment.strip()]
    
    # Add the period back to each paragraph (as needed)
    if text.endswith('.'):
        paragraphs = [f"{para}." for para in paragraphs]
    else:
        paragraphs = [f"{para}." for para in paragraphs[:-1]] + [paragraphs[-1]] if paragraphs else []
    
    # Group every 3 paragraphs together
    grouped_paragraphs = [
        ' '.join(paragraphs[i:i+3]) for i in range(0, len(paragraphs), 3)
    ]
    
    return grouped_paragraphs




@app.route('/generate', methods=['POST'])
def generate_questions():
    try:
        # Get the text input from the frontend
        data = request.get_json()
        input_text = data.get("text", "")
        paragraphs = segment_by_points_grouped(input_text)
        
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
    

@app.route('/generate-subjectopt', methods=['POST'])
def generate_subject_options():
    try:
        data = request.get_json()
        input_text = data.get("text", "")
        paragraphs = segment_by_points_grouped(input_text)

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


if __name__ == '__main__':
    app.run(port=5000, debug=True)



