from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import os
from langflow.load import run_flow_from_json

# Initialize Flask app
app = Flask(__name__)

# Load the fine-tuned model and tokenizer
model_name = os.getenv("MODEL_NAME", "gpt-2")  # Replace with your model name if different
# model = AutoModelForCausalLM.from_pretrained(model_name)
# tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained('bert-base-uncased',is_decoder=True)
tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')

TWEAKS = {
  "ChatInput-FfsdR": {},
  "Prompt-wObzn": {},
  "ChatOutput-8saB5": {},
  "GoogleGenerativeAIModel-V62ws": {
      "google_api_key": os.getenv("GOOGLE_API_KEY", "AIzaSyAgqtLSWPsvLE7j6HF4VxZIF5ht2-uik0c"),
  }
}

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Extract message from the request
        data = request.json
        message = data['message']

        # Tokenize and generate response
        # inputs = tokenizer.encode(message, return_tensors='pt')
        # outputs = model.generate(inputs, max_length=100)
        # response = tokenizer.decode(outputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True)

        result = run_flow_from_json(flow="flow.json",
                            input_value=message,
                            fallback_to_env_vars=True, # False by default
                            tweaks=TWEAKS)
        response = result[0].outputs[0].messages[0].message
        # Return the generated response
        return jsonify({'message': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the server on port 8501
    app.run(host='0.0.0.0', port=8501)
