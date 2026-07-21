import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High'], {
    errorMap: () => ({ message: 'Priority must be Low, Medium, or High' }),
  }),
  status: z.enum(['Pending', 'In Progress', 'Completed'], {
    errorMap: () => ({ message: 'Status must be Pending, In Progress, or Completed' }),
  }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid due date format',
  }).refine((val) => {
    const inputDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare date part only
    return inputDate >= today;
  }, {
    message: 'Due date cannot be earlier than today',
  }),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
