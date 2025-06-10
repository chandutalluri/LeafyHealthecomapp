# Coolify Deployment Guide - LeafyHealth Platform

## Workspace Configuration Fixed ✅

The EDUPLICATEWORKSPACE error has been resolved by restructuring the Docker build process to avoid workspace conflicts.

### Changes Made:

1. **Docker Build Strategy**: Individual app builds instead of workspace-based builds
2. **Environment Detection**: Production vs Development mode detection
3. **Process Management**: Proper frontend app spawning in production

## Deployment Configuration

### Environment Variables Required:
```bash
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secure-jwt-secret-key
NODE_ENV=production
```

### Port Configuration:
- **API Gateway**: 8080 (main entry point)
- **Super Admin**: 3003
- **Admin Portal**: 3002  
- **E-commerce Web**: 3000
- **Mobile Commerce**: 3001
- **Operations Dashboard**: 3004

## Deployment Steps

1. **Set Environment Variables in Coolify**:
   - Navigate to your application settings
   - Add the required environment variables listed above
   - Ensure DATABASE_URL points to your PostgreSQL instance

2. **Deploy Configuration**:
   - Repository: Your Git repository
   - Build Pack: Docker
   - Port: 8080
   - Health Check: `/health` endpoint

3. **Build Process**:
   - Root dependencies installation
   - Individual frontend app builds (avoids workspace conflicts)
   - All apps compiled to production builds
   - Platform starter configured for production mode

## Production Behavior

When deployed to Coolify:
- Platform detects `NODE_ENV=production` without `REPLIT_ENVIRONMENT`
- Spawns actual Next.js production servers for each frontend app
- API Gateway routes requests to appropriate frontend/backend services  
- All microservices accessible through unified port 8080

## Health Monitoring

The platform includes comprehensive health monitoring:
- Database connection checks
- Service availability monitoring
- Automatic failover handling
- Performance metrics collection

## Troubleshooting

### Build Failures:
- Ensure all environment variables are set
- Check Docker build logs for specific errors
- Verify PostgreSQL connection is accessible

### Runtime Issues:
- Check application logs for startup errors
- Verify all required ports are properly exposed
- Confirm database migrations completed successfully

## Success Indicators

Deployment is successful when:
- API Gateway responds on port 8080
- All 5 frontend applications are accessible
- Database connectivity is established
- Health checks pass consistently

The platform is now ready for Coolify deployment with the workspace configuration issues resolved.