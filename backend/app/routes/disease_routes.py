from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services.disease_service import predict_disease
from app.services.llm_service import generate_ai_response
from app.database.mongodb import db
from app.models.disease_model import create_disease_record

router = APIRouter(
    prefix="/api/disease",
    tags=["Disease Detection"]
)


@router.post("/predict")
async def predict_plant_disease(
    farmer_id: int,
    language: str = "English",
    file: UploadFile = File(...)
):

    os.makedirs("uploads", exist_ok=True)

    file_path = os.path.join(
        "uploads",
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # CNN prediction
    result = predict_disease(file_path)

    disease = result["disease"]
    confidence = result["confidence"]

    # Generate agricultural advice in selected language
    prompt = f"""
You are an agricultural advisory assistant.

A plant disease detection model has identified:

Disease: {disease}
Confidence: {confidence:.2%}

The farmer's preferred language is {language}.

Provide the advice entirely in {language}.

Use very simple language that a farmer can easily understand.

Include:
### What the disease is
Explain simply what the disease is.

### Common symptoms
Give the main symptoms in simple words.

### Possible causes
Explain common causes simply.

### Recommended treatment or management
Give safe, practical steps.

### Prevention tips
Give simple prevention steps.

### Quick practical tips
Give 2 or 3 useful tips.

Rules:
- Do not use Markdown tables.
- Keep the answer concise.
- Avoid difficult scientific terms where possible.
- If a technical term is necessary, explain it simply.
- Do not invent chemical dosage instructions.
- Do not give dangerous chemical instructions.
"""

    advice = generate_ai_response(
        prompt,
        language=language
    )

    record = create_disease_record(
        farmer_id=farmer_id,
        image_name=file.filename,
        disease=disease,
        confidence=confidence,
        advice=advice
    )

    await db.disease_history.insert_one(record)

    return {
        "disease": disease,
        "confidence": confidence,
        "advice": advice
    }


@router.get("/history/{farmer_id}")
async def get_disease_history(
    farmer_id: int
):

    records = []

    cursor = db.disease_history.find(
        {"farmer_id": farmer_id}
    ).sort(
        "created_at",
        -1
    )

    async for record in cursor:

        record["_id"] = str(
            record["_id"]
        )

        records.append(record)

    return {
        "farmer_id": farmer_id,
        "history": records
    }