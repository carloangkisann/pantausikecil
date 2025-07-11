# src/services/gemini_service.py
import google.generativeai as genai
import os
from config import GEMINI_API_KEY

app_desc = """
PantauSiKecil adalah aplikasi AI yang membantu ibu hamil...
(isi dengan deskripsi aplikasi sesuai kebutuhan)
"""

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(model_name="models/gemini-2.0-flash")


def generate_response(message: str, user_context: dict) -> str:
    system_context = f"""
        Kau adalah Chat Bot yang bernama MediBot...
        Deskripsi Aplikasi:
        {app_desc}

        Data pengguna:
        {user_context}

        Pertanyaan: {message}
    """
    response = model.generate_content(system_context)
    return response.text
