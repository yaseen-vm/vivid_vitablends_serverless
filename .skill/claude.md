# CLAUDE.md - AI Development Context

## Project Overview

**Vivid VitaBlends** is a full-stack e-commerce web application for selling health products (pickles, powders, and wellness items). The platform features a customer-facing storefront with product browsing, cart management, checkout, and reviews, alongside an admin dashboard for managing products, orders, and reviews.

The application is built with modern web technologies, containerized with Docker, and designed for production deployment with CI/CD pipelines.

## Architecture

### High-Level Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React SPA     │─────▶│  Express API    │─────▶│   PostgreSQL    │
│  (Frontend)     │      │   (Backend)     │      │   (Database)    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │                         │
        │                        ├──────────────────┐      │
        │                        │                  │      │
        ▼                        ▼                  ▼      ▼
┌─────────────────┐      ┌─────────────────┐  ┌──────────────┐
│     Nginx       │      │   Redis Cache   │  │  AWS S3/R2   │
│  (Production)   │      │   (Sessions)    │  │   (Images)   │
└─────────────────┘      └─────────────────┘  └──────────────┘
```

### Folder Structure

```
vivid_vitablends/
├── backend/                    # Node.js Express API
│   ├── prisma/                # Database schema & migrations
│   ├── src/
│   │   ├── config/            # Environment & service configs
│   │   ├── controllers/       # Request handlers (thin layer)
│   │   ├── middleware/        # Auth, logging, rate limiting, cache
│   │   ├── repositories/      # Data access layer (Prisma)
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic layer
│   │   └── utils/             # Helpers (JWT, logger, Redis, image processing)
│   └── Dockerfile
├── frontend/                   # React TypeScript SPA
│   ├── src/
│   │   ├── assets/            # Static images
│   │   ├── components/        # Reusable UI components
│   │   │   ├── admin/         # Admin dashboard components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── context/           # React Context (Cart)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities & config
│   │   ├── pages/             # Route pages
│   │   ├── services/api/      # API client layer
│   │   └── types/             # TypeScript definitions
│   └── Dockerfile
├── nginx/                      # Reverse proxy config
├── .github/workflows/          # CI/CD pipelines
└── docker-compose.yml          # Local development orchestration
```

### Architectural Patterns

- **Layered Architecture**: Controllers → Services → Repositories → Database
- **Repository Pattern**: Data access abstraction via repositories
- **Dependency Injection**: Services receive dependencies (Prisma, Redis, etc.)
- **Separation of Concerns**: Business logic in services, data access in repositories
- **API-First Design**: RESTful API with clear contracts

## Tech Stack

### Frontend

- **Language**: TypeScript
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Context API, TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + Testing Library

### Backend

- **Language**: JavaScript (ES Modules)
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT (access + refresh tokens)
- **Password Hashing**: bcryptjs
- **Image Processing**: Sharp
- **Storage**: AWS S3 / Cloudflare R2
- **Logging**: Winston
- **Security**: CORS, rate limiting, cookie-parser

### Infrastructure

- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Code Quality**: Husky, lint-staged, Prettier, ESLint

## Development Guidelines

### Code Style

#### Backend (JavaScript)

- Use ES6+ module syntax (`import`/`export`)
- Use `async`/`await` over callbacks
- Prefer arrow functions for inline callbacks
- Use descriptive variable names (no single letters except loop counters)
- Format with Prettier (2 spaces, single quotes)
- No semicolons (Prettier enforced)

#### Frontend (TypeScript)

- Strict TypeScript mode enabled
- Define interfaces for all props and API responses
- Use functional components with hooks (no class components)
- Prefer named exports over default exports
- Use `const` for components and hooks
- Format with Prettier (2 spaces, single quotes)

### Naming Conventions

#### Backend

- **Files**: `kebab-case.js` (e.g., `product.service.js`)
- **Classes**: `PascalCase` (rare, mostly functional)
- **Functions**: `camelCase` (e.g., `getUserById`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)
- **Routes**: `/api/resource-name` (plural, kebab-case)

#### Frontend

- **Components**: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- **Hooks**: `camelCase.ts` starting with `use` (e.g., `useProducts.ts`)
- **Utilities**: `camelCase.ts` (e.g., `formatPrice.ts`)
- **Types**: `PascalCase` interfaces/types (e.g., `Product`, `ReviewFormData`)
- **CSS Classes**: Tailwind utility classes (no custom CSS unless necessary)

### Modularity Rules

- **Single Responsibility**: Each module/component does one thing well
- **DRY Principle**: Extract reusable logic into utilities/hooks
- **Thin Controllers**: Controllers only handle HTTP concerns, delegate to services
- **Fat Services**: Business logic lives in services
- **Reusable Components**: Build atomic UI components in `components/ui/`
- **Custom Hooks**: Extract stateful logic into custom hooks
- **API Abstraction**: All API calls go through `services/api/` layer

### Error Handling Standards

#### Backend

```javascript
// Use try-catch in async functions
try {
  const result = await service.operation();
  res.json({ success: true, data: result });
} catch (error) {
  logger.error("Operation failed", { error: error.message });
  res.status(500).json({ success: false, error: "Internal server error" });
}
```

- Log errors with Winston (include context)
- Return consistent error responses: `{ success: false, error: 'message' }`
- Never expose stack traces to clients in production
- Use HTTP status codes correctly (400, 401, 403, 404, 500)

#### Frontend

```typescript
// Use TanStack Query error handling
const { data, error, isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
  onError: (err) => toast.error("Failed to load products"),
});
```

- Display user-friendly error messages
- Use toast notifications for errors
- Implement error boundaries for component crashes
- Log errors to console in development

## Security Standards

### Authentication & Authorization

- **JWT Tokens**: Access tokens (15min) + refresh tokens (7 days)
- **Secure Cookies**: `httpOnly`, `secure`, `sameSite: 'strict'`
- **Password Hashing**: bcryptjs with salt rounds ≥ 10
- **Session Management**: Store refresh tokens in database, support revocation
- **Admin Routes**: Protected with `auth` middleware
- **Role-Based Access**: Check `admin.role` before sensitive operations

### Input Validation

- **Backend**: Validate all inputs in controllers before passing to services
- **Frontend**: Use Zod schemas with React Hook Form
- **SQL Injection**: Prisma ORM prevents SQL injection (parameterized queries)
- **XSS Prevention**: Never use `dangerouslySetInnerHTML`
- **File Uploads**: Validate file types, size limits, process with Sharp

### Secrets Management

- **Environment Variables**: All secrets in `.env` files (never committed)
- **Required Secrets**:
  - `DATABASE_URL`, `DIRECT_URL`
  - `JWT_SECRET`, `JWT_REFRESH_SECRET`
  - `REDIS_URL`
  - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- **Production**: Use secret management services (AWS Secrets Manager, etc.)
- **Never**: Hardcode API keys, passwords, or tokens in code

### API Security

- **CORS**: Whitelist allowed origins (no `*` in production)
- **Rate Limiting**: Implement per-IP rate limits (middleware)
- **HTTPS Only**: Enforce HTTPS in production
- **Request Logging**: Log all requests with Winston
- **Sanitization**: Sanitize user inputs before storage
- **Content Security Policy**: Set appropriate headers in Nginx

## Performance Guidelines

### Backend Optimization

- **Database Indexing**: Index foreign keys, frequently queried fields
- **Query Optimization**: Use Prisma `select` to fetch only needed fields
- **Caching Strategy**:
  - Cache product lists (Redis, 5min TTL)
  - Cache reviews (Redis, 10min TTL)
  - Invalidate cache on updates
- **Connection Pooling**: Prisma handles connection pooling
- **Image Optimization**: Resize/compress images with Sharp before upload
- **Pagination**: Implement cursor-based pagination for large datasets

### Frontend Optimization

- **Code Splitting**: Lazy load routes with `React.lazy()`
- **Image Optimization**: Use WebP format, lazy loading, responsive images
- **Bundle Size**: Monitor with Vite build analyzer
- **Memoization**: Use `useMemo`/`useCallback` for expensive computations
- **TanStack Query**: Leverage caching, stale-while-revalidate
- **Tree Shaking**: Import only needed components from libraries
- **Debouncing**: Debounce search inputs, form validations

### Caching Rules

- **GET Requests**: Cache with Redis (products, reviews)
- **Cache Keys**: Structured as `resource:identifier` (e.g., `products:all`)
- **TTL**: 5-10 minutes for dynamic data
- **Invalidation**: Clear cache on POST/PUT/DELETE operations
- **Client-Side**: TanStack Query handles client cache automatically

## Testing Standards

### Unit Testing

#### Backend

- Test services in isolation (mock repositories)
- Test utilities (JWT, password hashing, image processing)
- Coverage target: 70%+ for services and utilities

#### Frontend

- Test custom hooks with `@testing-library/react-hooks`
- Test utility functions
- Test form validation logic
- Coverage target: 60%+ for hooks and utilities

### Integration Testing

- Test API endpoints with supertest (future)
- Test database operations with test database
- Test authentication flows end-to-end

### Component Testing

- Test UI components with Vitest + Testing Library
- Test user interactions (clicks, form submissions)
- Test conditional rendering
- Avoid testing implementation details

### CI/CD Checks

- **Linting**: ESLint must pass (no errors)
- **Formatting**: Prettier check must pass
- **Type Checking**: TypeScript compilation must succeed
- **Tests**: All tests must pass
- **Build**: Production build must succeed
- **Security Audit**: `npm audit` must show no high/critical vulnerabilities

## Dev → Staging → Production Workflow

### Branch Strategy

- **main**: Production-ready code (protected)
- **develop**: Integration branch for features
- **feature/**: Feature branches (`feature/add-product-filters`)
- **fix/**: Bug fix branches (`fix/cart-calculation`)
- **hotfix/**: Emergency production fixes

### Pull Request Requirements

#### Pre-Commit Workflow

Before committing any changes, follow this workflow:

```bash
# 1. Frontend - Lint and format
cd frontend
npm run lint
npm run format
npm run format:check

