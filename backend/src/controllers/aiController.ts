// Fixed controllers/aiController.ts
import { Response } from "express";
import { AuthRequest } from "../types/auth.js";
import { sendSuccess, sendError } from "../utils/helper.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ENV } from "../config/env.js";

export class AIController {
  static chatWithBot = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { message } = req.body;

    if (!message) {
      return sendError(res, "Message is required", 400);
    }

    try {
      // Fixed: Add /chat endpoint to the URL
      const chatbotRes = await fetch(`${ENV.CHATBOT_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization || "",
        },
        body: JSON.stringify({ message }),
      });

      const data = await chatbotRes.json();

      if (!chatbotRes.ok) {
        return sendError(
          res,
          "Chatbot request failed",
          chatbotRes.status,
          data.detail || "Unknown error"
        );
      }

      return sendSuccess(res, "Chatbot response retrieved successfully", {
        reply: data.reply,
        user_id: data.user_id,
      });
    } catch (error: any) {
      return sendError(res, "Internal server error", 500, error.message);
    }
  });

  static foodRecommendation = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      try {
        // Fixed: Add correct endpoint URL and change response structure
        const recommendation = await fetch(
          `${ENV.CHATBOT_API_URL}/food-recommendation`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: req.headers.authorization || "",
            },
          }
        );

        const data = await recommendation.json();

        if (!recommendation.ok) {
          return sendError(
            res,
            "Food recommendation request failed",
            recommendation.status,
            data.detail || "Unknown error"
          );
        }

        // Fixed: Return the correct data structure for food recommendations
        return sendSuccess(res, "Food recommendation retrieved successfully", {
          recommendations: data.data, // FastAPI returns {success: true, data: {...}}
          success: data.success,
        });
      } catch (error: any) {
        return sendError(res, "Internal server error", 500, error.message);
      }
    }
  );

  // Add activity recommendation method
  static activityRecommendation = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      try {
        const recommendation = await fetch(
          `${ENV.CHATBOT_API_URL}/activity-recommendation`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: req.headers.authorization || "",
            },
          }
        );

        const data = await recommendation.json();

        if (!recommendation.ok) {
          return sendError(
            res,
            "Activity recommendation request failed",
            recommendation.status,
            data.detail || "Unknown error"
          );
        }

        return sendSuccess(
          res,
          "Activity recommendation retrieved successfully",
          {
            recommendations: data.data,
            success: data.success,
          }
        );
      } catch (error: any) {
        return sendError(res, "Internal server error", 500, error.message);
      }
    }
  );
}
