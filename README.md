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

- `alex@payflow.local`
- `maya@payflow.local`
- `sam@payflow.local`

Shared demo password:

- `12345678`

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

- Passwords are hashed with `bcryptjs` before they are stored.
- Authenticated routes require `Authorization: Bearer <token>`. The middleware verifies the JWT with `JWT_SECRET` and attaches the decoded user id to the request.
- Transfer sender identity is derived from the signed JWT, not the request body, so clients cannot choose another sender id.
- Balance and transaction reads are scoped to the authenticated user.
- Transfer validation uses recipient email and positive numeric amounts.
- Never commit `.env`, `JWT_SECRET`, `DATABASE_URL`, or provider credentials. Keep local secrets in `.env` and production secrets in the deployment secret manager.
- If `JWT_SECRET` or database credentials are exposed, rotate them immediately. After rotating `JWT_SECRET`, users must sign in again because old tokens will fail with `Invalid token`.

## Contribution flow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, branching, and review expectations.

For Wave/maintainer prep, start with [docs/wave-issue-backlog.md](./docs/wave-issue-backlog.md).
