import React from 'react';
import { TaskStats } from '../types';
import { Layers, Clock, Loader, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DashboardStatsProps {
  stats: TaskStats | null;
  activeFilterStatus?: string;
  onSelectStatusFilter?: (status: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  activeFilterStatus,
  onSelectStatusFilter,
}) => {
  const cards = [
    {
      key: 'all',
      title: 'Total Tasks',
      count: stats?.total ?? 0,
      icon: Layers,
      colorClass: 'total',
      statusFilter: '',
    },
    {
      key: 'Pending',
      title: 'Pending Tasks',
      count: stats?.pending ?? 0,
      icon: Clock,
      colorClass: 'pending',
      statusFilter: 'Pending',
    },
    {
      key: 'In Progress',
      title: 'In Progress Tasks',
      count: stats?.inProgress ?? 0,
      icon: Loader,
      colorClass: 'progress',
      statusFilter: 'In Progress',
    },
    {
      key: 'Completed',
      title: 'Completed Tasks',
      count: stats?.completed ?? 0,
      icon: CheckCircle2,
      colorClass: 'completed',
      statusFilter: 'Completed',
    },
    {
      key: 'overdue',
      title: 'Overdue Tasks',
      count: stats?.overdue ?? 0,
      icon: AlertTriangle,
      colorClass: 'overdue',
      statusFilter: '', // Overdue highlighted status
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = activeFilterStatus === card.statusFilter && card.statusFilter !== '';

        return (
          <div
            key={card.key}
            className={`stat-card ${card.colorClass} ${isActive ? 'active-filter' : ''}`}
            onClick={() => onSelectStatusFilter && card.statusFilter !== undefined && onSelectStatusFilter(card.statusFilter)}
          >
            <div className="stat-icon-wrapper">
              <IconComponent size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-title">{card.title}</span>
              <span className="stat-value">{card.count}</span>
            </div>
          </div>
        );
      })}

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-focus);
        }

        .stat-card.active-filter {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-title {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
          margin-top: 2px;
        }

        /* Color Tints */
        .stat-card.total .stat-icon-wrapper {
          background: var(--primary-light);
          color: var(--primary-color);
        }

        .stat-card.pending .stat-icon-wrapper {
          background: var(--status-pending-bg);
          color: var(--status-pending-text);
        }

        .stat-card.progress .stat-icon-wrapper {
          background: var(--status-progress-bg);
          color: var(--status-progress-text);
        }

        .stat-card.completed .stat-icon-wrapper {
          background: var(--status-completed-bg);
          color: var(--status-completed-text);
        }

        .stat-card.overdue .stat-icon-wrapper {
          background: var(--status-overdue-bg);
          color: var(--status-overdue-text);
        }
      `}</style>
    </div>
  );
};
