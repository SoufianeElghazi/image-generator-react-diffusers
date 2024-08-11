from flask import Flask, request, jsonify, send_file
from pymongo import MongoClient
from io import BytesIO
from PIL import Image
import base64
import torch
from diffusers import StableDiffusionPipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['image_generation']
collection = db['images']

model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float32, cache_dir="C:/image-generation/backend/model/")
pipe = pipe.to("cpu")  

@app.route('/generate', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    image = pipe(prompt).images[0]

    img_io = BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)

    encoded_image = base64.b64encode(img_io.getvalue()).decode('utf-8')
    image_record = {
        'prompt': prompt,
        'data': encoded_image
    }
    collection.insert_one(image_record)

    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

@app.route('/get-images', methods=['GET'])
def get_images():
    images = list(collection.find({}, {'_id': 0}))
    return jsonify(images), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True, use_reloader=False)