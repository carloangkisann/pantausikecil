from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai
import requests
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()
bearer_scheme = HTTPBearer(auto_error=False)

api_key = os.getenv("GEMINI_API_KEY")
backend_url = os.getenv(
    "BACKEND_URL"
)  # misalnya: http://localhost:3000/api/user-profile

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment")

genai.configure(api_key=api_key)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ganti ke ["http://localhost:3000"] jika kamu tahu origin-nya
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


def get_bearer_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str | None:
    if credentials:
        return credentials.credentials
    return None


@app.post("/chat")
async def chat(req: ChatRequest, token: str = Depends(get_bearer_token)):
    try:
        # === 1. Ambil data dari backend API ===
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        today = datetime.today().strftime("%Y-%m-%d")
        try:
            # data auth/me
            response = requests.get(f"{backend_url}/api/auth/me", headers=headers)
            response.raise_for_status()
            user_data = response.json()

            # ambil id
            user_id = user_data["data"]["user"]["id"]

            # ambil profile
            response = requests.get(
                f"{backend_url}/api/users/{user_id}/profile", headers=headers
            )
            response.raise_for_status()
            user_profile = response.json()

            # ambil track makanan
            response = requests.get(
                f"{backend_url}/api/users/{user_id}/nutrition/meals?date={today}",
                headers=headers,
            )
            response.raise_for_status()
            user_food_track = response.json()

            # ambil track aktifitas
            response = requests.get(
                f"{backend_url}/api/users/{user_id}/activities/history?startDate=1945-08-17&endDate=2045-08-17",
                headers=headers,
            )
            response.raise_for_status()
            user_activity_track = response.json()

            # ambil track aktifitas hari ini
            response = requests.get(
                f"{backend_url}/api/users/{user_id}/activities/today",
                headers=headers,
            )
            response.raise_for_status()
            user_activity_today = response.json()

            # ambil summary nutrisi
            response = requests.get(
                f"{backend_url}/api/users/{user_id}/nutrition/summary?date={today}",
                headers=headers,
            )
            response.raise_for_status()
            user_nutrition_summary = response.json()

            # ambil kebutuhan nutrisi
            response = requests.get(
                f"{backend_url}/api/users/{user_id}/nutrition/needs",
                headers=headers,
            )
            response.raise_for_status()
            user_nutrition_need = response.json()

        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail=f"Gagal mengambil data user dari backend: {str(e)}",
            )

        # === 2. Buat prompt dengan data backend + pesan user ===
        system_context = f"""
            Kau adalah Chat Bot yang bernama MediBot, sebuah chatbot yang akan melayani bidang kesehatan dan menjawab pertanyaan-pertanyaan seputar aplikasi ini dan kesehatan SAJA.
            Jika ada pertanyaan  yang diluar bidang kesehatan atau aplikasi maka katakan bahwa kau tidak dapat menjawab pertanyaan itu.
            Gunakan informasi pengguna berikut untuk menjawab:
            Data authentikasi pengguna :
            {user_data}
            Profil Pengguna :
            {user_profile}
            Histori makanan pengguna hari ini :
            {user_food_track}
            Histori lengkap aktifitas pengguna  :
            {user_activity_track}
            Histori aktifitas pengguna hari ini :
            {user_activity_today}
            Rangkuman nutrisi hari ini :
            {user_nutrition_summary}
            Nutrisi yang diperlukan hari ini:
            {user_nutrition_need}

            Pertanyaan: {req.message}
            """
        # === 3. Kirim ke Gemini ===
        model = genai.GenerativeModel(model_name="models/gemini-2.0-flash")
        gemini_response = model.generate_content(system_context)

        return {
            "success": True,
            "user_id": user_activity_today,
            "reply": gemini_response.text,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
