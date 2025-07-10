import { eq, and, sql } from 'drizzle-orm';
import { db } from '../config/db';
import { 
  nutritionalAndWaterNeeds, 
  userMeal, 
  userWaterLogs, 
  food,
  priceCategoryEnum,
} from '../db/schema';
import { AppError } from '../middleware/errorHandler';
import { UserService } from './userService';
import { calculateTrimester } from '../utils/trimesterCalculator';
import { getToday } from '../utils/helper';
import { 
  NutritionalNeeds, 
  DailyNutritionSummary, 
  FoodItem,
  AddMealRequest,
  AddWaterRequest 
} from '../types/api';

type FoodPriceCategory = typeof priceCategoryEnum.enumValues[number];

export class NutritionService {
  static async getNutritionalNeeds(trimester: number): Promise<NutritionalNeeds | null> {
    const needs = await db
      .select()
      .from(nutritionalAndWaterNeeds)
      .where(eq(nutritionalAndWaterNeeds.trimesterNumber, trimester))
      .limit(1);

    return needs.length > 0 ? (needs[0] as NutritionalNeeds) : null;
  }

  static async getUserNutritionalNeeds(userId: number): Promise<NutritionalNeeds | null> {
    const activePregnancy = await UserService.getActivePregnancy(userId);
    
    if (!activePregnancy) {
      throw new AppError('No active pregnancy found', 404);
    }

    const trimester = calculateTrimester(activePregnancy.startDate);

    return await this.getNutritionalNeeds(trimester);
  }

  static async getDailyNutritionSummary(userId: number, date: string): Promise<DailyNutritionSummary> {
    await UserService.getUserProfile(userId);

    const mealsResult = await db
      .select({
        protein: food.protein,
        folicAcid: food.folicAcid,
        iron: food.iron,
        calcium: food.calcium,
        vitaminD: food.vitaminD,
        omega3: food.omega3,
        fiber: food.fiber,
        iodine: food.iodine,
        fat: food.fat,
        vitaminB: food.vitaminB,
      })
      .from(userMeal)
      .innerJoin(food, eq(userMeal.foodId, food.id))
      .where(
        and(
          eq(userMeal.userId, userId),
          eq(userMeal.consumptionDate, date)
        )
      );

    // Calculate total nutrition
    const totalNutrition = mealsResult.reduce(
      (acc, meal) => ({
        totalProtein: acc.totalProtein + (meal.protein || 0),
        totalFolicAcid: acc.totalFolicAcid + (meal.folicAcid || 0),
        totalIron: acc.totalIron + (meal.iron || 0),
        totalCalcium: acc.totalCalcium + (meal.calcium || 0),
        totalVitaminD: acc.totalVitaminD + (meal.vitaminD || 0),
        totalOmega3: acc.totalOmega3 + (meal.omega3 || 0),
        totalFiber: acc.totalFiber + (meal.fiber || 0),
        totalIodine: acc.totalIodine + (meal.iodine || 0),
        totalFat: acc.totalFat + (meal.fat || 0),
        totalVitaminB: acc.totalVitaminB + (meal.vitaminB || 0),
      }),
      {
        totalProtein: 0,
        totalFolicAcid: 0,
        totalIron: 0,
        totalCalcium: 0,
        totalVitaminD: 0,
        totalOmega3: 0,
        totalFiber: 0,
        totalIodine: 0,
        totalFat: 0,
        totalVitaminB: 0,
      }
    );

    const waterResult = await db
      .select({
        totalWater: sql<number>`COALESCE(SUM(${userWaterLogs.amountMl}), 0)`,
      })
      .from(userWaterLogs)
      .where(
        and(
          eq(userWaterLogs.userId, userId),
          eq(userWaterLogs.logDate, date)
        )
      );

    const totalWaterMl = waterResult[0]?.totalWater || 0;

    return {
      date,
      ...totalNutrition,
      totalWaterMl,
    };
  }

  static async getTodayNutritionSummary(userId: number): Promise<DailyNutritionSummary> {
    return await this.getDailyNutritionSummary(userId, getToday());
  }

  static async getFoodDetails(foodId: number): Promise<FoodItem> {
    const foodResult = await db
      .select()
      .from(food)
      .where(eq(food.id, foodId))
      .limit(1);

    if (foodResult.length === 0) {
      throw new AppError('Food item not found', 404);
    }

    return foodResult[0] as FoodItem;
  }

  static async getAllFood(): Promise<FoodItem[]> {
    const foods = await db.select().from(food);
    return foods as FoodItem[];
  }

  static async getFoodByCategory(category: FoodPriceCategory): Promise<FoodItem[]> {
    const foods = await db
      .select()
      .from(food)
      .where(eq(food.priceCategory, category));
    return foods as FoodItem[];
  }


  static async addMeal(userId: number, mealData: AddMealRequest): Promise<void> {
    await UserService.getUserProfile(userId);

    await this.getFoodDetails(mealData.foodId);

    await db
      .insert(userMeal)
      .values({
        userId,
        foodId: mealData.foodId,
        consumptionDate: mealData.consumptionDate,
        mealCategory: mealData.mealCategory,
      });
  }

  static async removeMeal(userId: number, mealId: number): Promise<void> {
    await UserService.getUserProfile(userId);

    const existingMeal = await db
      .select()
      .from(userMeal)
      .where(
        and(
          eq(userMeal.id, mealId),
          eq(userMeal.userId, userId)
        )
      )
      .limit(1);

    if (existingMeal.length === 0) {
      throw new AppError('Meal entry not found', 404);
    }

    await db
      .delete(userMeal)
      .where(eq(userMeal.id, mealId));
  }

  static async addWater(userId: number, waterData: AddWaterRequest): Promise<void> {
    await UserService.getUserProfile(userId);

    const today = getToday();

    const existingLog = await db
      .select()
      .from(userWaterLogs)
      .where(
        and(
          eq(userWaterLogs.userId, userId),
          eq(userWaterLogs.logDate, today)
        )
      )
      .limit(1);

    if (existingLog.length > 0) {
      await db
        .update(userWaterLogs)
        .set({
          amountMl: sql`${userWaterLogs.amountMl} + ${waterData.amountMl}`,
        })
        .where(eq(userWaterLogs.id, existingLog[0].id));
    } else {
      await db
        .insert(userWaterLogs)
        .values({
          userId,
          logDate: today,
          amountMl: waterData.amountMl,
        });
    }
  }

  static async getUserMeals(userId: number, date: string) {
    await UserService.getUserProfile(userId);

    const meals = await db
      .select({
        id: userMeal.id,
        mealCategory: userMeal.mealCategory,
        consumptionDate: userMeal.consumptionDate,
        food: {
          id: food.id,
          foodName: food.foodName,
          description: food.description,
          priceCategory: food.priceCategory,
          protein: food.protein,
          folicAcid: food.folicAcid,
          iron: food.iron,
          calcium: food.calcium,
          vitaminD: food.vitaminD,
          omega3: food.omega3,
          fiber: food.fiber,
          iodine: food.iodine,
          fat: food.fat,
          vitaminB: food.vitaminB,
        }
      })
      .from(userMeal)
      .innerJoin(food, eq(userMeal.foodId, food.id))
      .where(
        and(
          eq(userMeal.userId, userId),
          eq(userMeal.consumptionDate, date)
        )
      );

    return meals;
  }
}