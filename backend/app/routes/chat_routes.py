from fastapi import APIRouter
from app.database.mongodb import db
from app.schemas.chat_schema import ChatRequest
from app.models.chat_model import create_chat
from app.services.llm_service import generate_ai_response

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])


@router.post("/")
async def chat(request: ChatRequest):

    farmer = await db.farmers.find_one(
        {"farmer_id": request.farmer_id}
    )

    if not farmer:
        return {"message": "Farmer not found"}

    history = await db.chats.find(
        {"farmer_id": request.farmer_id}
    ).sort("timestamp", -1).limit(5).to_list(length=5)

    ai_response = generate_ai_response(
        request.message,
        history,
        farmer,
        request.language
    )

    chat = create_chat(
        request.farmer_id,
        request.message,
        ai_response
    )

    await db.chats.insert_one(chat)

    return {
        "response": ai_response
    }