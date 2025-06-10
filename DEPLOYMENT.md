# LeafyHealth Platform - Coolify Deployment Guide

## Quick Setup for Coolify

### Option 1: Use Dockerfile (Recommended)
1. In Coolify, set **Build Pack** to `dockerfile`
2. Set **Dockerfile Location** to `Dockerfile.production`
3. Set **Port** to `8080`

### Option 2: Use Nixpacks (Alternative)
1. In Coolify, set **Build Pack** to `nixpacks`
2. The `nixpacks.toml` will be automatically detected
3. Set **Port** to `8080`

## Environment Variables Required
```
NODE_ENV=production
PORT=8080
DATABASE_URL=your_database_url
```

## Health Check Endpoint
The application provides a health check at: `http://your-domain:8080/health`

## Deployment Architecture
- **Main Server**: Port 8080 (API Gateway)
- **Frontend Apps**: Integrated within the main platform
- **Microservices**: 19 backend services (internal only)
- **Database**: PostgreSQL (external connection required)

## Build Process
1. Install dependencies with `npm ci`
2. Build frontend applications (if workspace configured)
3. Start integrated platform server
4. All services accessible through port 8080

## Troubleshooting
- If Nixpacks fails with Node.js version issues, use Dockerfile option
- Ensure DATABASE_URL is configured in environment variables
- Platform serves all routes through the main gateway on port 8080