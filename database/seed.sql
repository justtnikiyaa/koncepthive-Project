-- Koncepthive Task Management System - Database Seed Data (SQL Dump)

-- Insert Admin User (email: admin@test.com, password: 123456 [bcrypt hash])
INSERT INTO users (id, name, email, password, created_at, updated_at)
VALUES (
    'admin-uuid-1001',
    'System Admin',
    'admin@test.com',
    '$2a$10$8K1p/a0dL1LXMIgoEDDhiO30c8E6k5h/m62Z9bU7W9S14N.sW9zGG', -- hashed '123456'
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Sample Tasks
INSERT INTO tasks (id, title, description, priority, status, due_date, created_at, updated_at, user_id)
VALUES 
(
    'task-uuid-2001',
    'Design Task Management Dashboard UI',
    'Create responsive high-fidelity UI components for the dashboard overview and task cards.',
    'High',
    'In Progress',
    DATE('now', '+1 day'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'admin-uuid-1001'
),
(
    'task-uuid-2002',
    'Implement JWT Authentication Backend',
    'Set up Express login endpoint with bcrypt password verification and JWT token issuance.',
    'High',
    'Completed',
    DATE('now'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'admin-uuid-1001'
),
(
    'task-uuid-2003',
    'Setup Database Migrations & Seeds',
    'Define Prisma schema models for User and Task entities, run migrations, and write seed scripts.',
    'Medium',
    'Completed',
    DATE('now'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'admin-uuid-1001'
),
(
    'task-uuid-2004',
    'Submit Koncepthive Technical Assessment',
    'Finalize README documentation, verify test cases, export SQL dump, and submit to career email.',
    'High',
    'Pending',
    DATE('now', '+7 day'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'admin-uuid-1001'
),
(
    'task-uuid-2005',
    'Submit Initial Prototype Draft',
    'Legacy task created earlier to verify overdue task dashboard status tracking.',
    'Low',
    'Pending',
    DATE('now', '-3 day'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'admin-uuid-1001'
);
