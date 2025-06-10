# Coolify-Ready Production Dockerfile
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache libc6-compat curl dumb-init

WORKDIR /app

# Copy and install root dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy application files
COPY . .

# Build each frontend app individually to avoid workspace conflicts
RUN cd frontend/apps/super-admin && npm install && npm run build
RUN cd frontend/apps/admin-portal && npm install && npm run build  
RUN cd frontend/apps/ecommerce-web && npm install && npm run build
RUN cd frontend/apps/ecommerce-mobile && npm install && npm run build
RUN cd frontend/apps/ops-delivery && npm install && npm run build

# Expose all required ports
EXPOSE 8080 3000 3001 3002 3003 3004

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs --ingroup nodejs

# Set production environment
ENV NODE_ENV=production \
    PORT=8080 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS="--max_old_space_size=1024"

# Set ownership and switch user
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "complete-platform-starter.js"]