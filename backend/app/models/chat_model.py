from datetime import datetime


def create_chat(farmer_id, user_message, ai_response):
    return {
        "farmer_id": farmer_id,
        "user_message": user_message,
        "ai_response": ai_response,
        "timestamp": datetime.utcnow()
    }