from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

from app.services.tts_service import generate_speech

router = APIRouter(
    prefix="/api/tts",
    tags=["Text to Speech"]
)


@router.post("/")
async def text_to_speech(
    text: str,
    language: str = "English"
):

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty."
        )

    try:
        file_path = generate_speech(
            text,
            language
        )

        return FileResponse(
            path=file_path,
            media_type="audio/mpeg",
            filename=os.path.basename(
                file_path
            )
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"TTS generation failed: {str(e)}"
        )