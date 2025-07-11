import { eq, and, sql, gte } from 'drizzle-orm';
import { db } from '../config/db.js';
import { reminder } from '../db/schema.js';
import { UserService } from './userService.js';
import { NutritionService } from './nutritionService.js';
import { ActivityService } from './activityService.js';
import { getToday, getDaysFromToday } from '../utils/helper.js';
import { getPregnancyInfo } from '../utils/trimesterCalculator.js';
import { UserReminder } from '../types/user.js';
import { NutritionalNeeds, DailyNutritionSummary, UserActivitySummary } from '../types/api.js';

export interface DashboardData {
  pregnancyInfo?: {
    trimester: number;
    week: number;
    trimesterName: string;
    startDate: string;
  };
  nutritionalNeeds?: NutritionalNeeds;
  todayNutrition: DailyNutritionSummary;
  todayActivity: UserActivitySummary;
  upcomingReminders: UserReminder[];
}

export class DashboardService {
  static async getDashboardData(userId: number): Promise<DashboardData> {
    await UserService.getUserProfile(userId);

    const activePregnancy = await UserService.getActivePregnancy(userId);
    let pregnancyInfo = undefined;
    let nutritionalNeeds = undefined;

    if (activePregnancy) {
      const pregnancyData = getPregnancyInfo(activePregnancy.startDate);
      pregnancyInfo = {
        ...pregnancyData,
        startDate: activePregnancy.startDate,
      };

      const needs = await NutritionService.getNutritionalNeeds(pregnancyData.trimester);
      nutritionalNeeds = needs || undefined;
    }

    const todayNutrition = await NutritionService.getTodayNutritionSummary(userId);

    const todayActivity = await ActivityService.getTodayActivitySummary(userId);

    const upcomingReminders = await this.getUpcomingReminders(userId);

    return {
      pregnancyInfo,
      nutritionalNeeds,
      todayNutrition,
      todayActivity,
      upcomingReminders,
    };
  }

  static calculateNutritionProgress(
    todayNutrition: DailyNutritionSummary,
    needs: NutritionalNeeds
  ) {
    return {
      water: needs.waterNeedsMl ? Math.min(100, (todayNutrition.totalWaterMl / needs.waterNeedsMl) * 100) : 0,
      protein: needs.proteinNeeds ? Math.min(100, (todayNutrition.totalProtein / needs.proteinNeeds) * 100) : 0,
      folicAcid: needs.folicAcidNeeds ? Math.min(100, (todayNutrition.totalFolicAcid / needs.folicAcidNeeds) * 100) : 0,
      iron: needs.ironNeeds ? Math.min(100, (todayNutrition.totalIron / needs.ironNeeds) * 100) : 0,
      calcium: needs.calciumNeeds ? Math.min(100, (todayNutrition.totalCalcium / needs.calciumNeeds) * 100) : 0,
      vitaminD: needs.vitaminDNeeds ? Math.min(100, (todayNutrition.totalVitaminD / needs.vitaminDNeeds) * 100) : 0,
      omega3: needs.omega3Needs ? Math.min(100, (todayNutrition.totalOmega3 / needs.omega3Needs) * 100) : 0,
      fiber: needs.fiberNeeds ? Math.min(100, (todayNutrition.totalFiber / needs.fiberNeeds) * 100) : 0,
      iodine: needs.iodineNeeds ? Math.min(100, (todayNutrition.totalIodine / needs.iodineNeeds) * 100) : 0,
      fat: needs.fatNeeds ? Math.min(100, (todayNutrition.totalFat / needs.fatNeeds) * 100) : 0,
      vitaminB: needs.vitaminBNeeds ? Math.min(100, (todayNutrition.totalVitaminB / needs.vitaminBNeeds) * 100) : 0
    };
  }

  static async getWeeklySummary(userId: number) {
    const today = getToday();
    const weekAgo = getDaysFromToday(-7);

    const nutritionPromises = [];
    const activityPromises = [];

    for (let i = -6; i <= 0; i++) {
      const date = getDaysFromToday(i);
      nutritionPromises.push(
        NutritionService.getDailyNutritionSummary(userId, date)
      );
      activityPromises.push(
        ActivityService.getUserActivitySummary(userId, date)
      );
    }

    const [nutritionSummaries, activitySummaries] = await Promise.all([
      Promise.all(nutritionPromises),
      Promise.all(activityPromises)
    ]);

    return {
      nutrition: nutritionSummaries,
      activities: activitySummaries,
    };
  }

  static async getRemindersByDate(userId: number, date: string): Promise<UserReminder[]> {
    await UserService.getUserProfile(userId);

    const reminders = await db
      .select({
        id: reminder.id,
        title: reminder.title,
        description: reminder.description,
        reminderDate: reminder.reminderDate,
        startTime: reminder.startTime,
        endTime: reminder.endTime,
      })
      .from(reminder)
      .where(
        and(
          eq(reminder.userId, userId),
          eq(reminder.reminderDate, date)
        )
      )
      .orderBy(reminder.startTime);

    return reminders as UserReminder[];
  }

  static async getUpcomingReminders(userId: number): Promise<UserReminder[]> {
    await UserService.getUserProfile(userId);

    const today = getToday();
    const thwoDaysFromNow = getDaysFromToday(2);

    const reminders = await db
      .select({
        id: reminder.id,
        title: reminder.title,
        description: reminder.description,
        reminderDate: reminder.reminderDate,
        startTime: reminder.startTime,
        endTime: reminder.endTime,
      })
      .from(reminder)
      .where(
        and(
          eq(reminder.userId, userId),
          gte(reminder.reminderDate, today),
          sql`${reminder.reminderDate} <= ${thwoDaysFromNow}`
        )
      )
      .orderBy(reminder.reminderDate, reminder.startTime);

    return reminders as UserReminder[];
  }

  static async deleteReminder(userId: number, reminderId: number): Promise<void> {
    await UserService.getUserProfile(userId);

    const existingReminder = await db
      .select()
      .from(reminder)
      .where(
        and(
          eq(reminder.id, reminderId),
          eq(reminder.userId, userId)
        )
      )
      .limit(1);

    if (existingReminder.length === 0) {
      throw new Error('Reminder not found');
    }

    await db
      .delete(reminder)
      .where(eq(reminder.id, reminderId));
  }
}