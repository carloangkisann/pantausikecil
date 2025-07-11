import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.js';
import { validate, paramSchemas } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get(
  '/:user_id/dashboard',
  validate(paramSchemas.userId),
  DashboardController.getDashboard
);

router.get(
  '/:user_id/dashboard/weekly',
  validate(paramSchemas.userId),
  DashboardController.getWeeklySummary
);

router.get(
  '/:user_id/dashboard/nutrition-progress',
  validate(paramSchemas.userId),
  DashboardController.getNutritionProgress
);

router.get(
  '/:user_id/reminders/upcoming',
  validate(paramSchemas.userId),
  DashboardController.getUpcomingReminders
);

router.get(
  '/:user_id/reminders',
  validate(paramSchemas.userId),
  DashboardController.getRemindersByDate
);

router.delete(
  '/:user_id/reminders/:reminder_id',
  validate(paramSchemas.userId),
  DashboardController.deleteReminder
);

export default router;