# Task 1 — Frontend

React (Vite) UI for browsing campaigns, opening landing pages by slug, submitting leads, viewing submissions with pagination, and triggering test campaign emails.

## Install

```bash
cd task1-fullstack/frontend
npm install
```

## Run

```bash
npm run dev
```

Default dev server: `http://localhost:5173`. Start the **backend** on port `3000` first so API calls succeed.

## Backend API URL

The Vite dev server proxies **`/api`** to **`http://127.0.0.1:3000`** (see `vite.config.ts`). The frontend uses relative URLs such as `/api/campaigns`, so no separate `VITE_API_URL` is required during local development.

If you deploy the API and SPA on different origins, configure a reverse proxy or environment-specific API base URL in your build tooling (not required for the default local setup).

## Page routes

| Path | Page |
|------|------|
| `/` | Campaign list — cards with “View landing” and “Send test email” |
| `/landing/:slug` | Public landing — campaign copy, events, lead form |
| `/submissions` | Submissions table with pagination and CSV download |

Unknown paths redirect to `/`.

## Page overview

- **Campaigns** — Loads campaigns from `GET /api/campaigns`; per-campaign actions use `GET /api/campaigns/:id` context where needed and `POST /api/campaigns/:id/send` for Ethereal test sends.
- **Landing** — Resolves `GET /api/landing/:slug`; form posts to `POST /api/landing/:slug/submit`.
- **Submissions** — Lists `GET /api/submissions` (with query params for pagination); download uses `GET /api/submissions/export`.

## Loading, error, and success states

List and detail views use shared **loading** and **error** UI components while requests are in flight or when the API returns an error envelope `{ "error": { "code", "message" } }`. Successful operations (for example form submit) show inline confirmation where implemented. Empty lists are shown explicitly when there is no data.

## Build

```bash
npm run build
npm run preview   # optional: preview production build
```


