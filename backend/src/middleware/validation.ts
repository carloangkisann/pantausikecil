import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { priceCategoryEnum } from '../db/schema.js';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map(err => err.message)
          .join(', ');
        
        res.status(400).json({
          success: false,
          message: errorMessage
        });
        return;
      }
      next(error);
    }
  };
};

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map(err => err.message)
          .join(', ');
        
        res.status(400).json({
          success: false,
          message: errorMessage
        });
        return;
      }
      next(error);
    }
  };
};

// Auth validation
export const authSchemas = {
  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  }),
  
  register: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  })
};

// Profile validation
export const profileSchemas = {
  updateProfile: z.object({
    fullName: z.string().min(1, 'Full name is required').optional(),
    profileImage: z.string().url('Invalid image URL').optional(),
    age: z.number().optional(),
    isVegetarian: z.boolean().optional(),
    financialStatus: z.enum(['Rendah', 'Menengah', 'Tinggi']).optional(),
    allergy: z.string().optional(),
    medicalCondition: z.string().optional()
  }),
  
  createPregnancy: z.object({
    pregnancyNumber: z.number().min(1, 'Pregnancy number must be at least 1'),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    babyGender: z.enum(['Laki-laki', 'Perempuan', 'Tidak Diketahui']).optional()
  }),
  
  updatePregnancy: z.object({
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    babyGender: z.enum(['Laki-laki', 'Perempuan', 'Tidak Diketahui']).optional()
  }),
  
  createConnection: z.object({
    connectionEmail: z.string().email('Invalid email format'),
    connectionName: z.string().min(1, 'Connection name is required'),
    relationshipType: z.enum(['Suami', 'Lainnya'])
  })
};

// Nutrition validation
export const nutritionSchemas = {
  addMeal: z.object({
    foodId: z.number().min(1, 'Food ID is required'),
    consumptionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mealCategory: z.enum(['Sarapan', 'Makan Siang', 'Makan Malam', 'Cemilan'])
  }),
  
  addWater: z.object({
    amountMl: z.number().min(1, 'Amount must be greater than 0')
  }),

  getFoodByCategory: z.object({
    category: z.enum(priceCategoryEnum.enumValues, { 
      errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
          return { message: `Category must be one of: ${priceCategoryEnum.enumValues.join(', ')}` };
        }
        return { message: ctx.defaultError };
      },
    }),
  }),
};

// Activity validation
export const activitySchemas = {
  addActivity: z.object({
    activityId: z.number().min(1, 'Activity ID is required'),
    activityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    durationMinutes: z.number().min(1, 'Duration must be greater than 0'),
    totalCalories: z.number().min(0, 'Calories cannot be negative')
  })
};

// Reminder validation
const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/; 

export const reminderSchemas = {
  createReminder: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    reminderDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    startTime: z.string().regex(timeRegex, 'Start time must be in HH:MM:SS format').optional(), 
    endTime: z.string().regex(timeRegex, 'End time must be in HH:MM:SS format').optional()   
  })
};

// Parameter validation
export const paramSchemas = {
  userId: z.object({
    params: z.object({
      user_id: z.string().regex(/^\d+$/, 'User ID must be a number')
    })
  }),
  
  pregnancyId: z.object({
    params: z.object({
      user_id: z.string().regex(/^\d+$/, 'User ID must be a number'),
      pregnancy_id: z.string().regex(/^\d+$/, 'Pregnancy ID must be a number')
    })
  }),
  
  connectionId: z.object({
    params: z.object({
      user_id: z.string().regex(/^\d+$/, 'User ID must be a number'),
      connection_id: z.string().regex(/^\d+$/, 'Connection ID must be a number')
    })
  })
};