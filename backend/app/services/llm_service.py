import os
from groq import Groq

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_ai_response(
    message: str,
    history=None,
    farmer_context=None,
    language="English"
):

    system_prompt = (
        "You are a friendly AI farming advisor who helps farmers "
        "understand farming in very simple language. "

        "Use the farmer's stored location, weather, and conversation "
        "context. Do not ask for information that is already available. "

        "LANGUAGE RULES: "
        f"Always respond in {language}. "
        "Use simple everyday words that a farmer can easily understand. "
        "Avoid technical scientific terms whenever possible. "
        "If a technical term is necessary, explain it immediately "
        "in simple words. "
        "Use short sentences. "
        "Write as if you are speaking directly to the farmer. "
        "Be friendly, practical, and reassuring. "

        "FORMAT RULES: "
        "Use Markdown headings (###) for major sections instead of "
        "bold-only headings. "
        "Never use Markdown tables. "
        "Use short headings and numbered or bullet lists. "
        "Keep answers concise and easy to read on a phone. "
        "For crop recommendations, give at most 5 crops. "
        "For each crop, give one simple reason and one simple risk. "
        "End with 2 or 3 practical tips. "

        "SAFETY: "
        "Give practical and conservative advice. "
        "Do not provide unsupported pesticide doses or dangerous "
        "chemical instructions. "
        "Do not give exact fertilizer quantities, ratios, or depths "
        "unless supported by a soil test or local agricultural advice."
    )

    if farmer_context:
        system_prompt += "\n\nFarmer context:"

        system_prompt += (
            f"\nName: {farmer_context.get('name', 'Unknown')}"
            f"\nPreferred profile language: "
            f"{farmer_context.get('language', 'Unknown')}"
        )

        location = farmer_context.get("location", {})

        system_prompt += (
            f"\nPincode: {location.get('pincode', 'Unknown')}"
            f"\nDistrict: {location.get('district', 'Unknown')}"
            f"\nState: {location.get('state', 'Unknown')}"
        )

        weather = farmer_context.get("weather", {})

        system_prompt += (
            f"\nTemperature: "
            f"{weather.get('temperature', 'Unknown')} °C"
            f"\nHumidity: "
            f"{weather.get('humidity', 'Unknown')}%"
            f"\nCondition: "
            f"{weather.get('condition', 'Unknown')}"
            f"\nDescription: "
            f"{weather.get('description', 'Unknown')}"
            f"\nWind speed: "
            f"{weather.get('wind_speed', 'Unknown')} m/s"
        )

    messages = [
        {
            "role": "system",
            "content": system_prompt
        }
    ]

    # Convert MongoDB chat history into Groq messages
    if history:
        for chat in reversed(history):

            if chat.get("message"):
                messages.append({
                    "role": "user",
                    "content": chat["message"]
                })

            if chat.get("response"):
                messages.append({
                    "role": "assistant",
                    "content": chat["response"]
                })

    messages.append({
        "role": "user",
        "content": message
    })

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0.7
    )

    return response.choices[0].message.content