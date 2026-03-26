# Downwork Client

A modern freelance marketplace frontend built with Vue 3, TypeScript, and Vite.

## Tech Stack

- **Framework:** Vue 3.5+ (Composition API)
- **Build Tool:** Vite 7
- **Language:** TypeScript 5.9 (strict mode)
- **State Management:** Pinia
- **Routing:** Vue Router 5
- **Styling:** Tailwind CSS 4
- **HTTP Client:** Axios
- **Testing:** Vitest + Vue Test Utils
- **Linting:** ESLint + Prettier

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ or pnpm 9+

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:1997`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run build:dev` | Build for development environment |
| `npm run build:staging` | Build for staging environment |
| `npm run build:prod` | Build for production environment |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint and auto-fix code |
| `npm run format` | Format code with Prettier |

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | `Downwork` |
| `VITE_APP_URL` | Frontend URL | `http://localhost:1997` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000/api/v1` |
| `VITE_USE_MOCK` | Use mock data instead of real API | `true` |
| `VITE_USE_COOKIE_AUTH` | Use httpOnly cookies for auth | `false` |
| `VITE_ENABLE_2FA` | Enable two-factor authentication | `true` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `false` |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | *(empty)* |

## Project Architecture

```
src/
├── assets/           # Global CSS, images, fonts
├── components/       # Reusable components
│   ├── common/       # Business-level shared components (Logo, Avatar, Errors)
│   ├── layout/       # Layout parts (Navbar, Footer)
│   ├── settings/     # Settings-related components
│   └── ui/           # Base UI components (Button, Input, Modal, etc.)
├── composables/      # Vue composables (reusable logic)
├── config/           # Runtime configuration (API URLs, feature flags)
├── constants/        # Static data (categories, country lists)
├── layouts/          # Page layouts (Auth, Dashboard, Public, Admin)
├── mocks/            # Mock data handlers for development
├── modules/          # Feature modules (domain-driven)
│   ├── admin/        # Admin panel features
│   ├── auth/         # Authentication (login, register, 2FA)
│   ├── chat/         # Messaging system
│   ├── client/       # Client dashboard & features
│   ├── freelancer/   # Freelancer dashboard & features
│   ├── jobs/         # Job browsing & management
│   ├── notifications/# Notification center
│   ├── payments/     # Payment management
│   └── public/       # Public pages (home, about, pricing)
├── plugins/          # Vue plugins (Pinia, etc.)
├── router/           # Vue Router configuration
│   ├── guards/       # Navigation guards (auth, role-based)
│   └── routes/       # Route definitions per module
├── services/         # API services
│   ├── api/          # Domain-specific API services
│   └── http/         # Axios instance & base service
├── stores/           # Pinia stores (state management)
├── types/            # TypeScript type definitions
└── utils/            # Utility functions (logger, env validation)
```

### Architecture Principles

1. **Module-based Architecture**: Features are organized by domain, not by type
2. **Composition API**: All components use `<script setup>` syntax
3. **Service Layer Pattern**: HTTP calls go through typed service classes
4. **Role-based Access**: Routes and UI adapt based on user role
5. **Type Safety**: Strict TypeScript with shared type definitions

## Component Naming Convention

- `App*` prefix for base UI components (`AppButton`, `AppInput`, `AppModal`)
- `*Page` suffix for page components (`DashboardPage`, `LoginPage`)
- `*Layout` suffix for layout components (`DashboardLayout`, `AuthLayout`)

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Tests are located in `__tests__` folders next to the code they test.

## Deployment

### Vercel

The project includes `vercel.json` for automatic Vercel deployment.

### Netlify

The project includes `netlify.toml` for automatic Netlify deployment.

### Manual Build

```bash
npm run build:prod
```

The production build will be output to `dist/`.

## Code Quality

- **ESLint** for linting with Vue and TypeScript rules
- **Prettier** for consistent code formatting
- **TypeScript** strict mode enabled
- **Vue TSC** for Vue-specific type checking

Run all checks:

```bash
npm run type-check && npm run lint
```

## License

Private - All rights reserved.
