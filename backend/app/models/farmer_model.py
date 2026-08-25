from datetime import datetime


def create_farmer(data, hashed_password, farmer_id, location):

    weather = location["weather"]

    return {
        "farmer_id": farmer_id,
        "name": data.name,
        "phone": data.phone,
        "password": hashed_password,
        "language": data.language,

        "location": {
            "pincode": data.pincode,
            "district": location["location"]["district"],
            "state": location["location"]["state"],
            "latitude": location["location"]["latitude"],
            "longitude": location["location"]["longitude"]
        },

        "weather": {
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "condition": weather["condition"],
            "description": weather["description"],
            "wind_speed": weather["wind_speed"]
        },

        "created_at": datetime.utcnow(),
        "conversation_count": 0
    }