# Task Management System - Full Stack Technical Assessment

A production-quality full-stack **Task Management System** developed for the **Koncepthive Technical Assessment (Intern - Full Stack Web Developer)**.

---

## 🌟 Overview & Features

- **Authentication**: JWT Bearer token authentication with password encryption using `bcrypt`. Pre-seeded with default admin credentials (`admin@test.com` / `123456`).
- **Dashboard Analytics**: Real-time analytical statistics displaying Total, Pending, In Progress, Completed, and Overdue task counts.
- **Task CRUD**: Complete task management with validation constraints (Title required, Due date `>= today`, Priority & Status enums).
- **Search, Multi-Filtering & Sorting**:
  - Real-time search by task title.
  - Multi-select filters by **Status** and **Priority**.
  - Sorting options: **Newest Created**, **Oldest Created**, and **Due Date**.
- **User Interface**: Modern responsive UI with dark/light mode toggle, toast alerts, quick-fill credentials button, and confirmation dialogs.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite + TypeScript), Lucide Icons, CSS Design Tokens.
- **Backend**: Node.js + Express.js (TypeScript), Zod Schema Validation, JWT, bcrypt.
- **Database & ORM**: PostgreSQL / SQLite powered by **Prisma ORM** (Includes raw `.sql` dumps in `database/`).

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
```

Set up environment variables (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=koncepthive_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Run database migrations & seed default data:
```bash
npx prisma db push
npx prisma db seed
```

Start backend development server:
```bash
npm run dev
```
Backend API will be running on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend development server:
```bash
npm run dev
```
Frontend web app will be available at `http://localhost:5173`.

---

## 🔑 Default Credentials for Testing

- **Email**: `admin@test.com`
- **Password**: `123456`

*(You can also use the **"Auto-fill Admin"** button on the Login page for instant login)*.

---

## 📡 API Endpoint Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |
| `GET` | `/api/tasks` | Get tasks (supports `search`, `status`, `priority`, `sort`) | Yes (Bearer) |
| `GET` | `/api/tasks/stats/summary` | Fetch dashboard metric summary statistics | Yes (Bearer) |
| `GET` | `/api/tasks/:id` | Fetch single task by ID | Yes (Bearer) |
| `POST` | `/api/tasks` | Create a new task | Yes (Bearer) |
| `PUT` | `/api/tasks/:id` | Update an existing task | Yes (Bearer) |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes (Bearer) |

---

## 🗄️ Database Artifacts

Raw SQL export files are located in the `database/` directory:
- `database/schema.sql` - Table definitions for `users` and `tasks`
- `database/seed.sql` - Sample data inserts and admin user credentials

---

## 💡 Assumptions Made & Design Decisions

1. **Date Validation**: Tasks created or updated must have a `dueDate` of today or later (unless updating an existing past task).
2. **Overdue Task Logic**: A task is categorized as "Overdue" when its `dueDate` is earlier than the current date and its status is not `'Completed'`.
3. **Database Portability**: Prisma ORM is configured with SQLite for zero-config local testing, while remaining 100% compatible with PostgreSQL/MySQL by changing `DATABASE_URL` in `.env`.

---

## ⚠️ Known Limitations

- Single user system (no registration by design, per assessment spec)
- No refresh token implementation

