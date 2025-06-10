#!/bin/bash

# Create deployment package for Ubuntu 22 VM
echo "🚀 Creating LeafyHealth deployment package..."

# Create temporary directory for clean package
mkdir -p /tmp/leafyhealth-deploy

# Copy essential application files
cp -r backend /tmp/leafyhealth-deploy/
cp -r frontend /tmp/leafyhealth-deploy/
cp -r server /tmp/leafyhealth-deploy/
cp -r shared /tmp/leafyhealth-deploy/

# Copy configuration files
cp package.json /tmp/leafyhealth-deploy/
cp package-lock.json /tmp/leafyhealth-deploy/
cp turbo.json /tmp/leafyhealth-deploy/
cp complete-platform-starter.js /tmp/leafyhealth-deploy/
cp drizzle.config.js /tmp/leafyhealth-deploy/

# Copy environment template
cp .env.production /tmp/leafyhealth-deploy/.env.production.template

# Create ecosystem.config.js for PM2
cat > /tmp/leafyhealth-deploy/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'leafyhealth-platform',
      script: 'complete-platform-starter.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/platform-error.log',
      out_file: './logs/platform-out.log',
      log_file: './logs/platform-combined.log',
      time: true
    },
    {
      name: 'data-gateway',
      script: 'server/direct-data-gateway.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8081
      }
    },
    {
      name: 'domain-generator',
      script: 'server/domain-generator-api.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8082
      }
    },
    {
      name: 'multi-language-service',
      script: 'backend/domains/multi-language-management/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3050
      }
    },
    {
      name: 'reporting-service',
      script: 'backend/domains/reporting-management/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3065
      }
    }
  ]
};
EOF

# Create deployment README
cat > /tmp/leafyhealth-deploy/DEPLOY-README.md << 'EOF'
# LeafyHealth Ubuntu 22 Deployment

## Quick Start:
1. Extract files to /opt/leafyhealth/app/
2. Run: npm install --production
3. Run: cd frontend && npm install --production && npm run build && cd ..
4. Configure .env.production with your database URL
5. Run: pm2 start ecosystem.config.js

## Access URLs:
- API Gateway: http://localhost:8080
- Data Gateway: http://localhost:8081
- Domain Generator: http://localhost:8082
- Multi-language Service: http://localhost:3050
- Reporting Service: http://localhost:3065

## Frontend Apps (after build):
- Ecommerce Web: Build served by API Gateway
- Admin Portal: Build served by API Gateway
- Super Admin: Build served by API Gateway
- Operations Dashboard: Build served by API Gateway
- Mobile Commerce: Build served by API Gateway
EOF

# Remove node_modules and build files to reduce size
find /tmp/leafyhealth-deploy -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find /tmp/leafyhealth-deploy -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find /tmp/leafyhealth-deploy -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true

# Create tarball
cd /tmp
tar -czf leafyhealth-deploy.tar.gz leafyhealth-deploy/

echo "✅ Deployment package created: /tmp/leafyhealth-deploy.tar.gz"
echo "📦 Package size: $(du -sh /tmp/leafyhealth-deploy.tar.gz | cut -f1)"
echo ""
echo "📋 Transfer to Ubuntu VM using:"
echo "scp /tmp/leafyhealth-deploy.tar.gz username@your-vm-ip:/opt/leafyhealth/"
echo ""
echo "📋 Then on Ubuntu VM:"
echo "cd /opt/leafyhealth"
echo "tar -xzf leafyhealth-deploy.tar.gz"
echo "mv leafyhealth-deploy/* app/"
echo "cd app && npm install --production"