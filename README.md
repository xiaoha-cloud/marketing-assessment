# Marketing assessment

This repository contains two independent assessment tasks:

| Task | Description |
|------|-------------|
| [`task1-fullstack/`](task1-fullstack/) | Campaign email dispatch and lead capture (TypeScript full stack) |
| [`task2-data-pipeline/`](task2-data-pipeline/) | Python data cleaning pipeline |

## Task 1 full stack (`task1-fullstack/`)

End-to-end flow:

**Campaign list → send email (Ethereal) → landing page (slug) → form submit → submissions dashboard → CSV export**

- **Backend** — Express, SQLite (`better-sqlite3`), layered routes/controllers/services/repositories; email isolated under `email/` (Nodemailer + Ethereal). See [`task1-fullstack/backend/README.md`](task1-fullstack/backend/README.md) for setup, env vars, verification commands, and architecture.
- **Frontend** — React + Vite; dev proxy forwards `/api` to the backend. See [`task1-fullstack/frontend/README.md`](task1-fullstack/frontend/README.md) for routes and run instructions.

### Quick local run

1. **Backend:** `cd task1-fullstack/backend && npm install && npm run dev` (listens on port `3000` by default; optional: copy `.env.example` to `.env`).
2. **Frontend:** `cd task1-fullstack/frontend && npm install && npm run dev` (opens on port `5173`).

Database file defaults to `task1-fullstack/backend/data/app.db`; it is created on first use. Schema runs and seed data loads when the campaigns table is empty.

### Reviewer verification checklist

With backend and frontend dev servers running (`backend` on port `3000`, `frontend` on `5173`):

- [ ] Backend starts without errors; SQLite file appears under `task1-fullstack/backend/data/`.
- [ ] `GET /api/campaigns` and `GET /api/campaigns/1` return `{ "data": ... }`.
- [ ] `GET /api/landing/summer-brand-awareness` returns landing payload for the seeded slug.
- [ ] `POST /api/landing/summer-brand-awareness/submit` with `firstName`, `lastName`, `email`, `company` returns `201` and an `id`.
- [ ] `GET /api/submissions` lists the new row; `GET /api/submissions/export` downloads CSV (`text/csv`, attachment).
- [ ] `POST /api/campaigns/1/send` with `{ "recipientEmail": "..." }` succeeds when the network allows Ethereal; server logs `Ethereal preview URL: ...`.
- [ ] Frontend: `/` shows campaigns; `/landing/summer-brand-awareness` loads and submits; `/submissions` shows data and export works.

### Task 2

See [`task2-data-pipeline/`](task2-data-pipeline/) for the Python pipeline (separate from Task 1).
