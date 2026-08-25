from pydantic import BaseModel


class ChatRequest(BaseModel):
    farmer_id: int
    message: str
    language: str = "English"