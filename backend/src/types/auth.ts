import { Request } from 'express';

export interface AuthUser {
  id: number;
  email: string;
  fullName?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: AuthUser;
    token: string;
  };
}