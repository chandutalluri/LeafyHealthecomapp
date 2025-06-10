#!/bin/bash

# Create production deployment package without workspace dependencies
echo "Creating production-ready LeafyHealth deployment..."

# Create deployment directory
mkdir -p /tmp/leafyhealth-production

# Copy backend services
cp -r backend /tmp/leafyhealth-production/
cp -r server /tmp/leafyhealth-production/
cp -r shared /tmp/leafyhealth-production/

# Copy root configuration files
cp package.json /tmp/leafyhealth-production/
cp package-lock.json /tmp/leafyhealth-production/
cp turbo.json /tmp/leafyhealth-production/
cp complete-platform-starter.js /tmp/leafyhealth-production/
cp drizzle.config.js /tmp/leafyhealth-production/

# Create simplified frontend structure
mkdir -p /tmp/leafyhealth-production/frontend/apps

# Copy each frontend app individually
for app in ecommerce-web ecommerce-mobile admin-portal super-admin ops-delivery; do
  cp -r frontend/apps/$app /tmp/leafyhealth-production/frontend/apps/
done

# Create production-ready frontend package.json
cat > /tmp/leafyhealth-production/frontend/package.json << 'EOF'
{
  "name": "@leafyhealth/frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "npm run build:apps",
    "build:apps": "cd apps/ecommerce-web && npm run build && cd ../ecommerce-mobile && npm run build && cd ../admin-portal && npm run build && cd ../super-admin && npm run build && cd ../ops-delivery && npm run build",
    "install:all": "cd apps/ecommerce-web && npm install && cd ../ecommerce-mobile && npm install && cd ../admin-portal && npm install && cd ../super-admin && npm install && cd ../ops-delivery && npm install"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0"
  }
}
EOF

# Create environment template
cat > /tmp/leafyhealth-production/.env.production << 'EOF'
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://leafyuser:leafypass123@localhost:5432/leafyhealth
HOSTNAME=0.0.0.0

# Frontend ports
FRONTEND_ECOMMERCE_WEB_PORT=3000
FRONTEND_ECOMMERCE_MOBILE_PORT=3001
FRONTEND_ADMIN_PORTAL_PORT=3002
FRONTEND_SUPER_ADMIN_PORT=3003
FRONTEND_OPS_DELIVERY_PORT=3004

# Backend services
API_GATEWAY_PORT=8080
DATA_GATEWAY_PORT=8081
DOMAIN_GENERATOR_PORT=8082
MULTI_LANGUAGE_PORT=3050
REPORTING_SERVICE_PORT=3065
EOF

# Create PM2 ecosystem configuration
cat > /tmp/leafyhealth-production/ecosystem.config.js << 'EOF'
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
    }
  ]
};
EOF

# Create installation script for Ubuntu
cat > /tmp/leafyhealth-production/install-ubuntu.sh << 'EOF'
#!/bin/bash

echo "Installing LeafyHealth Platform on Ubuntu 22..."

# Install main dependencies
npm install --omit=dev

# Create logs directory
mkdir -p logs

# Install frontend dependencies for each app
cd frontend
echo "Installing frontend dependencies..."
cd apps/ecommerce-web && npm install --omit=dev && cd ..
cd ecommerce-mobile && npm install --omit=dev && cd ..
cd admin-portal && npm install --omit=dev && cd ..
cd super-admin && npm install --omit=dev && cd ..
cd ops-delivery && npm install --omit=dev && cd ..
cd ../..

# Build frontend apps
echo "Building frontend applications..."
cd frontend/apps/ecommerce-web && npm run build && cd ..
cd ecommerce-mobile && npm run build && cd ..
cd admin-portal && npm run build && cd ..
cd super-admin && npm run build && cd ..
cd ops-delivery && npm run build && cd ..
cd ../..

echo "Installation complete!"
echo "Configure .env.production with your database settings"
echo "Then run: pm2 start ecosystem.config.js"
EOF

chmod +x /tmp/leafyhealth-production/install-ubuntu.sh

# Create gitignore
cat > /tmp/leafyhealth-production/.gitignore << 'EOF'
node_modules/
.next/
dist/
build/
out/
logs/
*.log
.env
.env.local
.env.production.local
.DS_Store
.cache/
coverage/
EOF

# Create README
cat > /tmp/leafyhealth-production/README.md << 'EOF'
# LeafyHealth Platform - Ubuntu 22 Production Deployment

## Quick Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/leafyhealth-platform.git
cd leafyhealth-platform

# Run installation script
chmod +x install-ubuntu.sh
./install-ubuntu.sh

# Configure environment
nano .env.production

# Start services
pm2 start ecosystem.config.js
pm2 save
```

## Access Points
- Main Platform: http://localhost:8080
- Data Gateway: http://localhost:8081
- Domain Generator: http://localhost:8082

## Frontend Applications
All frontend apps are built and served through the main platform on port 8080.
EOF

# Initialize git repository
cd /tmp/leafyhealth-production
git init
git add .
git commit -m "Production-ready LeafyHealth Platform for Ubuntu 22"

echo "Production deployment package created at /tmp/leafyhealth-production"
echo "Size: $(du -sh /tmp/leafyhealth-production | cut -f1)"
echo "Files: $(find /tmp/leafyhealth-production -type f | wc -l)"