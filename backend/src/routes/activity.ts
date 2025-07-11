import { Router } from 'express';
import { ActivityController } from '../controllers/activityController.js';
import { validate, activitySchemas, paramSchemas, validateBody } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

router.use(authenticateToken);

router.get(
  '/:user_id/activities/today',
  validate(paramSchemas.userId),
  ActivityController.getTodayActivity
);

router.get(
  '/:user_id/activities/summary',
  validate(paramSchemas.userId),
  ActivityController.getActivitySummary
);

// Not implement yet
router.get(
  '/:user_id/activities/recommended',
  validate(paramSchemas.userId),
  ActivityController.getRecommendedActivities
);

router.get(
  '/:user_id/activities/history',
  validate(paramSchemas.userId),
  ActivityController.getActivityHistory
);

router.post(
  '/:user_id/activities',
  validate(paramSchemas.userId),
  validateBody(activitySchemas.addActivity),
  ActivityController.addActivity
);

router.delete(
  '/:user_id/activities/:activity_id',
  validate(z.object({
    params: z.object({
      user_id: z.string().regex(/^\d+$/, 'User ID must be a number'),
      activity_id: z.string().regex(/^\d+$/, 'Activity ID must be a number')
    })
  })),
  ActivityController.removeActivity
);

router.get('/', ActivityController.getAllActivities);

router.get(
  '/:activity_id',
  validate(z.object({
    params: z.object({
      activity_id: z.string().regex(/^\d+$/, 'Activity ID must be a number')
    })
  })),
  ActivityController.getActivityDetails
);


router.post(
  '/calculate-calories',
  validate(z.object({
    body: z.object({
      caloriesPerHour: z.number().min(1, 'Calories per hour must be greater than 0'),
      durationMinutes: z.number().min(1, 'Duration must be greater than 0')
    })
  })),
  ActivityController.calculateCalories
);

export default router;