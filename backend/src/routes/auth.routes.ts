import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public auth routes
router.post('/login', login);

// Protected auth routes
router.get('/me', authenticateToken, getMe);

export default router;