# 2. Backend - Format
cd ../backend
npm run format
npm run format:check

# 3. Check git status and diff
cd ..
git status
git diff

# 4. Based on diff, create appropriate branch
# For new features:
git checkout -b feature/descriptive-name
# For bug fixes:
git checkout -b fix/descriptive-name
# For hotfixes:
git checkout -b hotfix/descriptive-name

# 5. Stage and commit changes
git add .
git commit -m "type: clear and descriptive commit message"
# Examples:
# "feat: add product filtering by category"
# "fix: resolve cart calculation error"
# "chore: update dependencies"

# 6. Push to origin
git push origin <branch-name>

# 7. Create PR description file
# Create pr-description.md with:
# - Summary of changes
# - Related issue numbers
# - Testing performed
# - Screenshots (if UI changes)

# 8. Create PR using GitHub CLI
gh pr create --title "Title" --body-file pr-description.md
```

#### PR Checklist

1. **Pre-commit Hooks**: Run and pass all linting/formatting in both frontend and backend
2. **Code Review**: At least 1 approval required
3. **CI Checks**: All GitHub Actions must pass
4. **No Merge Conflicts**: Rebase on target branch
5. **Description**: Clear description of changes in pr-description.md
6. **Testing**: Evidence of testing (screenshots, test results)
7. **Documentation**: Update README/docs if needed

### Deployment Expectations

#### Development

- Auto-deploy to dev environment on push to `develop`
- Use `.env.example` as template
- Docker Compose for local development

#### Staging

- Deploy from `develop` branch
- Run full test suite
- Manual QA testing
- Performance testing

#### Production

- Deploy from `main` branch only
- Require manual approval
- Zero-downtime deployment (blue-green or rolling)
- Database migrations run before deployment
- Rollback plan ready
- Monitor logs and metrics post-deployment

### Environment Variables

- **Development**: `.env` (local, not committed)
- **Staging**: Set in CI/CD secrets
- **Production**: Set in CI/CD secrets or secret manager
- **Never**: Commit `.env` files to Git

## AI Agent Rules

### Code Generation Principles

1. **Production-Ready Code**: Always generate code ready for production use
2. **Type Safety**: Use TypeScript types/interfaces for all frontend code
3. **Error Handling**: Include try-catch blocks and error responses
4. **Security First**: Never introduce vulnerabilities (XSS, SQL injection, secrets)
5. **Clean Architecture**: Follow the layered architecture pattern
6. **DRY Code**: Extract reusable logic into utilities/hooks
7. **Consistent Style**: Match existing code style and conventions
8. **Scalability**: Write code that scales (pagination, caching, indexing)

### Prohibited Patterns

- ❌ Hardcoded secrets or API keys
- ❌ SQL queries (use Prisma ORM)
- ❌ `dangerouslySetInnerHTML` in React
- ❌ `any` type in TypeScript (use proper types)
- ❌ Synchronous blocking operations in Node.js
- ❌ Direct database access from controllers (use services)
- ❌ Unvalidated user inputs
- ❌ Missing error handling in async functions

### Required Patterns

- ✅ Environment variables for configuration
- ✅ Prisma for database operations
- ✅ JWT for authentication
- ✅ Winston for logging
- ✅ Zod for validation
- ✅ TanStack Query for data fetching
- ✅ Middleware for cross-cutting concerns
- ✅ Repository pattern for data access

### Architectural Decisions

When making significant changes, explain:

1. **Why**: Rationale for the approach
2. **Trade-offs**: What alternatives were considered
3. **Impact**: How it affects performance, security, maintainability
4. **Migration**: If breaking changes, provide migration path

Example:

```
// Decision: Using Redis for caching product lists
// Why: Reduce database load, improve response times
// Trade-off: Adds complexity, requires cache invalidation logic
// Impact: 80% reduction in database queries for product listings
// Migration: Install Redis, update docker-compose.yml
```

### Code Review Checklist

Before submitting code, verify:

- [ ] Follows project structure and naming conventions
- [ ] Includes proper error handling
- [ ] No security vulnerabilities introduced
- [ ] No hardcoded secrets
- [ ] TypeScript types defined (frontend)
- [ ] Logging added for important operations
- [ ] Cache invalidation implemented (if applicable)
- [ ] Database indexes added (if new queries)
- [ ] API responses follow consistent format
- [ ] User-facing errors are friendly
- [ ] Code is self-documenting (minimal comments needed)

## Documentation Standards

### Inline Comments

- **When to Comment**: Complex business logic, non-obvious algorithms, workarounds
- **When NOT to Comment**: Self-explanatory code, obvious operations
- **Style**: Explain "why", not "what"

```javascript
// Good
// Using bcrypt rounds=12 for OWASP compliance
const hashedPassword = await bcrypt.hash(password, 12);

