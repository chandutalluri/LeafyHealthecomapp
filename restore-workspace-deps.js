#!/usr/bin/env node

/**
 * Restore Workspace Dependencies
 * Restores workspace:* dependencies after Docker build for development use
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Restoring workspace dependencies for development...');

// Define workspace dependencies to restore
const workspaceReplacements = {
  '@leafyhealth/ui-kit': 'workspace:*',
  '@leafyhealth/api-client': 'workspace:*', 
  '@leafyhealth/auth': 'workspace:*',
  '@leafyhealth/config': 'workspace:*',
  '@leafyhealth/utils': 'workspace:*'
};

// Apps to restore
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
    
    // Restore workspace dependencies
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }
    
    for (const [dep, version] of Object.entries(workspaceReplacements)) {
      packageJson.dependencies[dep] = version;
      modified = true;
      console.log(`  ✅ Restored workspace dependency ${dep} to ${app}`);
    }
    
    if (modified) {
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log(`  📝 Updated ${packagePath}`);
    }
  }
}

console.log('✅ Workspace dependencies restored for development');