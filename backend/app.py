
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



@app.route('/generate', methods=['POST'])
def generate_questions():
    try:
        # Get the text input from the frontend
        data = request.get_json()
        input_text = data.get("text", "")

        # Prepend prompt as required by the model
        prompt = f"generate question: {input_text}"

        # Tokenize and generate
        inputs = tokenizer(prompt, return_tensors="pt", truncation=True)
        outputs = model.generate(
            inputs["input_ids"],
            max_length=100,
            num_beams=4,
            early_stopping=True
        )

        # Decode and return the result
        generated = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return jsonify({"generated": generated})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)



