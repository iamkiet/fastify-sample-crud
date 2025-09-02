FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root package.json and pnpm workspace config
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages

# Copy API app package.json
COPY apps/api/package.json ./apps/api/

FROM base AS development
# Install dependencies using pnpm (without frozen lockfile for development)
RUN pnpm install
# Copy API source code
COPY apps/api ./apps/api/
EXPOSE 3000
WORKDIR /app/apps/api
CMD ["pnpm", "run", "dev"]

FROM base AS builder
# Install dependencies using pnpm
RUN pnpm install
# Copy API source code
COPY apps/api ./apps/api/
WORKDIR /app/apps/api
RUN pnpm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache curl
RUN addgroup -g 1001 -S nodejs \
  && adduser -S fastify -u 1001

# Install pnpm
RUN npm install -g pnpm

# Copy root package.json and pnpm workspace config
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages

# Copy API app package.json
COPY apps/api/package.json ./apps/api/

# Install production dependencies
RUN pnpm install --prod

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist

RUN chown -R fastify:nodejs /app
USER fastify
EXPOSE 3000
WORKDIR /app/apps/api
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["pnpm", "run", "start"]
