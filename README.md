```markdown
# 🚀 AI Backlink Campaign Automation SaaS – Frontend

Modern SaaS frontend built with Next.js 14 (App Router).

Provides full UI for campaign management, analytics, and billing.

---

## 🧠 What This Frontend Does

- User registration & login
- Dashboard analytics
- Campaign creation
- Prospect discovery control
- AI scoring trigger
- Outreach generation
- Status tracking
- Subscription upgrade
- Report download
- Admin panel (structure ready)

---

## 🏗 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- React 18
- React Query
- Axios
- Tailwind CSS

---

## 📁 Structure Overview
app/
layout.tsx
page.tsx
(auth)/
dashboard/
campaigns/
pricing/
admin/

providers/
lib/
components/
middleware.ts


---

## 🔐 Authentication

- JWT-based login
- Protected routes
- Refresh token support
- Authorization header attachment
- Auto redirect if unauthorized

---

## ⚙️ Setup

### 1️⃣ Install Dependencies

```bash
npm install

2️⃣ Create Environment File
Create:
frontend/.env.local
Add:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

3️⃣ Run Development Server
npm run dev

Visit:
http://localhost:3000



# 🚀 AI Backlink Campaign Automation SaaS – Backend

Enterprise-grade backend powering an AI-driven backlink outreach automation platform.

Built with scalable architecture to support 10,000+ users.

---

## 🧠 What This Backend Does

This backend powers a SaaS platform that:

- Creates SEO backlink campaigns
- Discovers backlink opportunities
- Scores prospects using AI
- Generates personalized outreach emails
- Tracks outreach lifecycle
- Generates campaign reports
- Handles subscription billing (Stripe)
- Enforces plan limits
- Manages AI usage
- Processes background jobs (Redis + BullMQ)
- Ensures multi-tenant data isolation

---

## 🏗 Architecture

### Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Redis (BullMQ)
- Stripe (Subscriptions + Webhooks)
- OpenAI API
- JWT (Access + Refresh tokens)

---

## 🧱 Architectural Pattern

Clean Architecture:

- `domain/` → Entities & business rules
- `usecases/` → Application logic
- `controllers/` → HTTP handling
- `routes/` → API routing
- `infrastructure/` → DB, AI, Stripe, Queue
- `middlewares/` → Auth, validation, limits
- `utils/` → Shared utilities

---

## 🔐 Security Features

- JWT Authentication
- Refresh token via HTTP-only cookies
- Role-based access
- Multi-tenant isolation (userId filtering)
- Rate limiting
- Helmet security headers
- Input validation (Zod)
- Stripe webhook signature verification
- Plan-based usage enforcement

---

## 📦 Features

### Campaign Management
- Create campaigns
- Discover prospects
- Score with AI
- Generate outreach
- Track status
- Export Markdown reports

### AI Integration
- Prospect scoring
- Outreach email generation
- Rate-limited OpenAI calls
- AI usage control per plan

### Subscription Billing
- Free / Pro / Growth plans
- Stripe checkout integration
- Stripe webhook processing
- Plan enforcement middleware

### Background Jobs
- Redis queue (BullMQ)
- Worker process for heavy tasks
- Retry-safe AI execution

---

## ⚙️ Installation

### 1️⃣ Install Dependencies

```bash
npm install

2️⃣ Create Environment File

Create:

backend/.env

Add:

PORT=5000
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_GROWTH=
REDIS_URL=

3️⃣ Run Backend

Development:

npm run dev

Production build:

npm run build
npm start
4️⃣ Run Worker

In separate terminal:
node dist/worker.js
Worker handles:

AI scoring

Outreach generation

Background campaign processing


🔄 API Routes Overview
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

POST   /api/campaigns
POST   /api/campaigns/:id/discover
POST   /api/campaigns/:id/score
POST   /api/campaigns/:id/generate-outreach
GET    /api/campaigns/:id/export-report

PATCH  /api/prospects/:id/status

POST   /api/billing/checkout
POST   /api/webhook/stripe

GET    /api/dashboard/stats
