# LeafyHealth Platform - Coolify VPS Deployment Guide

## Coolify Application Configuration

### Step 1: Create New Application in Coolify
1. Connect your GitHub repository: `chandutalluri/LeafyHealthecomapp`
2. Branch: `main`
3. Build Pack: **Dockerfile** (recommended) or **Nixpacks**
4. Port: **8080**

### Step 2: Environment Variables
Add these in Coolify's Environment tab:
```
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://username:password@host:port/database
```

### Step 3: Build Configuration
- **Dockerfile**: Uses `./Dockerfile` (single-stage, optimized for Coolify)
- **Nixpacks**: Uses `./nixpacks.toml` (fallback if Docker fails)
- **Start Command**: `node complete-platform-starter.js`

## Application Architecture
- **Entry Point**: `complete-platform-starter.js`
- **Main Port**: 8080 (API Gateway)
- **Health Check**: `GET /health`
- **Frontend**: 5 Next.js applications (built during deployment)
- **Backend**: 19 microservices (started internally)

## Deployment Flow
1. Coolify clones repository
2. Installs Node.js dependencies (`npm ci`)
3. Builds frontend applications (`cd frontend && npm run build`)
4. Starts complete platform on port 8080
5. All 19 microservices start automatically
6. API Gateway proxies requests to appropriate services

## Health Monitoring
- **Health Endpoint**: `http://your-domain/health`
- **Service Status**: `http://your-domain/api/status`
- **Available Routes**: Listed in API Gateway response

## Key Benefits
- Single port (8080) deployment
- Integrated API Gateway
- Automatic microservice startup
- Built-in health checks
- Optimized for VPS resources

## Troubleshooting
- **Build fails**: Check DATABASE_URL environment variable
- **Port issues**: Ensure port 8080 is available
- **Frontend build errors**: Build continues with warnings (non-blocking)
- **Memory issues**: Platform optimized for VPS constraints