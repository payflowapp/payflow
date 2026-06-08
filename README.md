# Payflow

Payflow is a local-first wallet transfer app with an Express API and a Vite/React frontend. It is designed to be easy to run, easy to review, and easy for outside contributors to understand without needing any hosted database or third-party infrastructure.

## Stack

- Node.js + Express
- Local JSON data store
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

## Why this repo is local-first

- no MongoDB
- no Docker required
- no cloud service setup
- contributor can run everything with terminal commands only

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

Minimal local example:

```env
PORT=5000
JWT_SECRET=your-local-secret
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 3. Reset local demo data

```bash
npm run seed
```

This writes a fresh local data file and restores demo accounts:

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

The backend persists to a local JSON file, by default:

- `data/payflow.json`

You can override that path with `DATA_FILE` in `.env` if needed.

## Security notes

- Passwords are hashed with `bcryptjs`
- Transfer sender identity is derived from the signed JWT, not the request body
- Balance and transaction reads are scoped to the authenticated user
- Transfer validation uses recipient email and positive numeric amounts

## Contribution flow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, branching, and review expectations.

For Wave/maintainer prep, start with [docs/wave-issue-backlog.md](./docs/wave-issue-backlog.md).
