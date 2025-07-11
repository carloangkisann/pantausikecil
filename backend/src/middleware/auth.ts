import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JWTPayload } from '../types/auth.js';
import { ENV } from '../config/env.js';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token required'
    });
    return;
  }

  if (!ENV.JWT_SECRET) {
    res.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JWTPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
    return;
  }
};

export const generateToken = (userId: number, email: string): string => {
  if (!ENV.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  const payload: JWTPayload = {
    userId,
    email
  };

  return jwt.sign(payload, ENV.JWT_SECRET, { 
    expiresIn: ENV.JWT_EXPIRES_IN || '24h' 
  } as jwt.SignOptions );
};