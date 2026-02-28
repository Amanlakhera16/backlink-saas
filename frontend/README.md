# Backlink SaaS Frontend

This is the Next.js (App Router) frontend for the Backlink SaaS product. It communicates with the backend API over HTTP and uses Axios for requests.

## Getting Started

1. Install dependencies from the frontend directory.
2. Start the dev server.

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend to be running and reachable via the API base URL.

## Environment Variables

Set these in `frontend/.env.local`.

- `NEXT_PUBLIC_API_BASE_URL` - Base URL for the backend API. Must include the `/api` prefix. Example: `http://localhost:5000/api`.

No other environment variables are required by the current frontend code.

## API Integration

The frontend talks to the backend through the base URL above and uses these endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /dashboard/stats`
- `POST /campaigns`
- `POST /campaigns/:id/discover`
- `POST /campaigns/:id/score`
- `POST /campaigns/:id/generate-outreach`
- `GET /campaigns/:id/export-report`
- `POST /billing/checkout` (expects `{ planId }` in the body)
- `POST /billing/portal`

Note: the actual URLs sent over the network are `NEXT_PUBLIC_API_BASE_URL` + each path above (for example `http://localhost:5000/api/auth/login`).

## Project Structure

- `app/` - Next.js App Router pages and layouts.
- `components/` - Shared UI components.
- `hooks/` - Custom React hooks.
- `lib/` - API client and utilities.
- `providers/` - Context providers (React Query, etc.).
- `public/` - Static assets.

## Auth Notes

- The backend returns an access token on login.
- The frontend stores it in a cookie named `accessToken` and sends it as a Bearer token in `frontend/lib/api.ts`.
- Ensure the backend `CORS_ORIGIN` includes the frontend URL (for example `http://localhost:3000`).

## Scripts

- `npm run dev` - Start the dev server.
- `npm run build` - Build for production.
- `npm run start` - Start the production build.
- `npm run lint` - Run ESLint.
