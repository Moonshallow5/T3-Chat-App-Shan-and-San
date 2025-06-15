from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import torch
import os
from huggingface_hub import login

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Login to Hugging Face using token from environment variable
hf_token = os.getenv('HUGGINGFACE_TOKEN')
if not hf_token:
    raise ValueError("HUGGINGFACE_TOKEN environment variable is not set")
login(token=hf_token)

# Initialize the pipeline with a smaller model
chat_pipeline = pipeline(
    task="text-generation",
    model="facebook/opt-125m",  # Much smaller model that fits in 512MB
    torch_dtype=torch.float32,  # Use float32 instead of bfloat16 to reduce memory
    device_map="auto",
    token=hf_token
)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        user_input = data.get("text", "")
        chat_history = data.get("chat_history", [])

        # Format chat history for the model
        formatted_chat = [
            {
                "role": "system",
                "content": "You are a helpful AI assistant. Keep responses concise and clear."
            }
        ]

        # Add chat history
        for msg in chat_history:
            formatted_chat.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        # Add current user input
        formatted_chat.append({
            "role": "user",
            "content": user_input
        })

        # Generate response with reduced memory usage
        response = chat_pipeline(
            formatted_chat,
            max_new_tokens=100,  # Reduced from 200
            temperature=0.7,
            top_p=0.9,
            do_sample=True,
            pad_token_id=chat_pipeline.tokenizer.eos_token_id
        )

        # Extract the generated response
        bot_response = response[0]["generated_text"][-1]["content"]

        return jsonify({"response": bot_response})

    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port)