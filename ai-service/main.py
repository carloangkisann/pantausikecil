from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="PantauSiKecil AI Service",
    description="API untuk rekomendasi nutrisi, olahraga, dan chatbot medis",
    version="1.0.0"
)