// Bad
// Hash the password
const hashedPassword = await bcrypt.hash(password, 12);
```

### Function Documentation

- **Public APIs**: Document parameters, return values, errors
- **Complex Functions**: Add JSDoc comments

```javascript
/**
 * Creates a new product with image upload
 * @param {Object} productData - Product details
 * @param {File} imageFile - Product image
 * @returns {Promise<Product>} Created product
 * @throws {ValidationError} If product data is invalid
 */
async function createProduct(productData, imageFile) { ... }
```

### README Updates

Update README.md when:

- Adding new environment variables
- Changing setup instructions
- Adding new scripts or commands
- Modifying deployment process
- Adding new dependencies with setup requirements

### API Documentation

- Document all API endpoints (consider Swagger/OpenAPI in future)
- Include request/response examples
- Document authentication requirements
- List possible error responses

---

## Frontend Implementation Guidelines (Production-Grade)

### Role Context

You are acting as a **Senior Front-End Engineer** implementing features in a production-grade, scalable, maintainable, and DRY manner.

You must **strictly follow** the existing codebase architecture, conventions, and patterns. No deviations, shortcuts, or architectural experiments are allowed.

### 1. Architecture & Layering (Strict Enforcement)

Maintain a clear separation of concerns across all front-end layers.

#### UI / Presentation Layer (Components)

- Components must be **pure and declarative**
- Responsible **only** for rendering UI and handling user interactions
- **No business logic**, data shaping, or side effects
- **No API calls** directly inside components (except via existing abstractions/hooks)

#### State / Domain Layer (Hooks, Stores, View Models)

- Contains **all business logic**, state orchestration, and transformations
- Acts as the **single source of truth** for domain rules
- Coordinates:
  - API clients
  - State stores
  - Derived/computed data
- Components consume this layer, **never re-implement logic**

#### Data Access Layer (API / Services)

- Handles all:
  - API requests
  - Serialization/deserialization
  - Network error propagation
- **No UI logic**
- **No state management**
- Returns clean, domain-friendly data structures

### 2. Constraints (Non-Negotiable)

- Follow the existing folder structure and naming conventions **exactly**
- **Do not introduce**:
  - New architectural patterns
  - New state management approaches
  - New abstractions unless already present
- **Do not refactor** unrelated files or logic
- Use existing hooks, utilities, and services wherever applicable

### 3. Code Quality Standards

#### Single Responsibility Principle (SRP)

Each component, hook, function, and module must have **one clear responsibility**:

- No "smart components" doing multiple jobs
- No mixed UI + business logic

#### DRY Principle (Strict)

**Zero duplication** across:

- Components
- Hooks
- Services

**Reuse**:

- Existing hooks
- Existing shared utilities
- Existing base components

If logic already exists → **use it**. Copy-paste logic is **strictly forbidden**.

#### Readability & Maintainability

- Code must be **self-documenting**
- Clear, expressive naming (no abbreviations or vague names)
- Keep implementations:
  - Simple
  - Predictable
  - Easy to reason about
- **Remove**:
  - Dead code
  - Commented-out code
  - Unused imports or variables
- Match existing linting, formatting, and style rules

### 4. Testability & Modularity

- Code must be **unit-test friendly**
- Avoid tightly coupling logic to:
  - UI frameworks
  - Browser APIs
  - Global state
- **Prefer**:
  - Pure functions
  - Dependency injection via hooks/services
- Side effects must be **isolated and predictable**

### 5. Reusability

- **Centralize** reusable logic
- Do not scatter domain logic across components
- Do not introduce new helpers if an existing one can be reused
- Ensure shared logic lives in the appropriate existing layer

### 6. Performance & Production Readiness

**Optimize for**:

- Render performance
- State updates
- Network efficiency

**No**:

- Console logs
- Debug code
- Temporary workarounds

**Avoid**:

- Inline functions where unnecessary
- Unmemoized expensive computations

**No magic values**:

- Use existing constants or configuration

### 7. Error Handling

- Use **only existing** error handling mechanisms
- **Do not introduce**:
  - New error formats
  - Custom error flows
- Errors must:
  - Propagate correctly
  - Be handled at the appropriate layer
- UI should only **react to error state**, not define it

### 8. Implementation Process (Mandatory)

#### Step 1: Review & Plan (Required)

Before writing any code, provide a **detailed implementation plan** including:

1. **Files to be created** (if any)
2. **Existing files to be modified** (exact sections)
3. **New components/hooks/services** and their responsibilities
4. **Data flow** between:
   - Components
   - Hooks / state
   - API services
5. **Performance and scalability** considerations
6. **How SRP and DRY are enforced**

#### Step 2: Await Approval

- **Do not write any code**
- Wait for **explicit approval** of the plan

#### Step 3: Implement

- Implement **exactly as approved**
- No scope creep
- No deviations

### ✅ Final Acceptance Checklist

- ✓ Clear UI → State → Data layering
- ✓ No duplicated logic
- ✓ SRP enforced everywhere
- ✓ Fully testable and modular
- ✓ Existing utilities reused
- ✓ No new architectural patterns
- ✓ Production-ready and scalable
- ✓ Clean, readable, consistent code
- ✓ No debug, dead, or temporary code

---

## Backend Implementation Guidelines (Production-Grade)

### Project Context

**Stack**: Node.js · Express · Prisma ORM · PostgreSQL  
**Goal**: Production-ready backend following strict layered architecture, clean code standards, and enterprise engineering principles.

### Codebase Conventions (Read First)

All implementation must conform to these existing patterns **without exception**.

```javascript
// ES Modules — always
import express from "express";
export default router;

