import React from 'react';
import { LayoutGrid, ListTodo, History, Plus, X } from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onNewTask: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  onNewTask,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'active', label: 'Active Tasks', icon: ListTodo },
    { id: 'history', label: 'Completed History', icon: History },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}

      <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <LayoutGrid size={20} color="#ffffff" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-title">Task Manager</h1>
            <span className="brand-subtitle">Enterprise Edition</span>
          </div>

          {/* Close Button on Mobile */}
          <button className="sidebar-mobile-close" onClick={onCloseMobile}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
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
          <button
            onClick={() => {
              onNewTask();
              if (onCloseMobile) onCloseMobile();
            }}
            className="sidebar-new-task-btn"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>

        <style>{`
          .sidebar-backdrop {
            display: none;
          }

          .app-sidebar {
            width: 240px;
            background: var(--bg-card);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            padding: 24px 16px;
            flex-shrink: 0;
            height: 100vh;
            position: sticky;
            top: 0;
            z-index: 100;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .sidebar-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 0 8px 28px 8px;
            position: relative;
          }

          .sidebar-mobile-close {
            display: none;
            position: absolute;
            right: 0;
            top: 4px;
            color: var(--text-muted);
            padding: 4px;
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

          /* Responsive Drawer Styling for Mobile & Tablet */
          @media (max-width: 900px) {
            .sidebar-backdrop {
              display: block;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(15, 23, 42, 0.6);
              backdrop-filter: blur(2px);
              z-index: 999;
            }

            .app-sidebar {
              position: fixed;
              top: 0;
              left: 0;
              bottom: 0;
              z-index: 1000;
              transform: translateX(-100%);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }

            .app-sidebar.mobile-open {
              transform: translateX(0);
            }

            .sidebar-mobile-close {
              display: flex;
            }
          }
        `}</style>
      </aside>
    </>
  );
};
