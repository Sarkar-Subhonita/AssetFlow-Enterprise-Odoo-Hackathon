# AssetFlow — Phase 1: Foundation

This phase builds only the architecture: auth, role system, layout shell,
protected routes, and dark mode. No feature pages (Assets, Booking, etc.)
have real content yet — they're wired-up placeholders so navigation and
role-gating are provable end to end.

## Prerequisites
- Node.js installed
- PostgreSQL running locally with a database named `assetflow` (you already have this)

## 1. Backend setup

```
cd server
npm install
copy .env.example .env
```

Edit `.env` and set `DATABASE_URL` to match your local Postgres
(user/password/port), e.g.:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/assetflow"
```

Then run:
```
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

- `prisma:migrate` creates the `users` table.
- `prisma:seed` creates one Admin login: `admin@assetflow.com` / `admin123`.
- `dev` starts the API on http://localhost:5000

## 2. Frontend setup

Open a second terminal:
```
cd client
npm install
copy .env.example .env
npm run dev
```

Frontend runs on http://localhost:5173

## 3. Try it out

1. Go to http://localhost:5173/signup and create an account — it will always
   be created as an Employee (role assignment is Admin-only, in a later phase).
2. Log out, then log in as `admin@assetflow.com` / `admin123` — notice the
   sidebar shows extra items (Organization Setup, Audit, Reports) that the
   Employee account doesn't see.
3. Toggle dark mode with the sun/moon icon in the top bar.
4. Resize the browser to check the mobile sidebar (hamburger menu).
5. Try "Forgot password" — since there's no email service yet, the reset
   link is shown directly on the page (dev-only shortcut, noted in the code).

## What's built vs. what's next
Built: signup/login/logout/forgot-password/reset-password, session auth,
4-role system, role-based sidebar, protected routes, dashboard shell,
dark mode, responsive layout.

Not built yet (next phases): Organization Setup, Asset Registration,
Allocation & Transfer, Resource Booking, Maintenance workflow, Audit
Cycles, Reports, real Notifications, real Dashboard KPIs.
