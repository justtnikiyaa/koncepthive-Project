import React, { useState, useEffect } from 'react';
import type { Task, Priority, TaskStatus } from '../types';
import { X, Calendar, Type, FileText, AlertCircle, Loader2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    status: TaskStatus;
    dueDate: string;
  }) => Promise<void>;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string; global?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setDueDate(new Date(initialTask.dueDate).toISOString().split('T')[0]);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Pending');
      // Default due date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
    setErrors({});
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { title?: string; dueDate?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selected = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today && !initialTask) {
        newErrors.dueDate = 'Due date cannot be earlier than today';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        dueDate,
      });
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save task';
      setErrors((prev) => ({ ...prev, global: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {errors.global && (
          <div className="modal-error-alert">
            <AlertCircle size={16} />
            <span>{errors.global}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title *</label>
            <div className="input-with-icon">
              <Type size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? 'has-error' : ''}
              />
            </div>
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              rows={3}
              placeholder="Add additional notes or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date *</label>
            <div className="input-with-icon">
              <Calendar size={18} className="input-icon" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={errors.dueDate ? 'has-error' : ''}
              />
            </div>
            {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin-icon" /> Saving...
                </>
              ) : (
                <>{initialTask ? 'Update Task' : 'Create Task'}</>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-modal-overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 500px;
          padding: 28px;
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .close-btn {
          color: var(--text-muted);
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .close-btn:hover {
          color: var(--text-primary);
        }

        .modal-error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-radius: var(--radius-sm);
          font-size: 13px;
          margin-bottom: 16px;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
          display: block;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon input,
        .modal-form select,
        .modal-form textarea {
          width: 100%;
          padding: 10px 12px 10px 38px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-main);
          color: var(--text-primary);
          outline: none;
        }

        .modal-form select,
        .modal-form textarea {
          padding-left: 12px;
        }

        .has-error {
          border-color: #ef4444 !important;
        }

        .field-error {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
          display: block;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }

        .cancel-btn {
          padding: 10px 18px;
          border-radius: var(--radius-md);
          background: var(--bg-main);
          color: var(--text-secondary);
          font-weight: 600;
        }

        .submit-btn {
          padding: 10px 20px;
          border-radius: var(--radius-md);
          background: var(--primary-color);
          color: #ffffff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
