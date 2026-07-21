import { Router } from 'express';
import {
  getTasks,
  getTaskStats,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Protect all task routes
router.use(authenticateToken);

router.get('/', getTasks);
router.get('/stats/summary', getTaskStats);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
