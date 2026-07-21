import React from 'react';
import type { Task, TaskStatus } from '../types';
import { Calendar, Edit3, Trash2, AlertCircle } from 'lucide-react';

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
    <div className={`task-card-v2 animate-fade-in ${isOverdue ? 'is-overdue-card' : ''}`}>
      {/* Card Header Badges & Actions */}
      <div className="card-v2-header">
        <div className="card-v2-badges">
          <span className={`priority-tag ${task.priority.toLowerCase()}`}>
            {task.priority.toUpperCase()} PRIORITY
          </span>

          {isOverdue && (
            <span className="overdue-tag">
              <AlertCircle size={12} /> Overdue
            </span>
          )}
        </div>

        <div className="card-v2-actions">
          <button onClick={() => onEdit(task)} title="Edit Task" className="v2-action-btn">
            <Edit3 size={14} />
          </button>
          <button onClick={() => onDelete(task)} title="Delete Task" className="v2-action-btn delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-v2-body">
        <h3 className="v2-task-title">{task.title}</h3>
        {task.description && <p className="v2-task-desc">{task.description}</p>}
      </div>

      {/* Card Footer */}
      <div className="card-v2-footer">
        <div className="v2-due-date">
          <Calendar size={14} />
          <span>Due {formattedDate}</span>
        </div>

        <div className="v2-status-wrapper">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
            className={`v2-status-select ${task.status.toLowerCase().replace(' ', '-')}`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress ▾</option>
            <option value="Completed">Completed ▾</option>
          </select>
        </div>
      </div>

      <style>{`
        .task-card-v2 {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
          min-height: 180px;
        }

        .task-card-v2:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          border-color: #2563eb;
        }

        .card-v2-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .card-v2-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .priority-tag {
          font-size: 10px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .priority-tag.high {
          background: #fef2f2;
          color: #dc2626;
        }

        .priority-tag.medium {
          background: #fff7ed;
          color: #c2410c;
        }

        .priority-tag.low {
          background: #f0fdf4;
          color: #16a34a;
        }

        .overdue-tag {
          font-size: 10px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 6px;
          background: #fee2e2;
          color: #dc2626;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .card-v2-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .v2-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }

        .v2-action-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .v2-action-btn.delete:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .card-v2-body {
          flex: 1;
          margin-bottom: 14px;
        }

        .v2-task-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          margin-bottom: 6px;
        }

        .v2-task-desc {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-v2-footer {
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .v2-due-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .v2-status-select {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          outline: none;
        }

        .v2-status-select.pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .v2-status-select.in-progress {
          background: #eff6ff;
          color: #2563eb;
        }

        .v2-status-select.completed {
          background: #dcfce7;
          color: #16a34a;
        }
      `}</style>
    </div>
  );
};
