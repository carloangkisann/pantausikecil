import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateBody, authSchemas } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', validateBody(authSchemas.register), AuthController.register);

router.post('/login', validateBody(authSchemas.login), AuthController.login);

router.get('/me', authenticateToken, AuthController.getCurrentUser);

export default router;