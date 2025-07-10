import { Response } from 'express';
import { AuthRequest, LoginRequest, RegisterRequest } from '../types/auth';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/helper';
import { asyncHandler } from '../middleware/errorHandler';

export class AuthController {
  static register = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userData: RegisterRequest = req.body;
    const result = await AuthService.register(userData);
    sendSuccess(res, 'User registered successfully', result, 201);
  });

  static login = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const loginData: LoginRequest = req.body;
    const result = await AuthService.login(loginData);
    sendSuccess(res, 'Login successful', result);
  });

  static getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'User not authenticated', 401);
      return;
    }

    const user = await AuthService.verifyUser(req.user.id);
    sendSuccess(res, 'User info retrieved successfully', { user });
  });
}