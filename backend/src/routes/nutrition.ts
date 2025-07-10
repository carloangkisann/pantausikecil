import { Router } from 'express';
import { NutritionController } from '../controllers/nutritionController';
import { validate, validateBody, nutritionSchemas, paramSchemas } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authenticateToken);

router.get(
  '/:user_id/nutrition/needs',
  validate(paramSchemas.userId),
  NutritionController.getNutritionalNeeds
);

router.get(
  '/:user_id/nutrition/today',
  validate(paramSchemas.userId),
  NutritionController.getTodayNutrition
);

router.get(
  '/:user_id/nutrition/summary',
  validate(paramSchemas.userId),
  NutritionController.getNutritionSummary
);

router.get(
  '/:user_id/nutrition/meals',
  validate(paramSchemas.userId),
  NutritionController.getUserMeals
);

router.post(
  '/:user_id/nutrition/meals',
  validate(paramSchemas.userId),
  validateBody(nutritionSchemas.addMeal),
  NutritionController.addMeal
);

router.delete(
  '/:user_id/nutrition/meals/:meal_id',
  validate(z.object({
    params: z.object({
      user_id: z.string().regex(/^\d+$/, 'User ID must be a number'),
      meal_id: z.string().regex(/^\d+$/, 'Meal ID must be a number')
    })
  })),
  NutritionController.removeMeal
);

router.post(
  '/:user_id/nutrition/water',
  validate(paramSchemas.userId),
  validateBody(nutritionSchemas.addWater),
  NutritionController.addWater
);

router.get(
  '/food/:food_id',
  validate(z.object({
    params: z.object({
      food_id: z.string().regex(/^\d+$/, 'Food ID must be a number')
    })
  })),
  NutritionController.getFoodDetails
);

router.get('/food', NutritionController.getAllFood);

export default router;