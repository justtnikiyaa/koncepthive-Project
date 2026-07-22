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
import { Sidebar } from '../components/Sidebar';
import { DashboardStats } from '../components/DashboardStats';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { DeleteModal } from '../components/DeleteModal';
import {
  Search,
  Plus,
  Moon,
  Sun,
  LogOut,
  User,
  CheckCircle,
  AlertCircle,
  Inbox,
  Menu,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [activeNav, setActiveNav] = useState('dashboard');
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filters & Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOption] = useState<'newest' | 'oldest' | 'dueDate'>('newest');

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
      const effectiveStatusFilter = activeNav === 'overdue' ? 'Overdue' : statusFilter;
      const [statsRes, tasksRes] = await Promise.all([
        getTaskStatsApi(),
        getTasksApi({
          search: searchQuery,
          status: effectiveStatusFilter,
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
  }, [searchQuery, statusFilter, priorityFilter, sortOption, activeNav]);

  const displayedTasks = tasks.filter((t) => {
    if (activeNav === 'active') {
      return t.status !== 'Completed';
    }
    if (activeNav === 'history') {
      return t.status === 'Completed';
    }
    if (activeNav === 'overdue' || statusFilter === 'Overdue') {
      const now = new Date();
      return t.status !== 'Completed' && new Date(t.dueDate) < now;
    }
    return true;
  });

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
    <div className="dashboard-app-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-notification animate-fade-in ${toastMessage.type}`}>
          {toastMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Container Window */}
      <div className="app-window-container">
        {/* Left Sidebar */}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onNewTask={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="app-main-content">
          {/* Top Header */}
          <header className="top-header-bar">
            <div className="user-profile-meta">
              <button
                className="mobile-menu-trigger"
                onClick={() => setIsMobileSidebarOpen(true)}
                title="Open Navigation Menu"
              >
                <Menu size={22} />
              </button>

              <div className="avatar-circle">
                <User size={18} />
              </div>
              <div className="user-text-info">
                <span className="welcome-label">Welcome back,</span>
                <span className="user-display-name">{user?.name || 'System Admin'}</span>
              </div>
            </div>

            <div className="top-header-actions">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="header-icon-btn"
                title="Toggle Theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button onClick={logout} className="header-signout-btn">
                <LogOut size={16} />
                <span className="signout-label">Sign Out</span>
              </button>
            </div>
          </header>

          {/* Main Dashboard Section */}
          <div className="content-scroll-area">
            {/* Top Metric Stats Cards */}
            <DashboardStats
              stats={stats}
              activeFilterStatus={statusFilter}
              onSelectStatusFilter={(st) => setStatusFilter(st)}
            />

            {/* Filter & Controls Card */}
            <div className="filter-controls-card">
              <div className="search-input-box">
                <Search size={16} className="search-icon-input" />
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                    ×
                  </button>
                )}
              </div>

              <div className="filter-controls-right">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="control-select-dropdown"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="control-select-dropdown"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <button
                  onClick={() => {
                    setTaskToEdit(null);
                    setIsTaskModalOpen(true);
                  }}
                  className="control-new-task-btn"
                >
                  <Plus size={16} />
                  <span>New Task</span>
                </button>
              </div>
            </div>

            {/* Task Grid (3 Columns Desktop -> 2 Columns Tablet -> 1 Column Mobile) */}
            {isLoading ? (
              <div className="loading-state-box">
                <p>Loading tasks...</p>
              </div>
            ) : displayedTasks.length === 0 ? (
              <div className="empty-state-box animate-fade-in">
                <Inbox size={40} className="empty-icon" />
                <h4>No tasks found</h4>
                <p>
                  {activeNav === 'active'
                    ? 'No active tasks found.'
                    : activeNav === 'history'
                    ? 'No completed tasks in history yet.'
                    : 'Try adjusting your search or filters.'}
                </p>
              </div>
            ) : (
              <div className="tasks-three-column-grid">
                {displayedTasks.map((task) => (
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

            {/* Page Footer */}
            <footer className="dashboard-footer-bar">
              <span>© 2024 Task Management Enterprise. All rights reserved.</span>
            </footer>
          </div>
        </div>
      </div>

      {/* Task Modal */}
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
        .dashboard-app-wrapper {
          min-height: 100vh;
          width: 100%;
          background: var(--bg-main);
          display: flex;
        }

        .app-window-container {
          width: 100%;
          min-height: 100vh;
          background: var(--bg-main);
          display: flex;
          overflow: hidden;
        }

        .app-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-main);
          overflow: hidden;
          min-width: 0;
        }

        .top-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-card);
        }

        .mobile-menu-trigger {
          display: none;
          color: var(--text-primary);
          padding: 6px;
          border-radius: 8px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
        }

        .user-profile-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--bg-card-hover);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-text-info {
          display: flex;
          flex-direction: column;
        }

        .welcome-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        .user-display-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .top-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .header-icon-btn:hover {
          background: var(--bg-card-hover);
        }

        .header-signout-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .header-signout-btn:hover {
          background: var(--bg-card-hover);
        }

        .content-scroll-area {
          flex: 1;
          padding: 24px 28px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .filter-controls-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          flex-wrap: wrap;
        }

        .search-input-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 220px;
        }

        .search-icon-input {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input-box input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          background: var(--bg-main);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          font-size: 16px;
          color: var(--text-muted);
        }

        .filter-controls-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .control-select-dropdown {
          padding: 9px 14px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          background: var(--bg-main);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .control-new-task-btn {
          padding: 10px 18px;
          border-radius: 10px;
          background: #2563eb;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
          transition: all 0.2s ease;
        }

        .control-new-task-btn:hover {
          background: #1d4ed8;
        }

        .tasks-three-column-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          flex: 1;
        }

        .dashboard-footer-bar {
          text-align: center;
          padding-top: 28px;
          margin-top: auto;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          z-index: 2000;
        }

        .toast-notification.success {
          background: #16a34a;
        }

        .toast-notification.error {
          background: #dc2626;
        }

        .loading-state-box, .empty-state-box {
          text-align: center;
          padding: 48px 20px;
          color: var(--text-muted);
          background: var(--bg-card);
          border: 1px dashed var(--border-color);
          border-radius: 16px;
        }

        /* RESPONSIVE MEDIA QUERIES FOR DESKTOP, TABLET & MOBILE */
        @media (max-width: 1100px) {
          .tasks-three-column-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 900px) {
          .mobile-menu-trigger {
            display: flex;
          }

          .top-header-bar {
            padding: 14px 18px;
          }

          .content-scroll-area {
            padding: 18px;
          }
        }

        @media (max-width: 640px) {
          .tasks-three-column-grid {
            grid-template-columns: 1fr;
          }

          .filter-controls-card {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input-box {
            max-width: 100%;
          }

          .filter-controls-right {
            width: 100%;
            justify-content: space-between;
          }

          .control-select-dropdown {
            flex: 1;
          }

          .control-new-task-btn {
            width: 100%;
            justify-content: center;
            margin-top: 4px;
          }

          .signout-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
