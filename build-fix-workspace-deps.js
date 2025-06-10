#!/usr/bin/env node

/**
 * Workspace Dependencies Build Fix
 * Completely removes workspace dependencies and cleans lockfiles for Docker builds
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing workspace dependencies for Docker build...');

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
  const lockPath = path.join(app, 'package-lock.json');
  const nodeModulesPath = path.join(app, 'node_modules');
  
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    let modified = false;
    
    // Remove ALL workspace dependencies
    if (packageJson.dependencies) {
      const workspaceDeps = Object.keys(packageJson.dependencies).filter(dep => 
        packageJson.dependencies[dep] === 'workspace:*' || 
        packageJson.dependencies[dep].startsWith('workspace:') ||
        dep.startsWith('@leafyhealth/')
      );
      
      for (const dep of workspaceDeps) {
        delete packageJson.dependencies[dep];
        modified = true;
        console.log(`  ✅ Removed workspace dependency ${dep} from ${app}`);
      }
    }
    
    // Also check devDependencies
    if (packageJson.devDependencies) {
      const workspaceDeps = Object.keys(packageJson.devDependencies).filter(dep => 
        packageJson.devDependencies[dep] === 'workspace:*' || 
        packageJson.devDependencies[dep].startsWith('workspace:') ||
        dep.startsWith('@leafyhealth/')
      );
      
      for (const dep of workspaceDeps) {
        delete packageJson.devDependencies[dep];
        modified = true;
        console.log(`  ✅ Removed workspace devDependency ${dep} from ${app}`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log(`  📝 Updated ${packagePath}`);
    }
    
    // Remove package-lock.json to force fresh install
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
      console.log(`  🗑️  Removed ${lockPath}`);
    }
    
    // Remove node_modules to ensure clean state
    if (fs.existsSync(nodeModulesPath)) {
      fs.rmSync(nodeModulesPath, { recursive: true, force: true });
      console.log(`  🗑️  Removed ${nodeModulesPath}`);
    }
  }
}

console.log('✅ Workspace dependencies completely removed for Docker build');