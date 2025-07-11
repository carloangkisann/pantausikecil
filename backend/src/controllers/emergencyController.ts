import { Response } from 'express';
import { AuthRequest } from '../types/auth.js';
import { EmailService } from '../services/emailService.js';
import { sendSuccess, sendError } from '../utils/helper.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export class EmergencyController {
  static sendEmergencyNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const { message } = req.body;

    try {
      await EmailService.sendEmergencyNotification(userId, message);
      
      return sendSuccess(res, 'Emergency notifications sent successfully to all connections');
    } catch (error: any) {
      console.error('Emergency notification error:', error);
      
      if (error.statusCode === 400) {
        return sendError(res, error.message, 400);
      }
      
      return sendError(res, 'Failed to send emergency notifications', 500);
    }
  });

  static testEmailConfiguration = asyncHandler(async (req: AuthRequest, res: Response) => {
    const isConfigured = await EmailService.testEmailConnection();

    if (isConfigured) {
      return sendSuccess(res, 'Email configuration is working correctly');
    } else {
      return sendError(res, 'Email configuration is not working', 500);
    }
  });
}