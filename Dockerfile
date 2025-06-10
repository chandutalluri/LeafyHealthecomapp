# Coolify-Ready Production Dockerfile
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache libc6-compat curl dumb-init

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci --production --ignore-scripts && npm cache clean --force

# Copy application files
COPY . .

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

# Make startup script executable
COPY start.sh ./
RUN chmod +x start.sh

ENTRYPOINT ["dumb-init", "--"]
CMD ["./start.sh"]