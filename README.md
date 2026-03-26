# Downwork — Freelance Marketplace

Full-stack freelance marketplace platform (Upwork clone) built for course demonstration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3, TypeScript, Vite, Tailwind CSS 4, Pinia, Vue Router |
| Backend | NestJS, TypeScript, Prisma ORM, JWT Auth |
| Database | PostgreSQL (Neon.tech free tier) |
| Deploy | Vercel (frontend) + Railway (backend) |

## Project Structure

```
├── client/          # Vue 3 frontend
│   ├── src/
│   │   ├── modules/     # Feature modules (auth, freelancer, client, admin)
│   │   ├── components/  # Shared UI components
│   │   ├── services/    # API service layer
│   │   ├── stores/      # Pinia state management
│   │   └── types/       # TypeScript interfaces
│   └── ...
├── server/          # NestJS backend
│   ├── src/
│   │   ├── modules/     # Feature modules (auth, jobs, contracts, etc.)
│   │   ├── common/      # Guards, decorators, interceptors
│   │   └── prisma/      # Database service
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
└── README.md
```

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- PostgreSQL (or use SQLite for quick testing)

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env` from the example:
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

Initialize the database:
```bash
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts
```

Start the server:
```bash
npm run build
node dist/main.js
# Server runs on http://localhost:3000
# Swagger docs at http://localhost:3000/api/docs
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
# App runs on http://localhost:1997
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@downwork.com | password123 |
| Client | sarah@techcorp.com | password123 |
| Client | mike@designstudio.com | password123 |
| Freelancer | alex@freelance.com | password123 |
| Freelancer | emma@design.com | password123 |
| Freelancer | james@dev.com | password123 |

## Deployment

### Frontend → Vercel (Free)
1. Push to GitHub
2. Import project in Vercel, set root directory to `client`
3. Set environment variables: `VITE_USE_MOCK=false`, `VITE_API_BASE_URL=https://your-backend.up.railway.app/api/v1`

### Backend → Railway (~$5/month)
1. Create a new project in Railway
2. Add a PostgreSQL database (or connect Neon.tech)
3. Deploy from GitHub, set root directory to `server`
4. Set environment variables (see `server/.env.example`)

## API Endpoints (88+)

| Module | Routes | Description |
|--------|--------|-------------|
| Auth | 16 | Login, register, JWT refresh, 2FA, sessions |
| Users | 8 | Profiles, avatar, password, settings |
| Jobs | 14 | CRUD, search, filter, save, invite |
| Proposals | 8 | Submit, accept, reject, shortlist |
| Contracts | 15 | Milestones, disputes, reviews |
| Payments | 13 | Balance, withdrawals, connects |
| Chat | 8 | Conversations, messages, file upload |
| Notifications | 6 | CRUD, preferences |
| Reviews | 3 | Get reviews, report |
| KYC | 3 | Status, submit documents |
| Invitations | 5 | Send, accept, decline |
| Admin | 18 | Stats, user management, disputes, settings |

## License

MIT — For educational/demonstration purposes only.
