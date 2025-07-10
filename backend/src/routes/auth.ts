import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateBody, authSchemas } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', validateBody(authSchemas.register), AuthController.register);

router.post('/login', validateBody(authSchemas.login), AuthController.login);

router.get('/me', authenticateToken, AuthController.getCurrentUser);

export default router;