# AssetFlow

**Enterprise Asset Management System** — a full-stack application for tracking, allocating, and maintaining organizational assets with role-based access control.

> **Current Status:** Phase 1 — Foundation complete. Auth, role system, layout shell, protected routes, and dark mode are fully functional. Feature pages are wired up as navigable placeholders.

---

## Tech Stack

| Layer      | Technology                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide Icons   |
| Backend    | Node.js, Express, TypeScript, express-session (cookie-based auth)          |
| Database   | PostgreSQL, Prisma ORM (migrations + seeding)                             |
| Validation | Zod (server-side), Axios (HTTP client)                                    |

---

## Project Structure

```
AssetFlow/
├── client/                          # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── layout/              # DashboardLayout, Navbar, Sidebar
│       │   ├── ui/                  # Reusable UI primitives
│       │   ├── ProtectedRoute.tsx   # Auth & role-gated route wrapper
│       │   └── ThemeToggle.tsx      # Dark/light mode switch
│       ├── features/
│       │   ├── auth/                # AuthContext (session state)
│       │   └── theme/               # ThemeContext (dark mode)
│       ├── hooks/                   # useAuth, useTheme
│       ├── pages/
│       │   ├── auth/                # Login, Signup, ForgotPassword, ResetPassword
│       │   ├── Dashboard.tsx
│       │   ├── Placeholder.tsx      # Generic placeholder for upcoming features
│       │   └── NotFound.tsx
│       ├── services/                # Axios instance + authService
│       ├── types/                   # TypeScript type definitions
│       └── utils/                   # Navigation config, role mappings, helpers
│
└── server/                          # Express + Prisma backend
    ├── prisma/
    │   ├── schema.prisma            # User model, Role & UserStatus enums
    │   ├── migrations/              # Auto-generated migration files
    │   └── seed.ts                  # Seeds the default Admin account
    └── src/
        ├── controllers/             # auth.controller
        ├── services/                # auth.service (business logic)
        ├── repositories/            # user.repository (Prisma queries)
        ├── routes/                  # auth.routes
        ├── middlewares/             # auth, error, validate
        ├── validators/              # Zod schemas for auth endpoints
        └── utils/                   # Shared utilities
```

---

## Features (Phase 1)

### Authentication
- **Signup** — creates a new account (defaults to Employee role)
- **Login / Logout** — session-based authentication with httpOnly cookies
- **Forgot Password** — generates a reset token (displayed on-page in dev; no email service yet)
- **Reset Password** — token-validated password change

### Role-Based Access Control
Four roles with hierarchical sidebar visibility:

| Role              | Sees in sidebar                                                                 |
| ----------------- | ------------------------------------------------------------------------------- |
| Employee          | Dashboard, Assets, Allocation & Transfer, Booking, Maintenance, Notifications   |
| Department Head   | Same as Employee                                                                |
| Asset Manager     | All Employee items + Audit, Reports                                             |
| Admin             | Everything including Organization Setup                                         |

Routes are protected both client-side (`ProtectedRoute` component) and server-side (`auth.middleware`).

### UI / UX
- **Dark mode** — toggle via sun/moon icon in the top bar, persisted via ThemeContext
- **Responsive layout** — collapsible sidebar with hamburger menu on mobile
- **Dashboard shell** — role-aware greeting and layout ready for KPI widgets

---

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** running locally with a database named `assetflow`

### 1. Backend

```bash
cd server
npm install
copy .env.example .env        # Windows (use cp on macOS/Linux)
```

Edit `.env` and set your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/assetflow"
SESSION_SECRET="your-secret-key"
```

Run migrations, seed the database, and start the dev server:
```bash
npm run prisma:migrate        # Creates the users table
npm run prisma:seed           # Seeds Admin: admin@assetflow.com / admin123
npm run dev                   # API on http://localhost:5000
```

### 2. Frontend

In a second terminal:
```bash
cd client
npm install
copy .env.example .env        # Windows (use cp on macOS/Linux)
npm run dev                   # App on http://localhost:5173
```

### 3. Try It Out

1. **Sign up** at `http://localhost:5173/signup` — new accounts are created as Employee.
2. **Log in as Admin** — use `admin@assetflow.com` / `admin123` to see role-restricted sidebar items (Organization Setup, Audit, Reports).
3. **Toggle dark mode** with the sun/moon icon in the top bar.
4. **Test responsiveness** — resize the browser to see the mobile hamburger menu.
5. **Forgot password flow** — the reset link is displayed on-page (dev-only shortcut, no email service configured yet).

---

## Available Scripts

### Server (`/server`)

| Script              | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start dev server with hot reload   |
| `npm run build`     | Compile TypeScript                 |
| `npm start`         | Run compiled JS                    |
| `npm run prisma:migrate` | Run Prisma migrations         |
| `npm run prisma:seed`    | Seed the database              |
| `npm run prisma:studio`  | Open Prisma Studio (GUI)       |

### Client (`/client`)

| Script              | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start Vite dev server              |
| `npm run build`     | Type-check + production build      |
| `npm run preview`   | Preview production build locally   |

---

## Roadmap

Features planned for future phases:

- [ ] **Organization Setup** — departments, locations, categories (Admin-only)
- [ ] **Asset Registration** — CRUD for assets with category and status tracking
- [ ] **Allocation & Transfer** — assign assets to users, request transfers
- [ ] **Resource Booking** — calendar-based booking for shared resources
- [ ] **Maintenance Workflow** — raise and track maintenance requests
- [ ] **Audit Cycles** — periodic asset audits with discrepancy tracking
- [ ] **Reports** — analytics dashboards and exportable reports
- [ ] **Notifications** — real-time alerts for assignments, approvals, and due dates
- [ ] **Dashboard KPIs** — live metrics for asset utilization, pending requests, etc.
