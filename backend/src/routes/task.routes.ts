import { Router } from 'express';
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Protect all task routes
router.use(authenticateToken);

router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
