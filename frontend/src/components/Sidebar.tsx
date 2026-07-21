import React from 'react';
import { LayoutGrid, ListTodo, History, Users, Plus } from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onNewTask: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  onNewTask,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'active', label: 'Active Tasks', icon: ListTodo },
    { id: 'history', label: 'History', icon: History },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-icon">
          <LayoutGrid size={20} color="#ffffff" />
        </div>
        <div className="brand-titles">
          <h1 className="brand-title">Task Manager</h1>
          <span className="brand-subtitle">Enterprise Edition</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <IconComp size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="sidebar-footer">
        <button onClick={onNewTask} className="sidebar-new-task-btn">
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>

      <style>{`
        .app-sidebar {
          width: 240px;
          background: var(--bg-card);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          flex-shrink: 0;
          height: 100%;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px 28px 8px;
        }

        .brand-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }

        .brand-titles {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
          letter-spacing: -0.3px;
        }

        .brand-subtitle {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 2px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .sidebar-footer {
          padding-top: 20px;
        }

        .sidebar-new-task-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          background: #2563eb;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .sidebar-new-task-btn:hover {
          background: #1d4ed8;
        }
      `}</style>
    </aside>
  );
};
