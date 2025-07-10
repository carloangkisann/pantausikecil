import { Router } from 'express';
import { EmergencyController } from '../controllers/emergencyController';
import { validate, paramSchemas } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authenticateToken);

router.post(
  '/:user_id/emergency',
  validate(paramSchemas.userId),
  validate(z.object({
    body: z.object({
      message: z.string().max(500, 'Message must be less than 500 characters').optional()
    })
  })),
  EmergencyController.sendEmergencyNotification
);

router.get('/test-email', EmergencyController.testEmailConfiguration);

export default router;