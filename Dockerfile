# Use Node.js 20 LTS (Alpine for smaller image size)
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY frontend/pnpm-workspace.yaml ./frontend/
COPY turbo.json ./

# Copy workspace packages
COPY frontend/apps/*/package*.json ./frontend/apps/*/
COPY frontend/packages/*/package*.json ./frontend/packages/*/

RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build all frontend applications
RUN cd frontend && npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built applications
COPY --from=builder /app/frontend/apps/*/public ./frontend/apps/*/public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/*/.next/standalone ./frontend/apps/*/.next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/*/.next/static ./frontend/apps/*/.next/static

# Copy backend files
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/*.js ./
COPY --from=builder /app/*.json ./
COPY --from=builder /app/.env* ./

USER nextjs

EXPOSE 3000
EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Start the complete platform
CMD ["node", "complete-platform-starter.js"]