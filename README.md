# Vivid VitaBlends - 100% Serverless E-Commerce Platform

Vivid VitaBlends is a high-performance, full-stack e-commerce application architected for the modern web. Following a complete migration from traditional VPS/Docker hosting, it now runs entirely on **Cloudflare's Serverless Edge Computing Platform**, providing unparalleled global scale, security, and speed.

---

## 🏗️ Serverless Architecture & Tech Stack

### Infrastructure (Cloudflare Ecosystem)

- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/) - High-performance V8 isolates running at the edge.
- **Web Framework:** [Hono 4.x](https://hono.dev/) - Ultrafast, lightweight, and type-safe router designed for edge environments.
- **Primary Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) - Serverless SQL (SQLite) with global read-replication.
- **ORM:** [Prisma 6.x](https://www.prisma.io/) - Utilizing `@prisma/adapter-d1` for type-safe database access in serverless environments.
- **Object Storage:** [Cloudflare R2](https://developers.cloudflare.com/r2/) - S3-compatible, zero egress fee storage for product and category images.
- **Cache & Rate Limiting:** [Cloudflare KV](https://developers.cloudflare.com/kv/) - Low-latency key-value store used for intelligent edge caching and brute-force protection.
- **Frontend Hosting:** [Cloudflare Pages](https://pages.cloudflare.com/) - Blazing fast static and dynamic hosting for React applications.
- **IaC:** [Terraform](https://www.terraform.io/) - Automated provisioning of all Cloudflare resources.

### Frontend

- **React 18** with **TypeScript** - Modular UI development.
- **Vite** - Optimized build tool with SWC for lightning-fast HMR.
- **Tailwind CSS** - Utility-first styling with high performance.
- **shadcn/ui** - Accessible, unstyled components built on Radix UI.
- **TanStack Query (v5)** - Sophisticated server state management and caching.
- **Framer Motion & GSAP** - Fluid, high-performance animations.

---

## 📂 Project Structure

```text
vivid_vitablends_serverless/
├── backend/                # Cloudflare Worker (Hono API)
│   ├── prisma/             # SQLite Schema & D1 Migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, Cache, RateLimit, Validation
│   │   ├── repositories/   # Data access layer (Prisma)
│   │   ├── routes/         # Hono route definitions
│   │   ├── services/       # Core business logic
│   │   └── utils/          # Logger, Context management
│   ├── server.js           # Entry Point
│   └── wrangler.toml       # Worker configuration & Bindings
├── frontend/               # React Application (Cloudflare Pages)
│   ├── src/
│   │   ├── components/     # UI components (shadcn/ui)
│   │   ├── context/        # Global state
│   │   ├── services/       # API integration layer
│   │   └── pages/          # Main application views
├── terraform/              # Infrastructure Definitions
│   └── main.tf             # D1, R2, KV, and Pages provisioning
├── bruno/                  # API testing collections
└── .github/workflows/      # Automated CI/CD (Deployments)
```

---

## 🔌 API Documentation

### Admin & Auth

- `POST /api/admin/login` - Admin authentication.
- `POST /api/admin/refresh` - Rotate JWT tokens.
- `POST /api/admin/logout` - Invalidate session.

### Products

- `GET /api/products` - List all products (supports filters).
- `GET /api/products/:id` - Get single product details.
- `GET /api/products/featured` - Get featured products for home.
- `GET /api/products/combos` - Get combo deals.
- `POST /api/products` - Create new product (Admin).
- `PUT /api/products/:id` - Update product (Admin).
- `DELETE /api/products/:id` - Remove product (Admin).

### Categories

- `GET /api/categories` - List all categories.
- `GET /api/categories/homepage` - List categories visible on home.
- `POST /api/categories` - Create category (Admin).
- `PUT /api/categories/:id` - Update category details (Admin).
- `PUT /api/categories/:id/homepage` - Toggle home visibility (Admin).

### Orders

- `POST /api/orders` - Place a new order (Rate limited).
- `GET /api/orders` - List all orders (Admin).
- `PATCH /api/orders/:id/status` - Update order status (Admin).
- `GET /api/orders/user/:userId` - Get orders for a specific user.

### Reviews & Messages

- `GET /api/reviews` - Fetch customer reviews.
- `GET /api/reviews/hero` - Fetch reviews for the hero section.
- `POST /api/reviews` - Submit a new review.
- `POST /api/messages` - Submit contact form.
- `GET /api/messages` - View all messages (Admin).

---

## 🛠️ Development Workflow

### Prerequisites

- Node.js v20+
- Wrangler CLI: `npm install -g wrangler`
- Cloudflare Account

### 1. Local Infrastructure

For local development, Cloudflare's `wrangler` simulates the edge environment:

```bash
cd backend
# Run migrations on local D1 simulation
npx wrangler d1 migrations apply DB --local
# Start local worker with D1, KV, and R2 bindings
npm run dev
```

### 2. Database Management

```bash
# Generate Prisma Client
npm run build
# Create a new migration
npx wrangler d1 migrations create DB <migration_name>
# Apply migrations to production D1
npx wrangler d1 migrations apply DB --remote
```

### 3. Frontend Development

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

### Automated (GitHub Actions)

The repository is configured with GitHub Actions (`.github/workflows/deploy.yml`) to deploy on every push to `main`.

1. **Backend:** Deploys the Hono worker to Cloudflare Workers.
2. **Frontend:** Builds the React app and deploys to Cloudflare Pages.

### Manual Deployment

- **Backend:** `cd backend && wrangler deploy`
- **Frontend:** `cd frontend && npm run build && wrangler pages deploy dist`

---

## 🔐 Environment & Secrets

### Backend (wrangler.toml / Secrets)

- `JWT_SECRET` - Primary JWT signing key.
- `JWT_REFRESH_SECRET` - Key for refresh tokens.
- `CORS_ORIGIN` - Allowed origins (comma separated).

### Frontend (.env)

- `VITE_API_BASE_URL` - URL of the backend worker.
- `VITE_WHATSAPP_NUMBER` - Support contact for order notifications.

---

## 🛡️ Security Features

- **JWT with Refresh Rotation:** Secure admin sessions with short-lived access tokens.
- **Hono Secure Headers:** Pre-configured CSP, HSTS, and XSS protection.
- **Edge Rate Limiting:** Prevents brute-force on login and order endpoints via KV.
- **Zod Validation:** Strict input sanitization for all API requests.
- **Cloudflare WAF:** Inherent protection against DDoS and common web exploits.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
