import { Response } from 'express';
import { ApiResponse } from '../types/api.js';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T
): void => {
  const response: ApiResponse<T> = {
    success,
    message,
    ...(data && { data })
  };
  
  res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): void => {
  sendResponse(res, statusCode, true, message, data);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  error?: string
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error })
  };
  
  res.status(statusCode).json(response);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getToday = (): string => {
  return formatDate(new Date());
};

export const isToday = (dateString: string): boolean => {
  return dateString === getToday();
};

export const getDaysFromToday = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};