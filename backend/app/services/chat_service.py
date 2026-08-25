import google.generativeai as genai
from app.config.settings import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.0-flash")


def generate_response(message: str):

    prompt = f"""
You are an expert agricultural AI assistant.

Answer in a simple way that farmers can understand.

Farmer Question:
{message}
"""

    response = model.generate_content(prompt)

    return response.text