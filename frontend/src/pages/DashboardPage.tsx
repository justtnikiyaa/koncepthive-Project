import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Task, TaskStats, Priority, TaskStatus } from '../types';
import {
  getTasksApi,
  getTaskStatsApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from '../api/tasks.api';
import { DashboardStats } from '../components/DashboardStats';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { DeleteModal } from '../components/DeleteModal';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Sun,
  Moon,
  LogOut,
  CheckCircle,
  AlertCircle,
  Inbox,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState<TaskStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'dueDate'>('newest');

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch Stats & Tasks
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, tasksRes] = await Promise.all([
        getTaskStatsApi(),
        getTasksApi({
          search: searchQuery,
          status: statusFilter,
          priority: priorityFilter,
          sort: sortOption,
        }),
      ]);

      setStats(statsRes.data.stats);
      setTasks(tasksRes.data.tasks);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      showToast('Failed to load tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, statusFilter, priorityFilter, sortOption]);

  // Handle Save Task (Create or Update)
  const handleSaveTask = async (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    status: TaskStatus;
    dueDate: string;
  }) => {
    if (taskToEdit) {
      await updateTaskApi(taskToEdit.id, taskData);
      showToast('Task updated successfully');
    } else {
      await createTaskApi(taskData);
      showToast('Task created successfully');
    }
    fetchData();
  };

  // Handle Status Quick Change from Card dropdown
  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      await updateTaskApi(task.id, { status: newStatus });
      showToast(`Status updated to "${newStatus}"`);
      fetchData();
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteTaskApi(id);
      showToast('Task deleted successfully');
      fetchData();
    } catch (error) {
      showToast('Failed to delete task', 'error');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-notification animate-fade-in ${toastMessage.type}`}>
          {toastMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="app-logo">K</div>
          <div>
            <h2>Task Management</h2>
            <p className="welcome-text">Welcome back, <strong>{user?.name || 'User'}</strong></p>
          </div>
        </div>

        <div className="header-right">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle-btn"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button onClick={logout} className="logout-btn" title="Sign Out">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Metric Cards Summary */}
        <DashboardStats
          stats={stats}
          activeFilterStatus={statusFilter}
          onSelectStatusFilter={(st) => setStatusFilter(st)}
        />

        {/* Toolbar (Search, Filter, Sort, Add) */}
        <div className="toolbar">
          <div className="toolbar-left">
            {/* Search Input */}
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search">
                  ×
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="filter-select-wrapper">
              <Filter size={16} className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="filter-select-wrapper">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="filter-select-wrapper">
              <ArrowUpDown size={16} className="filter-icon" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="filter-select"
              >
                <option value="newest">Sort: Newest Created</option>
                <option value="oldest">Sort: Oldest Created</option>
                <option value="dueDate">Sort: Due Date</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsTaskModalOpen(true);
            }}
            className="new-task-btn"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>

        {/* Task Grid */}
        {isLoading ? (
          <div className="loading-state">
            <p>Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <Inbox size={48} className="empty-icon" />
            <h3>No tasks found</h3>
            <p>
              {searchQuery || statusFilter || priorityFilter
                ? 'Try adjusting your search query or filters.'
                : 'Get started by creating your first task!'}
            </p>
            {(searchQuery || statusFilter || priorityFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                  setPriorityFilter('');
                }}
                className="reset-filters-btn"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setTaskToEdit(t);
                  setIsTaskModalOpen(true);
                }}
                onDelete={(t) => {
                  setTaskToDelete(t);
                  setIsDeleteModalOpen(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background: var(--bg-main);
          color: var(--text-primary);
        }

        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
          box-shadow: var(--shadow-lg);
          z-index: 2000;
        }

        .toast-notification.success {
          background: #10b981;
        }

        .toast-notification.error {
          background: #ef4444;
        }

        .dashboard-header {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .app-logo {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--primary-color);
          color: #ffffff;
          font-weight: 800;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-left h2 {
          font-size: 18px;
          font-weight: 800;
          line-height: 1.2;
        }

        .welcome-text {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .theme-toggle-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .logout-btn {
          padding: 8px 16px;
          border-radius: var(--radius-md);
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logout-btn:hover {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .dashboard-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          flex: 1;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 220px;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }

        .search-box input {
          width: 100%;
          padding: 10px 32px 10px 38px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          color: var(--text-primary);
          outline: none;
        }

        .clear-search {
          position: absolute;
          right: 12px;
          font-size: 18px;
          color: var(--text-muted);
        }

        .filter-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .filter-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .filter-select {
          padding: 10px 14px 10px 34px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .new-task-btn {
          padding: 10px 20px;
          border-radius: var(--radius-md);
          background: var(--primary-color);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: var(--shadow-sm);
        }

        .new-task-btn:hover {
          background: var(--primary-hover);
        }

        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .empty-state {
          text-align: center;
          padding: 64px 20px;
          background: var(--bg-card);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          margin-top: 20px;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .empty-state h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .empty-state p {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 4px;
          margin-bottom: 16px;
        }

        .reset-filters-btn {
          padding: 8px 16px;
          border-radius: var(--radius-md);
          background: var(--primary-light);
          color: var(--primary-color);
          font-size: 13px;
          font-weight: 600;
        }

        .loading-state {
          text-align: center;
          padding: 48px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
