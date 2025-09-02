# Fastify Monorepo

A Fastify API monorepo built with Turborepo and pnpm.

## Structure

```
├── apps/
│   └── api/                 # Fastify API application
├── packages/
│   └── shared/              # Shared types and utilities
├── package.json             # Root package.json
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── tsconfig.json           # Root TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL (or Docker for database)

### Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start database (choose one option)
# Option A: Docker database (recommended)
cd apps/api && docker compose -f docker-compose.db-only.yml up -d

# Option B: Local PostgreSQL
# psql -U postgres -c "CREATE DATABASE postgres_db;"

# 3. Run migrations
pnpm migration:run --filter=api

# 4. Start API server
pnpm dev --filter=api

# 5. Test the API
curl http://localhost:3000/health
```

### Full Development Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development server
pnpm dev

# Run tests
pnpm test

# Run linting
pnpm lint
```

## Available Scripts

- `pnpm dev` - Start development servers for all apps
- `pnpm build` - Build all packages and apps
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Run linting for all packages
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts

### API-Specific Commands

- `pnpm dev --filter=api` - Start API in development
- `pnpm build --filter=api` - Build API
- `pnpm test --filter=api` - Run tests for API
- `pnpm migration:run --filter=api` - Run database migrations
- `pnpm seed --filter=api` - Seed database with sample data

## API App

The API app is located in `apps/api/` and includes:

- Fastify server with TypeScript
- TypeORM with PostgreSQL
- JWT authentication
- Swagger documentation
- Database migrations
- Comprehensive testing

### API Scripts

```bash
# Run API-specific commands
pnpm migration:run --filter=api
pnpm migration:generate --filter=api
pnpm seed --filter=api
```

## Database Setup

### Option 1: Docker Database (Recommended)

```bash
# Start PostgreSQL with Docker
cd apps/api
docker compose -f docker-compose.db-only.yml up -d

# Run migrations
pnpm migration:run --filter=api

# Start API server
pnpm dev --filter=api
```

### Option 2: Local PostgreSQL

```bash
# Create database locally
psql -U postgres -c "CREATE DATABASE postgres_db;"

# Run migrations
pnpm migration:run --filter=api

# Start API server
pnpm dev --filter=api
```

## Shared Package

The shared package (`packages/shared/`) contains:

- Common TypeScript types
- Shared interfaces
- Utility functions

## Development

### Adding a New Package

```bash
# Create a new package
mkdir packages/new-package
cd packages/new-package
pnpm init

# Add to workspace
echo '"packages/new-package"' >> pnpm-workspace.yaml
```

### Adding a New App

```bash
# Create a new app
mkdir apps/new-app
cd apps/new-app
pnpm init

# Add to workspace
echo '"apps/new-app"' >> pnpm-workspace.yaml
```

## Docker

### Database Only (Recommended for Development)

```bash
# Start PostgreSQL database only
cd apps/api
docker compose -f docker-compose.db-only.yml up -d
```

### Full Application (Advanced)

```bash
# Build and run with Docker (requires monorepo setup)
cd apps/api
docker compose up -d
```

**Note**: The full Docker setup requires the monorepo structure and may need additional configuration for production use.

## License

MIT
