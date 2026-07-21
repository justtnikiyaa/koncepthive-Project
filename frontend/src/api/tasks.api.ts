import api from './client';
import type { Task, TaskStats, TaskFilterParams } from '../types';

export const getTasksApi = async (params?: TaskFilterParams): Promise<{ status: string; data: { tasks: Task[] } }> => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const getTaskStatsApi = async (): Promise<{ status: string; data: { stats: TaskStats } }> => {
  const response = await api.get('/tasks/stats/summary');
  return response.data;
};

export const createTaskApi = async (taskData: {
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate: string;
}): Promise<{ status: string; data: { task: Task } }> => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTaskApi = async (
  id: string,
  taskData: Partial<{
    title: string;
    description?: string;
    priority: string;
    status: string;
    dueDate: string;
  }>
): Promise<{ status: string; data: { task: Task } }> => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTaskApi = async (id: string): Promise<{ status: string; message: string }> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
