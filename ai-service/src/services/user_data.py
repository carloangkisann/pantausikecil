# src/services/user_data.py
import requests
from datetime import datetime
from fastapi import HTTPException
from config import BACKEND_URL


def fetch_user_data(token: str) -> dict:
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    today = datetime.today().strftime("%Y-%m-%d")

    try:
        user_data = requests.get(f"{BACKEND_URL}/api/auth/me", headers=headers).json()
        user_id = user_data["data"]["user"]["id"]

        def get(endpoint):
            res = requests.get(endpoint, headers=headers)
            res.raise_for_status()
            return res.json()

        return {
            "user_id": user_id,
            "user_data": user_data,
            "user_profile": get(f"{BACKEND_URL}/api/users/{user_id}/profile"),
            "user_food_track": get(
                f"{BACKEND_URL}/api/users/{user_id}/nutrition/meals?date={today}"
            ),
            "user_activity_track": get(
                f"{BACKEND_URL}/api/users/{user_id}/activities/history?startDate=1945-08-17&endDate=2045-08-17"
            ),
            "user_activity_today": get(
                f"{BACKEND_URL}/api/users/{user_id}/activities/today"
            ),
            "user_nutrition_summary": get(
                f"{BACKEND_URL}/api/users/{user_id}/nutrition/summary?date={today}"
            ),
            "user_nutrition_need": get(
                f"{BACKEND_URL}/api/users/{user_id}/nutrition/needs"
            ),
        }
    except Exception as e:
        raise HTTPException(
            status_code=502, detail=f"Gagal mengambil data user dari backend: {str(e)}"
        )


def fetch_user_food_rec_context(token: str) -> dict:
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    today = datetime.today().strftime("%Y-%m-%d")

    try:
        user_data = requests.get(f"{BACKEND_URL}/api/auth/me", headers=headers).json()
        user_id = user_data["data"]["user"]["id"]

        def get(endpoint):
            res = requests.get(endpoint, headers=headers)
            res.raise_for_status()
            return res.json()

        return {
            "user_id": user_id,
            "user_data": user_data,
            "user_profile": get(f"{BACKEND_URL}/api/users/{user_id}/profile"),
            "user_food_track": get(
                f"{BACKEND_URL}/api/users/{user_id}/nutrition/meals?date={today}"
            ),
            "user_nutrition_summary": get(
                f"{BACKEND_URL}/api/users/{user_id}/nutrition/summary?date={today}"
            ),
            "user_nutrition_need": get(
                f"{BACKEND_URL}/api/users/{user_id}/nutrition/needs"
            ),
            "database-food": get(f"{BACKEND_URL}/api/nutrition/food"),
        }
    except Exception as e:
        raise HTTPException(
            status_code=502, detail=f"Gagal mengambil data user dari backend: {str(e)}"
        )


def fetch_user_actv_rec_context(token: str) -> dict:
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    today = datetime.today().strftime("%Y-%m-%d")

    try:
        user_data = requests.get(f"{BACKEND_URL}/api/auth/me", headers=headers).json()
        user_id = user_data["data"]["user"]["id"]

        def get(endpoint):
            res = requests.get(endpoint, headers=headers)
            res.raise_for_status()
            return res.json()

        return {
            "user_id": user_id,
            "user_data": user_data,
            "user_profile": get(f"{BACKEND_URL}/api/users/{user_id}/profile"),
            "user_food_track": get(
                f"{BACKEND_URL}/api/users/{user_id}/nutrition/meals?date={today}"
            ),
            "user_activity_today": get(
                f"{BACKEND_URL}/api/users/{user_id}/activities/today"
            ),
            "user_activity_history": get(
                f"{BACKEND_URL}/api/users/{user_id}/activities/history?startDate=1945-08-17&endDate=2045-08-17"
            ),
            "database-activity": get(f"{BACKEND_URL}/api/activities"),
        }
    except Exception as e:
        raise HTTPException(
            status_code=502, detail=f"Gagal mengambil data user dari backend: {str(e)}"
        )
