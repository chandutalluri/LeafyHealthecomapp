#!/bin/bash

# LeafyHealth Platform Startup Script for Coolify
echo "🚀 Starting LeafyHealth Platform"

# Set default environment variables if not provided
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-8080}
export NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED:-1}

# Log environment for debugging
echo "Environment: NODE_ENV=$NODE_ENV, PORT=$PORT"

# Start the platform
exec node complete-platform-starter.js