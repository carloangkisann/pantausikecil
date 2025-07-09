import { eq, and, sql } from 'drizzle-orm';
import { db } from '../config/db';
import { activity, userActivities } from '../db/schema';
import { AppError } from '../middleware/errorHandler';
import { UserService } from './userService';
import { getToday } from '../utils/helper';
import { 
  ActivityItem,
  AddUserActivityRequest,
  UserActivitySummary
} from '../types/api';

export class ActivityService {
  static async getActivityDetails(activityId: number): Promise<ActivityItem> {
    const activityResult = await db
      .select()
      .from(activity)
      .where(eq(activity.id, activityId))
      .limit(1);

    if (activityResult.length === 0) {
      throw new AppError('Activity not found', 404);
    }

    return activityResult[0] as ActivityItem;
  }

  static async getAllActivities(): Promise<ActivityItem[]> {
    const activities = await db.select().from(activity);
    return activities as ActivityItem[];
  }

  static async addUserActivity(userId: number, activityData: AddUserActivityRequest): Promise<void> {
    await UserService.getUserProfile(userId);

    await this.getActivityDetails(activityData.activityId);

    await db
      .insert(userActivities)
      .values({
        userId,
        activityId: activityData.activityId,
        activityDate: activityData.activityDate,
        durationMinutes: activityData.durationMinutes,
        totalCalories: activityData.totalCalories,
      });
  }

  static async removeUserActivity(userId: number, userActivityId: number): Promise<void> {
    await UserService.getUserProfile(userId);

    const existingActivity = await db
      .select()
      .from(userActivities)
      .where(
        and(
          eq(userActivities.id, userActivityId),
          eq(userActivities.userId, userId)
        )
      )
      .limit(1);

    if (existingActivity.length === 0) {
      throw new AppError('Activity entry not found', 404);
    }

    await db
      .delete(userActivities)
      .where(eq(userActivities.id, userActivityId));
  }

  static async getUserActivitySummary(userId: number, date: string): Promise<UserActivitySummary> {
    await UserService.getUserProfile(userId);

    const activitiesResult = await db
      .select({
        id: userActivities.id,
        durationMinutes: userActivities.durationMinutes,
        totalCalories: userActivities.totalCalories,
        activityName: activity.activityName,
      })
      .from(userActivities)
      .innerJoin(activity, eq(userActivities.activityId, activity.id))
      .where(
        and(
          eq(userActivities.userId, userId),
          eq(userActivities.activityDate, date)
        )
      );

    // Calculate total duration and calories
    const totals = activitiesResult.reduce(
      (acc, act) => ({
        totalDurationMinutes: acc.totalDurationMinutes + (act.durationMinutes || 0),
        totalCalories: acc.totalCalories + (act.totalCalories || 0),
      }),
      {
        totalDurationMinutes: 0,
        totalCalories: 0,
      }
    );

    return {
      date,
      totalDurationMinutes: totals.totalDurationMinutes,
      totalCalories: totals.totalCalories,
      activities: activitiesResult.map(act => ({
        id: act.id,
        activityName: act.activityName,
        durationMinutes: act.durationMinutes || 0,
        totalCalories: act.totalCalories || 0,
      })),
    };
  }

  static async getTodayActivitySummary(userId: number): Promise<UserActivitySummary> {
    return await this.getUserActivitySummary(userId, getToday());
  }

  static calculateCalories(caloriesPerHour: number, durationMinutes: number): number {
    return Math.round((caloriesPerHour * durationMinutes) / 60);
  }


  // Not impement yet (AI service)
  static async getRecommendedActivities(userId: number): Promise<ActivityItem[]> {
    // For now, return light activities for pregnant women
    // This can be enhanced with more sophisticated recommendation logic
    const activities = await db
      .select()
      .from(activity)
      .where(eq(activity.level, 'Ringan'));

    return activities as ActivityItem[];
  }

  static async getUserActivityHistory(
    userId: number, 
    startDate: string, 
    endDate: string
  ): Promise<UserActivitySummary[]> {
    await UserService.getUserProfile(userId);

    // Get activities for date range
    const activitiesResult = await db
      .select({
        activityDate: userActivities.activityDate,
        durationMinutes: userActivities.durationMinutes,
        totalCalories: userActivities.totalCalories,
        activityName: activity.activityName,
        userActivityId: userActivities.id,
      })
      .from(userActivities)
      .innerJoin(activity, eq(userActivities.activityId, activity.id))
      .where(
        and(
          eq(userActivities.userId, userId),
          sql`${userActivities.activityDate} BETWEEN ${startDate} AND ${endDate}`
        )
      );

    // Group by date
    const groupedByDate = activitiesResult.reduce((acc, act) => {
      const date = act.activityDate || '';
      if (!acc[date]) {
        acc[date] = {
          date,
          totalDurationMinutes: 0,
          totalCalories: 0,
          activities: [],
        };
      }

      acc[date].totalDurationMinutes += act.durationMinutes || 0;
      acc[date].totalCalories += act.totalCalories || 0;
      acc[date].activities.push({
        id: act.userActivityId,
        activityName: act.activityName,
        durationMinutes: act.durationMinutes || 0,
        totalCalories: act.totalCalories || 0,
      });

      return acc;
    }, {} as Record<string, UserActivitySummary>);

    return Object.values(groupedByDate);
  }
}