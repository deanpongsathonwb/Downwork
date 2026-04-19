# Downwork — Full-Stack Freelance Marketplace

A production-grade freelance marketplace platform built with **Vue 3** and **NestJS**. Connects clients who need work done with talented freelancers, featuring real-time messaging, milestone-based payments, proposal management, and a comprehensive admin dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vue 3, TypeScript, Pinia, Vue Router, Tailwind CSS 4, Vite 7 |
| **Backend** | NestJS 11, TypeScript, Passport JWT |
| **Database** | PostgreSQL (Neon.tech), Prisma ORM 6 |
| **Real-time** | Socket.IO (WebSocket chat & notifications) |
| **Auth** | JWT access/refresh tokens, 2FA (TOTP), email verification |
| **Storage** | Local filesystem or S3-compatible object storage |
| **Email** | SMTP or console provider (pluggable) |
| **Monitoring** | Sentry, health checks (`/health`), structured logging |
| **CI/CD** | GitHub Actions, Vercel (client), Railway (server) |

---

## Architecture

```
Downwork/
├── client/          # Vue 3 SPA (Vite + Tailwind)
├── server/          # NestJS API (modular monolith)
│   ├── prisma/      # Schema, migrations, seed
│   └── src/
│       ├── common/  # Guards, decorators, filters, middleware, DTOs
│       ├── modules/ # Feature modules (auth, jobs, contracts, …)
│       └── prisma/  # PrismaService
└── README.md
```

The backend follows a **modular monolith** pattern — each domain (auth, jobs, proposals, contracts, payments, chat, etc.) lives in its own NestJS module with dedicated controller, service, and DTOs. Cross-cutting concerns (rate-limiting, logging, RBAC, exception handling) are wired globally via guards, interceptors, and filters.

---

## Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | >= 20.0.0 |
| **npm** | >= 10 |
| **PostgreSQL** | 15+ (or a Neon.tech free-tier database) |

---

## Quick Start

### Local Development

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env — at minimum set DATABASE_URL

# 3. Set up the database
cd server
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed sample data

# 4. Start development servers
# Terminal 1 — API
cd server && npm run start:dev

# Terminal 2 — Client
cd client && npm run dev
```

| Service | URL |
|---|---|
| Client (Vite) | `http://localhost:1997` |
| API | `http://localhost:3000` (REST prefix `http://localhost:3000/api/v1`) |
| Swagger Docs | `http://localhost:3000/api/docs` |
| Prisma Studio | `npx prisma studio` (port 5555) |

---

## Environment Variables

All server environment variables are documented in [`server/.env.example`](server/.env.example).

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Yes | — | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Yes | — | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | No | `3600` | Access token TTL in seconds |
| `JWT_REFRESH_EXPIRES_IN` | No | `604800` | Refresh token TTL in seconds |
| `PORT` | No | `3000` | Server listen port |
| `NODE_ENV` | No | `production` | `development` / `production` |
| `CORS_ORIGIN` | No | `http://localhost:1997` | Allowed browser origins (comma-separated); must include your Vite dev URL or production frontend URL |
| `FRONTEND_URL` | No | — | Used in email links |
| `UPLOAD_DIR` | No | `./uploads` | Local upload directory |
| `MAX_FILE_SIZE` | No | `52428800` | Max upload size in bytes (50 MB) |
| `EMAIL_PROVIDER` | No | `console` | `console` or `smtp` |
| `EMAIL_FROM` | No | — | Sender email address |
| `SMTP_HOST` | Cond. | — | Required when `EMAIL_PROVIDER=smtp` |
| `SMTP_PORT` | Cond. | `587` | SMTP port |
| `SMTP_USER` | Cond. | — | SMTP username |
| `SMTP_PASS` | Cond. | — | SMTP password |
| `STORAGE_PROVIDER` | No | `local` | `local` or `s3` |
| `S3_BUCKET` | Cond. | — | Required when `STORAGE_PROVIDER=s3` |
| `S3_REGION` | No | `us-east-1` | AWS region |
| `S3_ACCESS_KEY` | Cond. | — | S3 access key |
| `S3_SECRET_KEY` | Cond. | — | S3 secret key |
| `S3_ENDPOINT` | No | — | Custom S3 endpoint (MinIO, R2, etc.) |
| `CDN_URL` | No | — | Public CDN URL prefix for assets |
| `SENTRY_DSN` | No | — | Sentry error tracking DSN |

---

## API Documentation

Interactive Swagger documentation is auto-generated and available at:

```
GET /api/docs
```

### Key Endpoints

