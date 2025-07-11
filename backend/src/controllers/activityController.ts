import { Response } from 'express';
import { AuthRequest } from '../types/auth.js';
import { AddUserActivityRequest } from '../types/api.js';
import { ActivityService } from '../services/activityService.js';
import { sendSuccess, sendError } from '../utils/helper.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export class ActivityController {
  static getTodayActivity = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);

    const summary = await ActivityService.getTodayActivitySummary(userId);

    return sendSuccess(res, 'Today activity summary retrieved successfully', summary);
  });

  static getActivitySummary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const date = req.query.date as string;

    if (!date) {
      return sendError(res, 'Date parameter is required', 400);
    }

    const summary = await ActivityService.getUserActivitySummary(userId, date);

    return sendSuccess(res, 'Activity summary retrieved successfully', summary);
  });

  static addActivity = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const activityData: AddUserActivityRequest = req.body;

    await ActivityService.addUserActivity(userId, activityData);

    return sendSuccess(res, 'Activity added successfully', null, 201);
  });

  static removeActivity = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const userActivityId = parseInt(req.params.activity_id);

    await ActivityService.removeUserActivity(userId, userActivityId);

    return sendSuccess(res, 'Activity removed successfully');
  });

  static getActivityDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const activityId = parseInt(req.params.activity_id);

    const activity = await ActivityService.getActivityDetails(activityId);

    return sendSuccess(res, 'Activity details retrieved successfully', activity);
  });

  static getAllActivities = asyncHandler(async (req: AuthRequest, res: Response) => {
    const activities = await ActivityService.getAllActivities();

    return sendSuccess(res, 'Activities retrieved successfully', activities);
  });

  static getRecommendedActivities = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);

    const activities = await ActivityService.getRecommendedActivities(userId);

    return sendSuccess(res, 'Recommended activities retrieved successfully', activities);
  });

  static getActivityHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
      return sendError(res, 'Start date and end date parameters are required', 400);
    }

    const history = await ActivityService.getUserActivityHistory(userId, startDate, endDate);

    return sendSuccess(res, 'Activity history retrieved successfully', history);
  });

  static calculateCalories = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { caloriesPerHour, durationMinutes } = req.body;

    if (!caloriesPerHour || !durationMinutes) {
      return sendError(res, 'caloriesPerHour and durationMinutes are required', 400);
    }

    const totalCalories = ActivityService.calculateCalories(caloriesPerHour, durationMinutes);

    return sendSuccess(res, 'Calories calculated successfully', { totalCalories });
  });
}