# src/main.py

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.request import ChatRequest
from utils.auth import get_bearer_token
from services.user_data import fetch_user_data
from services.gemini_service import generate_response

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti dengan domain frontend jika sudah tahu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chat")
async def chat_endpoint(req: ChatRequest, token: str = Depends(get_bearer_token)):
    try:
        user_context = fetch_user_data(token)
        reply = generate_response(req.message, user_context)
        return {
            "success": True,
            "user_id": user_context.get("user_id"),
            "reply": reply,
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
