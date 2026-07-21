import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';

// Get all tasks with search, filtering, and sorting
export const getTasks = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const { search, status, priority, sort } = req.query;

    // Build Prisma query filters
    const where: any = {
      userId: req.user.userId,
    };

    // 1. Search by Task Title
    if (search && typeof search === 'string' && search.trim() !== '') {
      where.title = {
        contains: search.trim(),
      };
    }

    // 2. Filter by Status
    if (status && typeof status === 'string' && status.trim() !== '') {
      where.status = status.trim();
    }

    // 3. Filter by Priority
    if (priority && typeof priority === 'string' && priority.trim() !== '') {
      where.priority = priority.trim();
    }

    // 4. Sorting logic
    let orderBy: any = { createdAt: 'desc' }; // Default: Newest Created
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'dueDate') {
      orderBy = { dueDate: 'asc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
    });

    return res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: { tasks },
    });
  } catch (error: any) {
    console.error('Get tasks error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch tasks' });
  }
};

// Get Dashboard Summary Statistics
export const getTaskStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const userId = req.user.userId;
    const now = new Date();

    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'Pending' } }),
      prisma.task.count({ where: { userId, status: 'In Progress' } }),
      prisma.task.count({ where: { userId, status: 'Completed' } }),
      prisma.task.count({
        where: {
          userId,
          status: { not: 'Completed' },
          dueDate: { lt: now },
        },
      }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        stats: {
          total,
          pending,
          inProgress,
          completed,
          overdue,
        },
      },
    });
  } catch (error: any) {
    console.error('Get task stats error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch task dashboard stats' });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const parseResult = createTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((err) => err.message);
      return res.status(400).json({
        status: 'fail',
        message: errors.join(', '),
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { title, description, priority, status, dueDate } = parseResult.data;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority,
        status,
        dueDate: new Date(dueDate),
        userId: req.user.userId,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error: any) {
    console.error('Create task error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to create task' });
  }
};

// Get single task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!task) {
      return res.status(404).json({ status: 'fail', message: 'Task not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (error: any) {
    console.error('Get task error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch task details' });
  }
};

// Update task by ID
export const updateTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const { id } = req.params;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ status: 'fail', message: 'Task not found' });
    }

    const parseResult = updateTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((err) => err.message);
      return res.status(400).json({
        status: 'fail',
        message: errors.join(', '),
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const dataToUpdate = { ...parseResult.data };
    const updatePayload: any = { ...dataToUpdate };

    if (dataToUpdate.dueDate) {
      updatePayload.dueDate = new Date(dataToUpdate.dueDate);
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updatePayload,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: { task: updatedTask },
    });
  } catch (error: any) {
    console.error('Update task error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to update task' });
  }
};

// Delete task by ID
export const deleteTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const { id } = req.params;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ status: 'fail', message: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to delete task' });
  }
};