| Area | Method | Path | Description |
|---|---|---|---|
| **Auth** | `POST` | `/auth/register` | Register a new account |
| | `POST` | `/auth/login` | Log in (returns JWT pair) |
| | `POST` | `/auth/refresh` | Refresh access token |
| | `POST` | `/auth/verify-email` | Verify email address |
| | `POST` | `/auth/2fa/enable` | Enable two-factor auth |
| **Users** | `GET` | `/users/freelancers` | Browse freelancers |
| | `PATCH` | `/users/me` | Update own account |
| | `GET` | `/users/me/data/export` | GDPR data export |
| **Jobs** | `GET` | `/jobs` | Search/filter jobs |
| | `POST` | `/jobs` | Post a new job |
| **Proposals** | `POST` | `/proposals` | Submit a proposal |
| | `PATCH` | `/proposals/:id/status` | Accept/reject proposal |
| **Contracts** | `POST` | `/contracts` | Create contract |
| | `PATCH` | `/contracts/:id/milestones/:mid` | Update milestone |
| **Payments** | `GET` | `/payments/balance` | Get wallet balance |
| | `POST` | `/payments/deposit` | Deposit funds |
| **Chat** | `GET` | `/chat/conversations` | List conversations |
| **Reviews** | `POST` | `/reviews` | Leave a review |
| **Admin** | `GET` | `/admin/dashboard` | Platform analytics |

---

## Development Workflow

### Scripts — Server (`server/`)

| Command | Description |
|---|---|
| `npm run start:dev` | Start API in watch mode |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Run compiled production build |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema changes to DB |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:reset` | Wipe DB, re-push schema, re-seed |
| `npm run setup` | Full setup (generate + push + seed) |

### Scripts — Client (`client/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Run `vue-tsc --noEmit` |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier formatting |

---

## Deployment

### Client — Vercel

1. Import the repository on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set **Build Command** to `npm run build` (or rely on [`client/vercel.json`](client/vercel.json), which uses `npm run build:prod`).
4. Set **Output Directory** to `dist`.
5. Set production env vars to match [`client/.env.production`](client/.env.production), especially `VITE_API_BASE_URL` (full REST base, e.g. `https://your-api.example.com/api/v1`) and `VITE_APP_URL` (canonical frontend URL). The CSP `connect-src` in `vercel.json` must allow that API origin (see `client/vercel.json`).

### Server — Railway

1. Create a new project on [railway.app](https://railway.app).
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm run build` and **Start Command** to `npm run start:prod`.
4. Add all environment variables from `.env.example`.
5. Provision a PostgreSQL plugin or connect your Neon.tech database.

## Project Structure

```
Downwork/
├── .github/
│   └── workflows/ci.yml          # GitHub Actions CI pipeline
├── client/
│   ├── src/
│   │   ├── assets/                # Static assets & styles
│   │   ├── components/            # Reusable Vue components
│   │   ├── composables/           # Vue composables (hooks)
│   │   ├── layouts/               # Layout wrappers
│   │   ├── pages/                 # Route-level views
│   │   ├── router/                # Vue Router config
│   │   ├── stores/                # Pinia stores
│   │   ├── types/                 # TypeScript interfaces
│   │   └── utils/                 # Helper functions
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (30+ models)
│   │   └── seed.ts                # Seeder with sample data
│   ├── src/
│   │   ├── common/
│   │   │   ├── config/            # App, JWT, email, storage config
│   │   │   ├── decorators/        # @Public, @Roles, @CurrentUser
│   │   │   ├── dto/               # Shared DTOs (pagination)
│   │   │   ├── filters/           # Global exception filter
│   │   │   ├── guards/            # JWT, roles, email-verified, throttle
│   │   │   ├── interceptors/      # Response transform interceptor
│   │   │   └── middleware/        # Request logger
│   │   ├── modules/
│   │   │   ├── admin/             # Platform admin dashboard & management
│   │   │   ├── auth/              # Register, login, 2FA, JWT, sessions
│   │   │   ├── chat/              # WebSocket conversations & messages
│   │   │   ├── contracts/         # Contracts & milestones
│   │   │   ├── email/             # Pluggable email (console/SMTP)
│   │   │   ├── health/            # Health check endpoints
│   │   │   ├── invitations/       # Job invitations
│   │   │   ├── jobs/              # Job posting, search, filtering
│   │   │   ├── kyc/               # KYC document upload & verification
│   │   │   ├── notifications/     # In-app notifications
│   │   │   ├── payments/          # Wallet, transactions, deposits
│   │   │   ├── proposals/         # Proposal submission & management
│   │   │   ├── reviews/           # Ratings & reviews
│   │   │   ├── schedule/          # Cron jobs (session cleanup, etc.)
│   │   │   ├── storage/           # Pluggable storage (local/S3)
│   │   │   └── users/             # Profiles, settings, GDPR
│   │   └── prisma/                # PrismaService & PrismaModule
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Contributing

1. **Fork** the repository and create a feature branch from `master`.
2. Follow existing code conventions (Prettier + ESLint configs are included).
3. Write or update tests for any new functionality.
4. Ensure `npm run lint` and `npm run build` pass in both `client/` and `server/`.
5. Open a Pull Request with a clear description of the changes.

---

## License

This project is licensed under the [MIT License](LICENSE).
