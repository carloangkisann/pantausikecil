import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import { 
  UpdateProfileRequest, 
  CreatePregnancyRequest, 
  UpdatePregnancyRequest,
  CreateConnectionRequest,
  CreateReminderRequest
} from '../types/user';
import { UserService } from '../services/userService';
import { sendSuccess, sendError } from '../utils/helper';
import { asyncHandler } from '../middleware/errorHandler';

export class ProfileController {
  static getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.user_id);
    const profile = await UserService.getUserProfile(userId);
    sendSuccess(res, 'Profile retrieved successfully', profile);
  });

  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.user_id);
    const updateData: UpdateProfileRequest = req.body;
    const updatedProfile = await UserService.updateUserProfile(userId, updateData);
    sendSuccess(res, 'Profile updated successfully', updatedProfile);
  });

  static createPregnancy = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.user_id);
    const pregnancyData: CreatePregnancyRequest = req.body;
    const newPregnancy = await UserService.createPregnancy(userId, pregnancyData);
    sendSuccess(res, 'Pregnancy record created successfully', newPregnancy, 201);
  });

  static getPregnancies = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.user_id);
    const pregnancies = await UserService.getUserPregnancies(userId);
    sendSuccess(res, 'Pregnancies retrieved successfully', pregnancies);
  });

  static updatePregnancy = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.user_id);
    const pregnancyId = parseInt(req.params.pregnancy_id);
    const updateData: UpdatePregnancyRequest = req.body;
    const updatedPregnancy = await UserService.updatePregnancy(userId, pregnancyId, updateData);
    sendSuccess(res, 'Pregnancy record updated successfully', updatedPregnancy);
  });

  static getConnections = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.user_id);
    const connections = await UserService.getUserConnections(userId);
    sendSuccess(res, 'Connections retrieved successfully', connections);
  });

  static createConnection = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.user_id);
    const connectionData: CreateConnectionRequest = req.body;
    const newConnection = await UserService.createUserConnection(userId, connectionData);
    sendSuccess(res, 'Connection created successfully', newConnection, 201);
  });

  static deleteConnection = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.user_id);
    const connectionId = parseInt(req.params.connection_id);
    await UserService.deleteUserConnection(userId, connectionId);
    sendSuccess(res, 'Connection deleted successfully');
  });

  static createReminder = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.user_id);
    const reminderData: CreateReminderRequest = req.body;
    const newReminder = await UserService.createReminder(userId, reminderData);
    sendSuccess(res, 'Reminder created successfully', newReminder, 201);
  });
}