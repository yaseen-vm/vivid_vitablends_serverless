# Vivid VitaBlends

A full-stack web application built with React, TypeScript, and Node.js.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for navigation
- TanStack Query for data fetching
- React Hook Form with Zod validation
- Vitest for testing

### Backend
- Node.js with Express
- Prisma ORM
- PostgreSQL database
- Winston for logging
- CORS enabled

### DevOps
- Docker & Docker Compose
- GitHub Actions for CI/CD
- Nginx for production serving

## Prerequisites

- Node.js (v18 or higher)
- npm or bun
- PostgreSQL
- Docker (optional)

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

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## Project Structure

```
vivid_vitablends/
├── backend/
│   ├── api-tests/          # API test files
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   └── Dockerfile
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   └── test/           # Test files
│   └── Dockerfile
├── .github/
│   └── workflows/          # CI/CD workflows
└── docker-compose.yml
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3000
NODE_ENV=development
```

### Frontend

Create `.env` file if needed for API endpoints.

## Deployment

The project includes GitHub Actions workflow for automated deployment. Configure your deployment settings in `.github/workflows/deploy.yml`.

## License

MIT

<!-- Deployment trigger -->
