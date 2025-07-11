# src/config.py
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
BACKEND_URL = os.getenv("BACKEND_URL")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment")

if not BACKEND_URL:
    raise ValueError("BACKEND_URL not found in environment")