// Logger — only logging utility allowed
import logger from "../utils/logger.js";
logger.info("message", { metadata });
logger.error("message", { error });

// Config — never hardcode values
import config from "../config/index.js";

// Prisma — one shared client instance
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Middleware signature
export const middleware = (req, res, next) => {
  next();
};
```

### Architecture: Layered Responsibilities

Each layer has **exactly one job**. Violations of layer boundaries are bugs, not style choices.

#### Layer Map

| Layer            | Location            | Owns                                                      | Never Touches                 |
| ---------------- | ------------------- | --------------------------------------------------------- | ----------------------------- |
| **Routes**       | `src/routes/`       | Endpoint + method definition, middleware binding          | Logic, validation, DB         |
| **Controllers**  | `src/controllers/`  | Request extraction, response formatting, error forwarding | Business logic, DB queries    |
| **Services**     | `src/services/`     | Business rules, validation, orchestration                 | HTTP objects, DB directly     |
| **Repositories** | `src/repositories/` | Prisma queries only                                       | Business logic, orchestration |
| **Middleware**   | `src/middleware/`   | Single cross-cutting concern per file                     | State, business logic         |
| **Utils**        | `src/utils/`        | Pure functions, no side effects                           | HTTP, DB, services            |
| **Config**       | `src/config/`       | All env vars and settings                                 | Hardcoded values              |

#### Canonical Examples

```javascript
// routes/product.routes.js — endpoint definition only
router.post("/products", authenticate, productController.create);

