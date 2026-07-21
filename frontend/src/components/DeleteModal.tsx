import React, { useState } from 'react';
import type { Task } from '../types';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(task.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete task', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon-box">
          <AlertTriangle size={28} />
        </div>

        <h3>Delete Task</h3>
        <p>
          Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
        </p>

        <div className="delete-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleDelete} className="confirm-delete-btn" disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spin-icon" /> Deleting...
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>

      <style>{`
        .delete-modal-content {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 400px;
          padding: 28px;
          text-align: center;
          box-shadow: var(--shadow-lg);
        }

        .delete-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .delete-modal-content h3 {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .delete-modal-content p {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.4;
        }

        .delete-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .confirm-delete-btn {
          padding: 10px 20px;
          border-radius: var(--radius-md);
          background: #ef4444;
          color: #ffffff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .confirm-delete-btn:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
};
