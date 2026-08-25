from gtts import gTTS
import os
import uuid


LANGUAGE_CODES = {
    "English": "en",
    "Kannada": "kn",
    "Hindi": "hi",
    "Tamil": "ta",
}


def generate_speech(text: str, language: str = "English"):
    """
    Convert text into an MP3 audio file using gTTS.

    Returns the path of the generated audio file.
    """

    language_code = LANGUAGE_CODES.get(
        language,
        "en"
    )

    os.makedirs(
        "audio",
        exist_ok=True
    )

    filename = f"{uuid.uuid4()}.mp3"

    file_path = os.path.join(
        "audio",
        filename
    )

    speech = gTTS(
        text=text,
        lang=language_code,
        slow=False
    )

    speech.save(file_path)

    return file_path