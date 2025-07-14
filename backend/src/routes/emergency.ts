import { Router } from 'express';
import { EmergencyController } from '../controllers/emergencyController.js';
import { validate, paramSchemas } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

router.use(authenticateToken);

const locationSchema = z.object({
  latitude: z.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  address: z.string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
  timestamp: z.string()
    .datetime('Invalid timestamp format')
    .or(z.date())
    .optional()
}).strict();

const emergencyBodySchema = z.object({
  body: z.object({
    message: z.string()
      .max(500, 'Message must be less than 500 characters')
      .optional(),
    location: locationSchema.optional()
  }).strict()
});

router.post(
  '/:user_id/emergency',
  validate(paramSchemas.userId),
  validate(emergencyBodySchema),
  EmergencyController.sendEmergencyNotification
);

// Test emergency with sample location
router.post(
  '/:user_id/emergency/test',
  validate(paramSchemas.userId),
  EmergencyController.testEmergencyWithLocation
);

// Test email configuration
router.get(
  '/test-email', 
  EmergencyController.testEmailConfiguration
);

export default router;