// controllers/product.controller.js — HTTP lifecycle only
export const create = async (req, res, next) => {
  try {
    const result = await productService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// services/product.service.js — business logic only
export const create = async (data) => {
  validateProduct(data); // throws on invalid input
  return productRepository.create(data);
};

// repositories/product.repository.js — data access only
export const create = async (data) => {
  return prisma.product.create({ data });
};
```

#### ❌ Anti-Patterns (Never Do This)

```javascript
// BAD — business logic in controller
export const create = async (req, res, next) => {
  if (!req.body.name) throw new Error('Name required'); // ← belongs in service
  const exists = await prisma.product.findFirst(...);   // ← belongs in repository
  res.status(201).json(result);
};

// BAD — DB query in service
export const create = async (data) => {
  return prisma.product.create({ data }); // ← belongs in repository
};

// BAD — console.log anywhere
console.log('debug:', data); // ← use logger.info/logger.error only

// BAD — hardcoded config
const port = 3000; // ← use config.port
```

### Error Handling

Services throw. Controllers catch and forward. The global error handler resolves.

```javascript
// Standard error shape (all endpoints must conform)
{
  "success": false,
  "message": "Human-readable description",
  "code": "MACHINE_READABLE_CODE"  // e.g. PRODUCT_NOT_FOUND
}

// Service — throw with context
if (!product) {
  logger.warn('Product not found', { id });
  throw Object.assign(new Error('Product not found'), {
    statusCode: 404,
    code: 'PRODUCT_NOT_FOUND'
  });
}

// Controller — forward only
} catch (error) {
  next(error); // never res.json() an error here
}

// Global error middleware — single resolution point
export const errorHandler = (err, req, res, next) => {
  logger.error('Request failed', { error: err, path: req.path });
  res.status(err.statusCode ?? 500).json({
    success: false,
    message: err.message ?? 'Internal server error',
    code: err.code ?? 'INTERNAL_ERROR'
  });
};
```

**Rules**:

- No try/catch in repositories — let errors propagate
- No custom error classes unless one already exists in the codebase

### Testing Requirements

Code must be **unit-testable** without Express or a real database.

```javascript
// Services must accept injected dependencies
export const createProductService = ({ productRepository }) => ({
  create: async (data) => {
    validateProduct(data);
    return productRepository.create(data);
  },
});

// This makes mocking trivial
const service = createProductService({ productRepository: mockRepo });
```

Each feature must support:

- Unit tests on services with mocked repositories
- Controller tests with mocked services
- Integration tests on routes

### Implementation Workflow

#### Step 1 — Plan (Required Before Any Code)

Submit a plan covering **all** of the following. No partial plans accepted.

**Files**

- New files with full paths
- Existing files to modify and why

**API Specification**

- Endpoint paths, HTTP methods
- Request body
- Success response
- Error responses

**Data Flow**

- Route → Controller → Service → Repository → DB (one line per hop)

**Database Changes**

- Prisma model additions/modifications
- Relations and index considerations

**Validation Strategy**

- What is validated, where, and what error is thrown on failure

**Logging Strategy**

- What events are logged, at what level (info, warn, error), and with what metadata

**Performance Considerations**

- Query optimization approach
- Any pagination, filtering, or caching patterns needed

#### Step 2 — Approval

**Do not write a single line of implementation code** until the plan is explicitly approved.

#### Step 3 — Implementation

Follow the approved plan **exactly**. Any deviation requires a plan amendment, not a silent change.

### Final Checklist

Before submitting any implementation, verify **every item**:

- ☑ Each layer touches only what its responsibility allows
- ☑ No console.log — only logger.info / logger.warn / logger.error
- ☑ No hardcoded values — all through config
- ☑ Error shape matches the standard above on every endpoint
- ☑ All Prisma queries live in repositories only
- ☑ Services are injectable / mockable
- ☑ No dead code, unused imports, or debug artifacts
- ☑ ES module syntax throughout
- ☑ DRY — no logic duplicated across files
- ☑ No new architectural patterns introduced without prior discussion

---

**Last Updated**: 2025-02-23  
**Project Version**: 1.0.0  
**Maintainers**: Development Team
