# Payflow

Payflow is a wallet transfer app with an Express API and a Vite/React frontend. It runs with zero setup locally (a JSON data store, no database needed) and switches to Postgres automatically when a `DATABASE_URL` is provided — so the same code works for quick local review and for a real deployment where accounts persist.

## Stack

- Node.js + Express
- Postgres when `DATABASE_URL` is set, local JSON store otherwise
- React + Vite
- Jest + Supertest

## What the app does

- Sign in with seeded local demo accounts
- View your wallet balance
- Transfer funds to another local user by email
- Review your own transaction history
- Reset the local dataset at any time

## Repo layout

- `src/` backend app, routes, models, middleware, local data store
- `frontend/` React client
- `tests/` backend request tests
- `data/` local JSON persistence file created by the app
- `.github/` issue templates, PR template, and CI
- `docs/` maintainer notes and Wave issue ideas

## Why this repo is easy to run

- no database required to get started — falls back to a local JSON store
- no Docker required
- contributor can run everything with terminal commands only
- add a `DATABASE_URL` (e.g. a free Neon Postgres) when you want persistent accounts

That makes it a better fit for review programs and newcomer-friendly open source contribution.

## Local setup

### 1. Install dependencies

```bash
npm install
cd frontend
npm install
```

### 2. Create env file

Copy `.env.example` to `.env`.

Minimal local example (JSON store, no database):

```env
PORT=5000
JWT_SECRET=your-local-secret
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

To use Postgres instead (persistent accounts), also set:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

When `DATABASE_URL` is present the API creates its tables automatically on first run.

### 3. Reset demo data

```bash
npm run seed
```

This resets the data store (JSON file or Postgres, whichever is configured) and restores demo accounts:

| Name | Email | Starting balance |
|------|-------|------------------|
| Alex Johnson | `alex@payflow.local` | `2450` |
| Maya Chen | `maya@payflow.local` | `1325` |
| Sam Rivera | `sam@payflow.local` | `880` |

Shared demo password:

- `12345678`

The seed command uses the same storage mode as the app:

- Without `DATABASE_URL`, it rewrites the local JSON store at `data/payflow.json` or the custom `DATA_FILE` path.
- With `DATABASE_URL`, it truncates and re-seeds the Postgres `users`, `wallets`, and `transactions` tables.

Do not run `npm run seed` against a real production `DATABASE_URL`; it wipes the existing Payflow data before inserting the demo records.

### 4. Run the backend

```bash
npm run dev
```

### 5. Run the frontend

```bash
cd frontend
npm run dev
```

The frontend expects the API at `http://localhost:5000` unless `VITE_API_URL` is set.

## Scripts

### Root

- `npm run dev` start API in watch mode
- `npm run start` start API once
- `npm run seed` reset local demo data
- `npm test` run backend tests

### Frontend

- `npm run dev` start Vite dev server
- `npm run build` build production assets

## API summary

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Wallet

- `GET /wallet/balance`
- `POST /wallet/transfer`

### Transactions

- `GET /transactions`

All wallet and transaction routes require `Authorization: Bearer <token>`.

## Data model

The backend stores users, wallets, and transactions in one of two interchangeable backends:

- **Postgres** — used when `DATABASE_URL` is set. Tables are created automatically.
- **Local JSON** — the default fallback, written to `data/payflow.json`. Override the path with `DATA_FILE` in `.env`.

Transfers run as a single atomic operation (a locked DB transaction on Postgres), so balances stay consistent.

## Security notes

- Passwords are hashed with `bcryptjs`
- Transfer sender identity is derived from the signed JWT, not the request body
- Balance and transaction reads are scoped to the authenticated user
- Transfer validation uses recipient email and positive numeric amounts

## Contribution flow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, branching, and review expectations.

For Wave/maintainer prep, start with [docs/wave-issue-backlog.md](./docs/wave-issue-backlog.md).
