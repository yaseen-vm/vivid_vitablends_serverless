# Vivid VitaBlends

A full-stack web application built with React, TypeScript, and Node.js.

## Tech Stack

### Frontend

- **React 18.3.1** with **TypeScript 5.8.3**
- **Vite 5.4.19** - Build tooling with SWC plugin
- **Tailwind CSS 3.4.17** - Styling with Autoprefixer & PostCSS
- **shadcn/ui** - Component library (Radix UI primitives)
- **React Router 6.30.1** - Navigation
- **TanStack Query 5.83.0** - Data fetching & caching
- **React Hook Form 7.61.1** with **Zod 3.25.76** - Form validation
- **Vitest 3.2.4** - Testing framework
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **date-fns** - Date utilities
- **Recharts** - Charts
- **Embla Carousel** - Carousel component
- **next-themes** - Theme management
- **ESLint 9.32.0** & **Prettier 3.2.5** - Code quality
- **Husky** & **lint-staged** - Git hooks

### Backend

- **Cloudflare Workers** - Serverless edge computing platform
- **Hono 4.12.8** - Ultrafast web framework for the edge
- **Prisma ORM 6.19.2** with **@prisma/adapter-d1** - Database ORM
- **Cloudflare D1** - Serverless SQL database
- **Cloudflare KV** - Global, low-latency key-value data store (Caching & Rate Limiting)
- **Winston 3.11.0** - Logging
- **bcryptjs** - Password hashing
- **jose** - JWT authentication for the edge
- **Cloudflare R2** - Object storage (Images)
- **Wrangler** - CLI for Cloudflare Workers
- **Prettier** & **Husky** - Code quality & Git hooks

### DevOps & Infrastructure

- **Cloudflare Workers** - Serverless backend deployment
- **Cloudflare Pages** - Static frontend hosting
- **GitHub Actions** - CI/CD pipeline for automated deployment
- **Cloudflare D1** - Serverless SQL database
- **Cloudflare R2** - S3-compatible object storage
- **Cloudflare KV** - Global key-value store for caching and rate limiting

### API Testing

- **Bruno** - API testing client

## Prerequisites

- Node.js (v20 or higher)
- npm or bun
- Cloudflare Account
- Wrangler CLI (`npm install -g wrangler`)

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd vivid_vitablends_serverless
```

### Backend Setup

```bash
cd backend
npm install

# Generate Prisma client
npm run build

# Start development server (local D1)
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

### Backend

- `npm run dev` - Start local Cloudflare Worker development server
- `npm run deploy` - Deploy Worker to Cloudflare
- `npm run build` - Generate Prisma client
- `npm run format` - Format code with Prettier

## Project Structure

```
vivid_vitablends/
├── backend/
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Hono middleware (auth, rate limiting)
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point (Hono app)
│   └── wrangler.toml       # Cloudflare Worker configuration
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utility libraries (apiClient, config)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── vite.config.ts      # Vite configuration
├── bruno/                  # API testing collection
└── .github/
    └── workflows/          # CI/CD workflows (Cloudflare Deploy)
```

## Environment Variables

### Backend (wrangler.toml)

Managed via Cloudflare environment variables and secrets:

- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`

### Frontend (.env)

- `VITE_API_BASE_URL`: URL of the deployed backend worker
- `VITE_WHATSAPP_NUMBER`: Contact number for integration

## Deployment

The project uses GitHub Actions for automated deployment. On every push to the `main` branch:

1. **Backend**: Deployed to Cloudflare Workers via `wrangler deploy`.
2. **Frontend**: Built and deployed to Cloudflare Pages.

### Required Secrets

Ensure these are set in your GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `VITE_WHATSAPP_NUMBER`

## Security

The application is built with security as a priority:

- **Hono Secure Headers**: CSP, HSTS, and other security headers.
- **JWT Authentication**: Secure token management with refresh rotation.
- **Cloudflare KV Rate Limiting**: Protection against brute-force and spam.
- **Input Validation**: Strict schema validation using Zod.
- **Prisma D1**: Safe SQL queries preventing injection.

## License

MIT

<!-- Deployment trigger -->
