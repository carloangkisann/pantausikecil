# src/main.py
import json
from typing import Any, Dict
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.request import ChatRequest
from utils.auth import get_bearer_token
from services.user_data import (
    fetch_user_data,
    fetch_user_food_rec_context,
    fetch_user_actv_rec_context,
)
from services.gemini_service import (
    generate_response,
    food_recommendation,
    activity_recommendation,
)

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


@app.get("/food-recommendation")
async def food_recommendation_endpoint(token: str = Depends(get_bearer_token)):
    """
    Endpoint untuk mendapatkan rekomendasi makanan untuk ibu hamil
    berdasarkan profil nutrisi dan makanan yang telah dikonsumsi.
    """
    try:
        # Ambil context pengguna
        context = fetch_user_food_rec_context(token)

        # Generate rekomendasi makanan
        recommendation_response = food_recommendation(context)

        # Parse dan bersihkan response dari model
        cleaned_data = clean_model_response(recommendation_response)

        return {"success": True, "data": cleaned_data}

    except HTTPException as e:
        raise e
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500, detail=f"Invalid JSON response from model: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/activity-recommendation")
async def activity_recommendation_endpoint(token: str = Depends(get_bearer_token)):
    """
    Endpoint untuk mendapatkan rekomendasi aktivitas fisik untuk ibu hamil
    berdasarkan profil kesehatan, trimester, dan kondisi saat ini.
    """
    try:
        # Ambil context pengguna untuk aktivitas
        context = fetch_user_actv_rec_context(token)

        # Generate rekomendasi aktivitas
        recommendation_response = activity_recommendation(context)

        # Parse dan bersihkan response dari model
        cleaned_data = clean_model_response(recommendation_response)

        return {"success": True, "data": cleaned_data}

    except HTTPException as e:
        raise e
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500, detail=f"Invalid JSON response from model: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


def clean_model_response(response: str) -> Dict[Any, Any]:
    """
    Membersihkan response dari model AI dan mengkonversi ke dictionary.

    Args:
        response: Raw response string dari model AI

    Returns:
        Dict: Parsed JSON response

    Raises:
        json.JSONDecodeError: Jika response bukan JSON yang valid
    """
    # Remove markdown code blocks if present
    cleaned_response = response.strip()

    if cleaned_response.startswith("```json"):
        cleaned_response = cleaned_response[7:]  # Remove ```json
    if cleaned_response.startswith("```"):
        cleaned_response = cleaned_response[3:]  # Remove ```
    if cleaned_response.endswith("```"):
        cleaned_response = cleaned_response[:-3]  # Remove trailing ```

    # Remove any leading/trailing whitespace
    cleaned_response = cleaned_response.strip()

    # Parse JSON
    try:
        return json.loads(cleaned_response)
    except json.JSONDecodeError as e:
        # Log the problematic response for debugging
        print(f"Failed to parse JSON: {cleaned_response}")
        raise e
