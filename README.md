# Payflow

> **Move money, move forward.**
>
> 🔗 Live demo: [payflowapp.vercel.app](https://payflowapp.vercel.app) · API: [payflow-8ohe.onrender.com](https://payflow-8ohe.onrender.com)

Payflow is a wallet transfer app with an Express API and a Vite/React frontend. It runs with zero setup locally (a JSON data store, no database needed) and switches to Postgres automatically when a `DATABASE_URL` is provided — so the same code works for quick local review and for a real deployment where accounts persist.

## Contents

- [Stack](#stack)
- [What the app does](#what-the-app-does)
- [Repo layout](#repo-layout)
- [Why this repo is easy to run](#why-this-repo-is-easy-to-run)
- [Local setup](#local-setup)
- [Scripts](#scripts)
- [API summary](#api-summary)
- [Data model](#data-model)
- [Security notes](#security-notes)
- [Contribution flow](#contribution-flow)

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

## Troubleshooting / FAQ

### Port 5000 or 5173 is already in use

Stop the process using the port, then restart the affected dev server:

```bash
lsof -ti :5000 | xargs kill
lsof -ti :5173 | xargs kill
```

If you intentionally run the API on another port, update `PORT` in `.env` and
point the frontend at it with `VITE_API_URL`, for example
`VITE_API_URL=http://localhost:5001`.

### The frontend shows CORS errors

Make sure the backend is running before the frontend:

```bash
npm run dev
```

Then confirm `.env` includes the frontend origin you are using:

```env
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

For a custom Vite port, add that origin to `CLIENT_ORIGINS` or set
`VITE_API_URL` to the API URL the browser should call.

### Requests fail with `Invalid token`

This usually means the browser still has an old JWT after changing
`JWT_SECRET`, reseeding data, or switching environments. Clear local storage,
then sign in again with one of the seeded demo accounts:

```javascript
localStorage.clear();
```

You can run that command in the browser devtools console, or use the app's
logout flow before signing in again.

### Database connection fails on startup

If you do not need Postgres locally, remove or comment out `DATABASE_URL` in
`.env` and use the default JSON store:

```bash
npm run seed
npm run dev
```

If you do want Postgres, verify the connection string with your provider,
including username, password, database name, host, and `sslmode=require` when
required. The API creates tables automatically after a valid `DATABASE_URL`
connects.

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
