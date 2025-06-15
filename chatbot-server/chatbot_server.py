from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
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

# Initialize with a very small model
model_name = "distilgpt2"  # Only 82M parameters
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float32,
    low_cpu_mem_usage=True
)

# Create pipeline with the small model
chat_pipeline = pipeline(
    task="text-generation",
    model=model,
    tokenizer=tokenizer,
    device_map="auto"
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
                "content": "You are a helpful AI assistant."
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

        # Generate response with minimal memory usage
        response = chat_pipeline(
            formatted_chat,
            max_new_tokens=50,  # Reduced further
            temperature=0.7,
            top_p=0.9,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
            num_return_sequences=1
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