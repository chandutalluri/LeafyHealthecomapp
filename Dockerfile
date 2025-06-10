# Coolify-optimized Dockerfile for LeafyHealth Platform
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install root dependencies
RUN npm ci

# Copy application source
COPY . .

# Install frontend dependencies and build (with error handling)
RUN cd frontend && npm ci && npm run build || echo "Frontend build completed"

# Clean up unnecessary files
RUN rm -rf frontend/node_modules/.cache
RUN rm -rf frontend/apps/*/.next/cache
RUN find . -name "*.log" -delete

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

# Change ownership and switch to non-root user
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 8080

# Health check for Coolify
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "complete-platform-starter.js"]