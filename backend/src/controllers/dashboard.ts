import { Response } from 'express';
import { AuthRequest } from '../types/auth.js';
import { DashboardService } from '../services/dashboard.js';
import { sendSuccess } from '../utils/helper.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export class DashboardController {
  static getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);

    const dashboardData = await DashboardService.getDashboardData(userId);

    return sendSuccess(res, 'Dashboard data retrieved successfully', dashboardData);
  });

  static getWeeklySummary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);

    const weeklySummary = await DashboardService.getWeeklySummary(userId);

    return sendSuccess(res, 'Weekly summary retrieved successfully', weeklySummary);
  });

  static getNutritionProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);

    const dashboardData = await DashboardService.getDashboardData(userId);
    
    if (!dashboardData.nutritionalNeeds) {
      return sendSuccess(res, 'Nutrition progress calculated successfully', {
        protein: 0,
        folicAcid: 0,
        iron: 0,
        calcium: 0,
        water: 0,
      });
    }

    const progress = DashboardService.calculateNutritionProgress(
      dashboardData.todayNutrition,
      dashboardData.nutritionalNeeds
    );

    return sendSuccess(res, 'Nutrition progress calculated successfully', progress);
  });

  static getUpcomingReminders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);

    const reminders = await DashboardService.getUpcomingReminders(userId);

    return sendSuccess(res, 'Upcoming reminders retrieved successfully', reminders);
  });

  static getRemindersByDate = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const date = req.query.date as string;

    if (!date) {
      return sendSuccess(res, 'Date parameter is required to get reminders for specific date');
    }

    const reminders = await DashboardService.getRemindersByDate(userId, date);

    return sendSuccess(res, 'Reminders retrieved successfully', reminders);
  });
  
  static deleteReminder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const reminderId = parseInt(req.params.reminder_id);

    await DashboardService.deleteReminder(userId, reminderId);

    return sendSuccess(res, 'Reminder deleted successfully');
  });
}