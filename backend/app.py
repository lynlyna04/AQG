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


if __name__ == '__main__':
    app.run(port=5000, debug=True)