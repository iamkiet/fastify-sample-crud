# Fastify Production API

A production-ready Fastify API built with TypeScript, PostgreSQL, Zod validation, and Pino logging.

## Features

- 🚀 **Fastify** - Fast and low overhead web framework
- 🔷 **TypeScript** - Full type safety with path mapping
- 🗄️ **PostgreSQL** - Robust database with connection pooling
- ✅ **Zod** - Schema validation with type inference
- 📝 **Pino** - High-performance logging
- 🔐 **JWT Authentication** - Secure authentication system
- 🐳 **Docker** - Containerized development and production
- 🧪 **Jest** - Comprehensive testing setup
- 📚 **Swagger** - API documentation
- 🛡️ **Security** - Rate limiting, CORS, helmet

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Docker (optional)

### Random JWT_SECRET
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"x

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository>
cd fastify-production-app
npm install