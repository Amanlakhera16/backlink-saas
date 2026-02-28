# Backlink SaaS Backend

Enterprise-grade backend for a multi-tenant backlink outreach SaaS. It provides authentication, campaign management, prospect discovery, AI scoring/outreach generation, subscription billing, usage limits, and background processing.

## Tech Stack
- Node.js + Express + TypeScript
- MongoDB (Mongoose)
- Redis (BullMQ)
- Stripe (Subscriptions + Webhooks)
- OpenAI
- JWT (Access + Refresh with rotation)

## Core Capabilities
- **Multi-tenant isolation**: all campaign/prospect/AI actions are scoped by `userId`.
- **Auth**: access tokens + refresh tokens with rotation and revocation storage.
- **Campaigns**: create campaigns with plan-based limits.
- **Prospects**: discovery, scoring, outreach generation, and status updates.
- **AI Usage controls**: monthly usage tracking per plan.
- **Billing**: Stripe checkout + billing portal + webhooks to keep subscriptions in sync.
- **Queues**: BullMQ worker for AI jobs (optional toggle).

## Project Structure
```
src
  app.ts                 Express app setup (middleware, routes, webhooks)
  server.ts              Server entrypoint
  worker.ts              BullMQ worker entrypoint
  config/
    env.ts               Environment validation (Zod)
    plans.ts             Plan limits and Stripe price mapping
  controllers/           HTTP controllers (auth, campaigns, AI, billing)
  middlewares/           Auth, validation, rate limits, error handling
  routes/                Route definitions
  infrastructure/
    ai/                  OpenAI client wrapper
    database/            Mongoose models
    queue/               Redis/BullMQ wiring
    stripe/              Stripe client
  usecases/              Business logic
  validators/            Zod request schemas
```

## Environment Variables
Copy `.env.example` to `.env` and fill in real values.

Required keys (see `.env.example`):
- `MONGO_URI`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_BASIC`, `STRIPE_PRICE_PRO` (and optional `STRIPE_PRICE_ENTERPRISE`)
- `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`
- `CORS_ORIGIN`

Optional:
- `USE_QUEUES` (set `true` to enable BullMQ jobs)

## Install & Run
```
npm install
npm run build
npm start
```

For local development (hot reload):
```
npm run dev
```

If you enable queues:
```
# terminal 1: API
npm run dev

# terminal 2: worker
node dist/worker.js
```

## API Overview
Base path: `/api`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Campaigns
- `POST /api/campaigns` (create)
- `POST /api/campaigns/:id/discover` (discover prospects)
- `POST /api/campaigns/:id/score` (AI score prospects)
- `POST /api/campaigns/:id/generate-outreach` (AI outreach)
- `GET  /api/campaigns/:id/export-report` (Markdown report)

### Prospects
- `PATCH /api/prospects/:prospectId/status` (update status)

### Billing (Stripe)
- `POST /api/billing/checkout` (create checkout session)
- `POST /api/billing/portal` (create billing portal session)
- `POST /api/billing/webhook` (Stripe webhook)

## How It Works
1. **Auth** issues access + refresh tokens. Refresh tokens are stored hashed in MongoDB and rotated on use.
2. **Campaigns** are created within plan limits (see `config/plans.ts`).
3. **Prospect discovery** uses a search provider (currently mock) and stores prospects per user/campaign.
4. **AI scoring/outreach** uses OpenAI with rate limiting and plan-based usage tracking.
5. **Billing** syncs subscription status via Stripe webhooks.
6. **Queues** (optional) offload AI tasks to BullMQ workers.

## Security Notes
- All tenant data is scoped by `userId`.
- Access tokens validate issuer/audience.
- Refresh tokens are rotated and revoked on logout.
- Rate limiting is applied per user.
- Stripe webhooks use signature verification.

## Development Notes
- MongoDB indexes are defined for tenant-scoped queries.
- Use `.env.example` as the source of truth for config.
- OpenAI calls are throttled (basic rate limiting). For high throughput, enable queues and scale workers.

## Known Gaps / Next Improvements
- Replace mock search provider with a real source.
- Add integration tests.
- Improve AI output validation with strict JSON schema + retries.
- Add observability (structured logs, metrics, tracing).

## License
Private / internal use.
