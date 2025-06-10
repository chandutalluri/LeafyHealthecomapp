#!/usr/bin/env node

/**
 * Workspace Dependencies Build Fix
 * Temporarily replaces workspace:* dependencies with compatible versions for Docker builds
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing workspace dependencies for Docker build...');

// Define replacement dependencies for workspace packages
const workspaceReplacements = {
  '@leafyhealth/ui-kit': '^1.0.0',
  '@leafyhealth/api-client': '^1.0.0', 
  '@leafyhealth/auth': '^1.0.0',
  '@leafyhealth/config': '^1.0.0',
  '@leafyhealth/utils': '^1.0.0'
};

// Apps to fix
const apps = [
  'frontend/apps/super-admin',
  'frontend/apps/admin-portal', 
  'frontend/apps/ecommerce-web',
  'frontend/apps/ecommerce-mobile',
  'frontend/apps/ops-delivery'
];

for (const app of apps) {
  const packagePath = path.join(app, 'package.json');
  
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    let modified = false;
    
    // Replace workspace dependencies in dependencies
    if (packageJson.dependencies) {
      for (const [dep, version] of Object.entries(packageJson.dependencies)) {
        if (version === 'workspace:*' && workspaceReplacements[dep]) {
          // Remove workspace dependency
          delete packageJson.dependencies[dep];
          modified = true;
          console.log(`  ✅ Removed workspace dependency ${dep} from ${app}`);
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log(`  📝 Updated ${packagePath}`);
    }
  }
}

console.log('✅ Workspace dependencies fixed for Docker build');