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
      const chatbotRes = await fetch(ENV.CHATBOT_API_URL, {
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
}
