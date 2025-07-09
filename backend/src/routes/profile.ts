import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { validate, validateBody, profileSchemas, paramSchemas, reminderSchemas } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get(
  '/:user_id/profile',
  validate(paramSchemas.userId),
  ProfileController.getProfile
);

router.put(
  '/:user_id/profile',
  validate(paramSchemas.userId),
  validateBody(profileSchemas.updateProfile),
  ProfileController.updateProfile
);

router.post(
  '/:user_id/pregnancies',
  validate(paramSchemas.userId),
  validateBody(profileSchemas.createPregnancy),
  ProfileController.createPregnancy
);

router.get(
  '/:user_id/pregnancies',
  validate(paramSchemas.userId),
  ProfileController.getPregnancies
);

router.put(
  '/:user_id/pregnancies/:pregnancy_id',
  validate(paramSchemas.pregnancyId),
  validateBody(profileSchemas.updatePregnancy),
  ProfileController.updatePregnancy
);

router.get(
  '/:user_id/connections',
  validate(paramSchemas.userId),
  ProfileController.getConnections
);

router.post(
  '/:user_id/connections',
  validate(paramSchemas.userId),
  validateBody(profileSchemas.createConnection),
  ProfileController.createConnection
);

router.delete(
  '/:user_id/connections/:connection_id',
  validate(paramSchemas.connectionId),
  ProfileController.deleteConnection
);

router.post(
  '/:user_id/reminders',
  validate(paramSchemas.userId),
  validateBody(reminderSchemas.createReminder),
  ProfileController.createReminder
);

export default router;