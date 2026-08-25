from datetime import datetime


def create_disease_record(
    farmer_id,
    image_name,
    disease,
    confidence,
    advice
):
    return {
        "farmer_id": farmer_id,
        "image_name": image_name,
        "disease": disease,
        "confidence": confidence,
        "advice": advice,
        "created_at": datetime.utcnow()
    }