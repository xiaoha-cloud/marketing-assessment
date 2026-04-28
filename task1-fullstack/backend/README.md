# Task 1 — Backend API

Express + Prisma/SQLite API for campaign listing, landing-page data, lead capture, outbound campaign email (Nodemailer + Ethereal), and submissions listing with CSV export.

## Install

```bash
cd task1-fullstack/backend
npm install
```

## Environment variables

Copy `.env.example` to `.env` (optional). Variables are loaded automatically when present (`dotenv`).

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP port | `3000` |
| `LANDING_BASE_URL` | Origin used in email CTA links (no trailing slash) | `http://localhost:5173` |
| `DATABASE_URL` | Prisma SQLite database URL, relative to `prisma/schema.prisma` | `file:../data/app.db` |

## Run

**Development (watch):**

```bash
npm run dev
```

**Production-style (after build):**

```bash
npm run build
npm start
```

The server prints `Server listening on port <PORT>` when ready.

## SQLite migration and seeding

The database schema is managed by Prisma migrations:

```bash
npm run db:migrate
npm run db:seed
```

`npm run dev` and `npm start` run `prisma migrate deploy` before starting the server. On server startup, **`seedDb`** checks whether the `campaigns` table is empty and inserts rows from `src/db/seed_campaigns.json` when needed. If the table already has data, seeding is skipped (safe for restarts).

The build runs `prisma generate` and copies `seed_campaigns.json` into `dist/db/` so `npm start` can resolve the same seed fixture as `npm run dev`.

**Resetting data:** Stop the server, run `npx prisma migrate reset`, and then run `npm run db:seed`.

## Architecture (layers)

HTTP is wired in **routes** → **controllers** (thin) → **services** (workflows) → **repositories** (Prisma data access). Email sending uses **email/** (Nodemailer/Ethereal); **db/** holds the Prisma client and seed logic.

```
Routes → Controllers → Services → Repositories → Prisma → SQLite
                    ↘ Email (Nodemailer)
```

## Verify campaign APIs

With the server running:

```bash
curl -s http://localhost:3000/api/campaigns | jq .
curl -s http://localhost:3000/api/campaigns/1 | jq .
```

Expected: JSON envelopes `{ "data": ... }` with camelCase fields.

## Verify landing (slug lookup and submit)

Default seeded slug: `summer-brand-awareness`.

```bash
curl -s http://localhost:3000/api/landing/summer-brand-awareness | jq .

curl -s -X POST http://localhost:3000/api/landing/summer-brand-awareness/submit \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ada","lastName":"Lovelace","email":"ada@example.com","company":"Analytical Engines"}' | jq .
```

Expected: `200` with campaign payload; `201` with `{ "data": { "id": <number> } }` for submit.

## Verify Ethereal preview URL logging

Sending a campaign email uses Ethereal (test SMTP). **Outbound network access is required** for account creation and send.

```bash
curl -s -X POST http://localhost:3000/api/campaigns/1/send \
  -H "Content-Type: application/json" \
  -d '{"recipientEmail":"reviewer@example.com"}' | jq .
```

On success, the server logs a line like `Ethereal preview URL: https://ethereal.email/...`. The JSON response may also include `previewUrl` when Ethereal provides it.

If the network is unavailable, the call fails with a service-level error (for example `EMAIL_SEND_FAILED`).

## CSV export

Submissions are listed at `GET /api/submissions` and exported via the same underlying data path at:

`GET /api/submissions/export`

The response uses `Content-Type: text/csv` and a `Content-Disposition` attachment filename. Example:

```bash
curl -s -OJ http://localhost:3000/api/submissions/export
```

## Health check

```bash
curl -s http://localhost:3000/api/health
```

## Known limitations

- **Ethereal** requires network access; preview URLs are for manual inspection, not production delivery.
- **Seed data** is minimal (one campaign / one event) for demonstration; extend `seed_campaigns.json` if you need more fixtures.
