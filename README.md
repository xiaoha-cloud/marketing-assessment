# Marketing assessment

This repository contains two independent assessment tasks:

| Task | Description |
|------|-------------|
| [`task1-fullstack/`](task1-fullstack/) | Campaign email dispatch and lead capture (TypeScript full stack) |
| [`task2-data-pipeline/`](task2-data-pipeline/) | Python data cleaning pipeline |

## Highlight

![Screen Recording 2026-04-18 at 14 35 30](https://github.com/user-attachments/assets/65afd23e-4bd1-4300-94b8-fe29b443caeb)



## Repository summary

- **Task 1** delivers a small but complete campaign workflow: campaign list, email send, landing page by slug, lead capture, submissions dashboard, and CSV export.
- **Task 2** delivers a deterministic Python pipeline that turns a noisy LinkedIn-style scrape into one final senior marketing contact per company.
- The two tasks are intentionally separate: `task1-fullstack/` is a runnable product flow, while `task2-data-pipeline/` is a standalone data-processing deliverable.

## Task 1 full stack (`task1-fullstack/`)

End-to-end flow:

**Campaign list → send email (Ethereal) → landing page (slug) → form submit → submissions dashboard → CSV export**

- **Backend** — Express, SQLite (`better-sqlite3`), layered routes/controllers/services/repositories; email isolated under `email/` (Nodemailer + Ethereal). See [`task1-fullstack/backend/README.md`](task1-fullstack/backend/README.md) for setup, env vars, verification commands, and architecture.
- **Frontend** — React + Vite; dev proxy forwards `/api` to the backend. See [`task1-fullstack/frontend/README.md`](task1-fullstack/frontend/README.md) for routes and run instructions.

### What is implemented

- Campaign listing and campaign detail APIs with consistent `{ "data": ... }` response envelopes.
- Landing-page lookup by campaign `slug`, plus lead submission storage tied to `campaign_id`.
- SQLite schema initialization and seed loading on first startup.
- Test email sending with Nodemailer + Ethereal, including preview URL logging when the network allows it.
- Submissions listing with pagination in the UI and CSV export from the backend.
- React frontend pages for campaign browsing, landing-page form submission, and submissions review.

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

## Task 2 data pipeline (`task2-data-pipeline/`)

Goal:

**Clean a noisy LinkedIn-style contact export and generate one final senior marketing contact per company.**

### What is implemented

- Raw CSV inspection for shape, dtypes, missing values, and sample values.
- Text cleanup for names, headlines, company names, emails, and LinkedIn profile URLs.
- Role classification for senior marketing contacts using explicit, reviewable rules.
- Filtering of irrelevant rows such as engineering, HR, finance, CEO, placeholder, and sponsored-content rows.
- Person-level deduplication using deterministic tie-breaks based on recency and data quality signals.
- Company-level final selection using seniority, corporate email, LinkedIn presence, and recency.
- Final output generation as `marketing_contacts_clean.csv` with exactly these columns:
  `company_name`, `contact_name`, `job_title`, `email`, `linkedin_url`.

### Quick local run

1. `cd task2-data-pipeline`
2. `python -m venv .venv`
3. `source .venv/bin/activate`
4. `pip install -r requirements.txt`
5. `python pipeline.py`

The script reads `linkedin_raw_data.csv`, prints an inspection summary, and writes `marketing_contacts_clean.csv` automatically.

### Reviewer verification checklist

- [ ] `python pipeline.py` runs end-to-end without manual edits.
- [ ] `marketing_contacts_clean.csv` is generated or overwritten automatically.
- [ ] The final CSV contains exactly the required five columns.
- [ ] There is exactly one row per company in the final output.
- [ ] Personal-only emails are blank in the final CSV.
- [ ] LinkedIn URLs are either full `https://...` profile URLs or empty strings.

### Notes

- Task 2 is rule-based and deterministic by design so the cleaning and ranking decisions stay explainable.
- The committed `marketing_contacts_clean.csv` is a generated artifact for submission; rerunning `pipeline.py` recreates it from `linkedin_raw_data.csv`.
- See [`task2-data-pipeline/README.md`](task2-data-pipeline/README.md) for full pipeline stages, data quality observations, assumptions, and commentary.
