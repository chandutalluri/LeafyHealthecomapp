# Coolify Environment Variables Setup

## Required Environment Variables for Production

### Core Application Settings
```bash
NODE_ENV=production
PORT=8080
NEXT_TELEMETRY_DISABLED=1
```

### Database Configuration
```bash
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

### Security Settings
```bash
JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters_long
API_SECRET=your_secure_api_secret_key_for_internal_services
```

### Optional Performance Settings
```bash
NODE_OPTIONS=--max_old_space_size=1024
UV_THREADPOOL_SIZE=4
```

## Coolify Configuration Steps

1. In Coolify, go to your application settings
2. Navigate to "Environment Variables" section
3. Add each variable individually:
   - Variable Name: `NODE_ENV`
   - Variable Value: `production`
   - Click "Add"

4. Repeat for all required variables above

## Security Notes

- JWT_SECRET must be at least 32 characters long
- Use a cryptographically secure random string for JWT_SECRET
- Never use default or example values in production
- DATABASE_URL should point to your actual PostgreSQL instance

## Quick Test Deployment (Minimal Config)

For initial testing, you only need:
```bash
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://your_db_connection_string
```

The platform will start with limited functionality and show warnings for missing security variables.

## Post-Deployment Verification

After setting environment variables:
1. Redeploy the application in Coolify
2. Check health endpoint: https://yourdomain.com/health
3. Verify no error messages in container logs
4. Test API endpoints: https://yourdomain.com/api/status