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
- **Node.js** with **Express 4.18.2**
- **Prisma ORM 5.8.0** - Database ORM
- **PostgreSQL 16** (Alpine) - Database
- **Redis 7** (Alpine) - Caching layer
- **Winston 3.11.0** - Logging
- **CORS 2.8.5** - Cross-origin resource sharing
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cookie-parser** - Cookie handling
- **AWS SDK S3** - Cloudflare R2 storage integration
- **Sharp 0.34.5** - Image processing
- **Nodemon** - Development server
- **Prettier** & **Husky** - Code quality & Git hooks

### DevOps & Infrastructure
- **Docker** & **Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Nginx** (Alpine) - Reverse proxy & production serving
- **Cloudflare R2** - Object storage (S3-compatible)

### API Testing
- **Bruno** - API testing client

## Prerequisites

- Node.js (v18 or higher)
- npm or bun
- PostgreSQL 16
- Redis 7 (optional, for caching)
- Docker & Docker Compose (optional)
- Cloudflare R2 account (for image storage)

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd vivid_vitablends
```

### Backend Setup

```bash
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

### Docker Setup

```bash
# Run the entire stack
docker-compose up
```

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
vivid_vitablends/
├── backend/
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── .husky/             # Git hooks
│   └── Dockerfile
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── test/           # Test files
│   │   └── types/          # TypeScript types
│   ├── .husky/             # Git hooks
│   └── Dockerfile
├── bruno/                  # API testing collection
├── nginx/                  # Nginx configuration
├── .github/
│   └── workflows/          # CI/CD workflows
├── docker-compose.prod.yml # Production Docker setup
└── scripts/                # Deployment scripts
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DIRECT_URL=postgresql://user:password@localhost:5432/dbname
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=86400
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_BUCKET_ID=your_public_bucket_id
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600
```

### Frontend

Create `.env` file if needed for API endpoints.

## Deployment

The project includes GitHub Actions workflow for automated deployment. Configure your deployment settings in `.github/workflows/deploy.yml`.

## Security

### Security Fixes Applied

This project has been audited and secured against common vulnerabilities:

- ✅ **XSS Protection**: Removed `dangerouslySetInnerHTML` usage
- ✅ **Package Security**: Using scoped package names (`@vivid/backend`, `@vivid/frontend`)
- ✅ **CDN Security**: Fonts loaded with proper CORS headers
- ✅ **Input Validation**: Safe image processing with Sharp library

### Running Security Audits

**Windows:**
```bash
security-audit.bat
```

**Linux/Mac:**
```bash
chmod +x security-audit.sh
./security-audit.sh
```

**Manual:**
```bash
# Backend
cd backend
npm audit
npm audit fix

# Frontend
cd frontend
npm audit
npm audit fix
```

### Security Tools (Recommended)

```bash
# Install Snyk for dependency scanning
npm install -g snyk
snyk test

# Install ESLint security plugin
npm install --save-dev eslint-plugin-security
```

See [SECURITY_FIXES.md](./SECURITY_FIXES.md) for detailed security documentation.

## License

MIT

<!-- Deployment trigger -->
