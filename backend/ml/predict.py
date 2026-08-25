import json
import os
import numpy as np
import tensorflow as tf
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "plant_disease_model.keras"
)

LABELS_PATH = os.path.join(
    BASE_DIR,
    "labels.json"
)

model = tf.keras.models.load_model(MODEL_PATH)

with open(LABELS_PATH, "r") as f:
    class_indices = json.load(f)

class_names = {int(v): k for k, v in class_indices.items()}


def predict_disease(image_path):

    image = Image.open(image_path).convert("RGB")
    image = image.resize((224, 224))

    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    predictions = model.predict(image_array, verbose=0)

    predicted_index = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_index])

    disease = class_names[predicted_index]

    return {
        "disease": disease,
        "confidence": round(confidence, 4)
    }


if __name__ == "__main__":
    result = predict_disease("test.jpg.png")
    print(result)