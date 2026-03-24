# Vivid VitaBlends Serverless - Gemini CLI Context

This file provides context and instructions for the Gemini CLI when working on the Vivid VitaBlends Serverless project.

## Project Overview

Vivid VitaBlends is a high-performance, full-stack e-commerce application architected for the modern web, running entirely on Cloudflare's Serverless Edge Computing Platform.

## Tech Stack & Architecture

### Backend (`/backend`)

- **Runtime:** Cloudflare Workers
- **Framework:** Hono 4.x
- **Database:** Cloudflare D1 (Serverless SQLite)
- **ORM:** Prisma 6.x (using `@prisma/adapter-d1`)
- **Storage:** Cloudflare R2 (Images)
- **Cache/Rate Limiting:** Cloudflare KV
- **Language:** JavaScript (ES Modules)

### Frontend (`/frontend`)

- **Framework:** React 18 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI)
- **State Management:** TanStack Query (v5)
- **Animations:** Framer Motion & GSAP
- **Hosting:** Cloudflare Pages

### Infrastructure

- **IaC:** Terraform (located in `/terraform`)
- **CI/CD:** GitHub Actions

## Coding Conventions

- **TypeScript:** Use strict typing in the frontend. The backend is currently JavaScript.
- **Styling:** Use Tailwind utility classes. For complex components, use the shadcn/ui patterns.
- **API Design:** RESTful API using Hono routes. Ensure input validation using Zod.
- **Database Access:** Always use Prisma Client. Migrations are managed via Wrangler and D1.
- **Serverless Constraints:** Be mindful of Cloudflare Worker limits (e.g., execution time, memory).

## Development Workflow

- Backend local dev: `npm run dev` in `/backend` (uses Wrangler to simulate edge, D1, KV, R2).
- Frontend local dev: `npm run dev` in `/frontend`.
- Database Migrations: `npx wrangler d1 migrations apply DB --local` (for local development).

## Security

- API endpoints are protected using JWT (with refresh token rotation).
- Edge rate limiting is implemented via Cloudflare KV.
- Strict input validation with Zod.

## AI Assistant Instructions

- When making backend changes, ensure compatibility with Cloudflare Workers (e.g., no Node.js built-ins unless polyfilled or supported by the Workers runtime).
- When modifying database schemas, update `backend/prisma/schema.prisma` and provide instructions or scripts for generating and applying migrations using Wrangler.
- For UI changes, adhere to the existing shadcn/ui design system and Tailwind conventions.
- Prioritize performance and edge-caching strategies where applicable.
