import { Response } from 'express';
import { AuthRequest } from '../types/auth.js';
import { EmailService, LocationData } from '../services/emailService.js';
import { sendSuccess, sendError } from '../utils/helper.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export class EmergencyController {
  
  static sendEmergencyNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    const { message, location } = req.body;

    try {
      let processedLocation: LocationData | undefined;
      
      if (location) {
        processedLocation = {
          ...location,
          ...(location.timestamp && { 
            timestamp: typeof location.timestamp === 'string' 
              ? new Date(location.timestamp) 
              : location.timestamp 
          })
        };
      }

      await EmailService.sendEmergencyNotification(userId, message, processedLocation);
      
      const responseMessage = location 
        ? 'Emergency notifications with location sent successfully to all connections'
        : 'Emergency notifications sent successfully to all connections';
        
      return sendSuccess(res, responseMessage);
      
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

  static testEmergencyWithLocation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.user_id);
    
    const sampleLocation: LocationData = {
      latitude: -6.2088,
      longitude: 106.8456,
      address: "Jakarta Pusat, DKI Jakarta",
      timestamp: new Date()
    };

    try {
      await EmailService.sendEmergencyNotification(
        userId, 
        "Test emergency notification dengan lokasi sample", 
        sampleLocation
      );
      
      return sendSuccess(res, 'Test emergency notification with location sent successfully');
      
    } catch (error: any) {
      console.error('Test emergency notification error:', error);
      
      if (error.statusCode === 400) {
        return sendError(res, error.message, 400);
      }
      
      return sendError(res, 'Failed to send test emergency notification', 500);
    }
  });
}