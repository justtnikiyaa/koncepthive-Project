import React from 'react';
import type { TaskStats } from '../types';
import { Layers, Clock, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';

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
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      statusFilter: '',
    },
    {
      key: 'Pending',
      title: 'Pending Tasks',
      count: stats?.pending ?? 0,
      icon: Clock,
      iconBg: '#f1f5f9',
      iconColor: '#64748b',
      statusFilter: 'Pending',
    },
    {
      key: 'In Progress',
      title: 'In Progress Tasks',
      count: stats?.inProgress ?? 0,
      icon: RotateCw,
      iconBg: '#e0e7ff',
      iconColor: '#4f46e5',
      statusFilter: 'In Progress',
    },
    {
      key: 'Completed',
      title: 'Completed Tasks',
      count: stats?.completed ?? 0,
      icon: CheckCircle2,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      statusFilter: 'Completed',
    },
    {
      key: 'overdue',
      title: 'Overdue Tasks',
      count: stats?.overdue ?? 0,
      icon: AlertCircle,
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      statusFilter: 'Overdue',
    },
  ];

  return (
    <div className="stats-container-row">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = activeFilterStatus === card.statusFilter && card.statusFilter !== '';

        return (
          <div
            key={card.key}
            className={`stat-card-item ${isActive ? 'active-filter' : ''}`}
            onClick={() => onSelectStatusFilter && card.statusFilter !== undefined && onSelectStatusFilter(card.statusFilter)}
          >
            <div
              className="stat-icon-box"
              style={{ backgroundColor: card.iconBg, color: card.iconColor }}
            >
              <IconComponent size={20} />
            </div>
            <div className="stat-text-meta">
              <span className="stat-label">{card.title}</span>
              <span className="stat-count-num">{card.count}</span>
            </div>
          </div>
        );
      })}

      <style>{`
        .stats-container-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        @media (max-width: 1100px) {
          .stats-container-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-container-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .stats-container-row {
            grid-template-columns: 1fr;
          }
        }

        .stat-card-item {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .stat-card-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #2563eb;
        }

        .stat-card-item.active-filter {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        .stat-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-text-meta {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .stat-count-num {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};
