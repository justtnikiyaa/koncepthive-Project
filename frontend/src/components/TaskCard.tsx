import React from 'react';
import type { Task, TaskStatus } from '../types';
import { Calendar, Edit3, Trash2, Clock, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const isOverdue =
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) &&
    task.status !== 'Completed';

  const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`task-card animate-fade-in ${isOverdue ? 'is-overdue' : ''}`}>
      <div className="task-card-header">
        <div className="task-badges">
          <span className={`priority-badge ${task.priority.toLowerCase()}`}>
            {task.priority} Priority
          </span>

          {isOverdue && (
            <span className="overdue-badge">
              <AlertCircle size={12} /> Overdue
            </span>
          )}
        </div>

        <div className="task-actions">
          <button onClick={() => onEdit(task)} title="Edit Task" className="icon-btn edit">
            <Edit3 size={16} />
          </button>
          <button onClick={() => onDelete(task)} title="Delete Task" className="icon-btn delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-card-footer">
        <div className="task-due-date">
          <Calendar size={14} />
          <span>Due {formattedDate}</span>
        </div>

        <div className="task-status-selector">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
            className={`status-select ${task.status.toLowerCase().replace(' ', '-')}`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <style>{`
        .task-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease;
          position: relative;
        }

        .task-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--border-focus);
        }

        .task-card.is-overdue {
          border-left: 4px solid #ef4444;
        }

        .task-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .task-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .priority-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .priority-badge.high {
          background: var(--priority-high-bg);
          color: var(--priority-high-text);
        }

        .priority-badge.medium {
          background: var(--priority-med-bg);
          color: var(--priority-med-text);
        }

        .priority-badge.low {
          background: var(--priority-low-bg);
          color: var(--priority-low-text);
        }

        .overdue-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: var(--radius-full);
          background: var(--status-overdue-bg);
          color: var(--status-overdue-text);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .task-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }

        .icon-btn.edit:hover {
          background: var(--primary-light);
          color: var(--primary-color);
        }

        .icon-btn.delete:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .task-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .task-description {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }

        .task-card-footer {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .task-due-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .status-select {
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          cursor: pointer;
          outline: none;
        }

        .status-select.pending {
          background: var(--status-pending-bg);
          color: var(--status-pending-text);
        }

        .status-select.in-progress {
          background: var(--status-progress-bg);
          color: var(--status-progress-text);
        }

        .status-select.completed {
          background: var(--status-completed-bg);
          color: var(--status-completed-text);
        }
      `}</style>
    </div>
  );
};
