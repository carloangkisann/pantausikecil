import { Response } from 'express';
import { AuthRequest } from '../types/auth.js';
import { AddMealRequest, AddWaterRequest } from '../types/api.js';
import { NutritionService } from '../services/nutritionService.js';
import { sendSuccess, sendError } from '../utils/helper.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { nutritionSchemas } from '../middleware/validation.js';
import { mealCategoryEnum } from '../db/schema.js';

type MealCategory = typeof mealCategoryEnum.enumValues[number];

export class NutritionController {
  static getNutritionalNeeds = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);

    const needs = await NutritionService.getUserNutritionalNeeds(userId);

    return sendSuccess(res, 'Nutritional needs retrieved successfully', needs);
  });

  static getTodayNutrition = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);

    const summary = await NutritionService.getTodayNutritionSummary(userId);

    return sendSuccess(res, 'Today nutrition summary retrieved successfully', summary);
  });

  static getNutritionSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const date = req.query.date as string;

    if (!date) {
      return sendError(res, 'Date parameter is required', 400);
    }

    const summary = await NutritionService.getDailyNutritionSummary(userId, date);

    return sendSuccess(res, 'Nutrition summary retrieved successfully', summary);
  });

  static getFoodDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const foodId = parseInt(req.params.food_id);

    const food = await NutritionService.getFoodDetails(foodId);

    return sendSuccess(res, 'Food details retrieved successfully', food);
  });

  static getAllFood = asyncHandler(async (req: AuthRequest, res: Response) => {

    const foods = await NutritionService.getAllFood();

    return sendSuccess(res, 'Food items retrieved successfully', foods);
  });


  static getFoodByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const validationResult = nutritionSchemas.getFoodByCategory.safeParse(req.params);

    if (!validationResult.success) {
        throw new AppError(validationResult.error.errors[0].message, 400);
    }

    const { category } = validationResult.data;

    const foods = await NutritionService.getFoodByCategory(category);

    return sendSuccess(res, 'Food items retrieved successfully', foods);
  });

  static addMeal = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const mealData: AddMealRequest = req.body;

    await NutritionService.addMeal(userId, mealData);

    return sendSuccess(res, 'Meal added successfully', null, 201);
  });

  static removeMeal = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const mealId = parseInt(req.params.meal_id);

    await NutritionService.removeMeal(userId, mealId);

    return sendSuccess(res, 'Meal removed successfully');
  });

  static addWater = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const waterData: AddWaterRequest = req.body;

    await NutritionService.addWater(userId, waterData);

    return sendSuccess(res, 'Water intake added successfully');
  });

  static getUserMeals = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const date = req.query.date as string;
    const mealCategory = req.query.mealCategory as MealCategory | undefined;

    if (!date) {
      return sendError(res, 'Date parameter is required', 400);
    }
    
    if (mealCategory && !mealCategoryEnum.enumValues.includes(mealCategory)) {
      return sendError(res, `Invalid meal category. Valid options: ${mealCategoryEnum.enumValues.join(', ')}`, 400);
    }
    
    const meals = await NutritionService.getUserMeals(userId, date, mealCategory);

    return sendSuccess(res, 'User meals retrieved successfully', meals);
  });
}