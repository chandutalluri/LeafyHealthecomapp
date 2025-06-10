#!/bin/bash

# Production startup script for Ubuntu Coolify deployment
echo "🚀 Starting LeafyHealth Platform for Production..."

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}
export NEXT_TELEMETRY_DISABLED=1

# Memory optimization for VPS
export NODE_OPTIONS="--max_old_space_size=1024"
export UV_THREADPOOL_SIZE=4

# Verify database connection
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is required"
    exit 1
fi

# Start the complete platform
echo "🌐 Starting API Gateway on port $PORT..."
exec node complete-platform-starter.js