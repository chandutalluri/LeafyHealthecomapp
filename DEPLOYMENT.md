# LeafyHealth Platform - Production Deployment Guide for Ubuntu Coolify

## Pre-Deployment System Optimization Complete

### Application Cleanup Summary
- Removed 750MB+ of build artifacts and cache files
- Deleted unnecessary documentation and development files
- Optimized Docker build context with improved .dockerignore
- Eliminated duplicate deployment configurations
- Enhanced memory management for VPS constraints

## Coolify Deployment Configuration

### Repository Settings
- **Repository**: `chandutalluri/LeafyHealthecomapp`
- **Branch**: `main`
- **Build Pack**: `dockerfile`
- **Dockerfile**: `./Dockerfile` (Ubuntu optimized)
- **Port**: `8080`

### Required Environment Variables
```bash
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://username:password@host:5432/leafyhealth_production
JWT_SECRET=your-secure-jwt-secret-key
API_SECRET=your-secure-api-secret-key
NEXT_TELEMETRY_DISABLED=1
```

### Resource Requirements
- **Memory**: 1GB RAM minimum (optimized for VPS)
- **CPU**: 1 vCPU
- **Storage**: 10GB
- **Network**: Port 8080 (HTTP/HTTPS)

## Production Architecture
- **API Gateway**: Port 8080 (public endpoint)
- **Microservices**: 19 backend services (internal ports 3010-3042)
- **Frontend**: 5 Next.js applications (integrated)
- **Database**: PostgreSQL (external connection)
- **Health Monitoring**: Comprehensive system status tracking

## Deployment Process
1. Coolify clones repository and builds Docker image
2. Installs Node.js 20 and dependencies
3. Builds frontend applications with error handling
4. Starts complete platform with all microservices
5. Enables health monitoring and API gateway routing

## Monitoring Endpoints
- **Health Check**: `GET /health` (Coolify monitoring)
- **System Status**: `GET /api/status` (service overview)
- **Detailed Health**: `GET /metrics` (comprehensive monitoring)

## Security Features
- Non-root container execution
- Signal handling with dumb-init
- Environment variable protection
- CORS configuration
- JWT authentication ready

## Performance Optimizations
- Memory limited to 1GB for VPS compatibility
- Build cache optimization
- Frontend bundle optimization
- Database connection pooling
- Service auto-scaling ready

## Post-Deployment Verification
1. Check health endpoint responds with 200 status
2. Verify all 19 microservices are operational
3. Test API gateway routing functionality
4. Confirm database connectivity
5. Monitor resource utilization

## Production Scaling
- Horizontal scaling ready via container replication
- Load balancer compatible
- Database read replicas supported
- CDN integration available
- Monitoring integration ready