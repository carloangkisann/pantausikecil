// Fixed routes/ai.ts
import { Router } from "express";
import { AIController } from "../controllers/aiController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { z } from "zod";

const router = Router();

router.use(authenticateToken);

router.post(
  "/chat",
  validate(
    z.object({
      body: z.object({
        message: z.string().min(1, "Message cannot be empty"),
      }),
    })
  ),
  AIController.chatWithBot
);

// Fixed endpoint URL - should match the FastAPI endpoint
router.get("/food-recommendation", AIController.foodRecommendation);
router.get("/activity-recommendation", AIController.activityRecommendation);

export default router;
