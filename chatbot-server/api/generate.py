from http.server import BaseHTTPRequestHandler
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch
import os
import json
from huggingface_hub import login

# Initialize model and tokenizer
def init_model():
    model_name = "distilgpt2"  # Small model
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float32,
        low_cpu_mem_usage=True
    )
    return pipeline(
        task="text-generation",
        model=model,
        tokenizer=tokenizer,
        device_map="auto"
    )

# Initialize the pipeline
chat_pipeline = init_model()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            user_input = data.get("text", "")
            chat_history = data.get("chat_history", [])

            # Format chat history
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

            # Generate response
            response = chat_pipeline(
                formatted_chat,
                max_new_tokens=50,
                temperature=0.7,
                top_p=0.9,
                do_sample=True,
                pad_token_id=chat_pipeline.tokenizer.eos_token_id,
                num_return_sequences=1
            )

            # Extract response
            bot_response = response[0]["generated_text"][-1]["content"]

            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps({
                "response": bot_response
            }).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": str(e)
            }).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers() 