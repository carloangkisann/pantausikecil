# src/routes/chat.py
from fastapi import APIRouter, Depends, HTTPException
from models.request import ChatRequest
from utils.auth import get_bearer_token
from services.user_data import fetch_user_data
from services.gemini_service import generate_response

chat_router = APIRouter()


@chat_router.post("/chat")
async def chat(req: ChatRequest, token: str = Depends(get_bearer_token)):
    try:
        user_context = fetch_user_data(token)
        reply = generate_response(req.message, user_context)
        return {"success": True, "user_id": user_context.get("user_id"), "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
