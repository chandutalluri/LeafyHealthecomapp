#!/usr/bin/env node

/**
 * Final Deployment Validation - LeafyHealth Platform
 * Validates all components are ready for successful Coolify deployment
 */

const fs = require('fs');
const path = require('path');

class DeploymentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  validateWorkspaceConfiguration() {
    console.log('🔍 Validating workspace configuration...');
    
    // Check workspace package.json exists
    if (!fs.existsSync('package-workspace.json')) {
      this.errors.push('Missing package-workspace.json for Docker build');
      return;
    }

    const workspaceConfig = JSON.parse(fs.readFileSync('package-workspace.json', 'utf8'));
    
    // Validate workspace declarations
    if (!workspaceConfig.workspaces || !Array.isArray(workspaceConfig.workspaces)) {
      this.errors.push('Workspace configuration missing workspaces array');
      return;
    }

    if (!workspaceConfig.workspaces.includes('frontend/packages/*') || 
        !workspaceConfig.workspaces.includes('frontend/apps/*')) {
      this.errors.push('Workspace configuration missing required paths');
      return;
    }

    this.success.push('Workspace configuration valid');
  }

  validateDockerfile() {
    console.log('🐳 Validating Dockerfile...');
    
    if (!fs.existsSync('Dockerfile')) {
      this.errors.push('Missing Dockerfile');
      return;
    }

    const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
    
    // Check for workspace-enabled build process
    if (!dockerfile.includes('package-workspace.json')) {
      this.errors.push('Dockerfile not using workspace-enabled package.json');
      return;
    }

    if (!dockerfile.includes('--workspaces')) {
      this.errors.push('Dockerfile missing workspace build commands');
      return;
    }

    if (dockerfile.includes('cd frontend/apps/') && dockerfile.includes('npm install')) {
      this.warnings.push('Dockerfile still contains individual app installs (should use workspace build)');
    }

    this.success.push('Dockerfile configured for workspace builds');
  }

  validateFrontendApps() {
    console.log('🎨 Validating frontend applications...');
    
    const requiredApps = [
      'frontend/apps/super-admin',
      'frontend/apps/admin-portal', 
      'frontend/apps/ecommerce-web',
      'frontend/apps/ecommerce-mobile',
      'frontend/apps/ops-delivery'
    ];

    for (const app of requiredApps) {
      if (!fs.existsSync(path.join(app, 'package.json'))) {
        this.errors.push(`Missing package.json for ${app}`);
        continue;
      }

      const packageJson = JSON.parse(fs.readFileSync(path.join(app, 'package.json'), 'utf8'));
      
      // Check for build script
      if (!packageJson.scripts || !packageJson.scripts.build) {
        this.errors.push(`Missing build script in ${app}/package.json`);
        continue;
      }

      // Check for workspace dependencies
      const deps = packageJson.dependencies || {};
      const workspaceDeps = Object.keys(deps).filter(dep => deps[dep].startsWith('workspace:'));
      
      if (workspaceDeps.length === 0) {
        this.warnings.push(`${app} has no workspace dependencies - may be independent`);
      }

      this.success.push(`${app} validated`);
    }
  }

  validatePlatformStarter() {
    console.log('🚀 Validating platform starter...');
    
    if (!fs.existsSync('complete-platform-starter.js')) {
      this.errors.push('Missing complete-platform-starter.js');
      return;
    }

    const starter = fs.readFileSync('complete-platform-starter.js', 'utf8');
    
    // Check for production detection
    if (!starter.includes('NODE_ENV') || !starter.includes('production')) {
      this.warnings.push('Platform starter may not properly detect production environment');
    }

    // Check for port configuration
    if (!starter.includes('8080')) {
      this.errors.push('Platform starter missing port 8080 configuration');
      return;
    }

    this.success.push('Platform starter configured');
  }

  validateEnvironmentFiles() {
    console.log('🔧 Validating environment configuration...');
    
    const envFiles = ['.env', '.env.production', 'production.env'];
    let hasEnvConfig = false;

    for (const file of envFiles) {
      if (fs.existsSync(file)) {
        hasEnvConfig = true;
        this.success.push(`Environment file ${file} present`);
      }
    }

    if (!hasEnvConfig) {
      this.warnings.push('No environment configuration files found');
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 DEPLOYMENT VALIDATION REPORT');
    console.log('='.repeat(60));

    if (this.success.length > 0) {
      console.log('\n✅ SUCCESS:');
      this.success.forEach(item => console.log(`  ✓ ${item}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(item => console.log(`  ⚠ ${item}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(item => console.log(`  ✗ ${item}`));
      console.log('\n🚫 DEPLOYMENT NOT READY - Fix errors before deploying');
      return false;
    }

    console.log('\n🎉 DEPLOYMENT READY');
    console.log('📋 Next Steps:');
    console.log('  1. Push to your Git repository');
    console.log('  2. Configure Coolify with Docker build pack');
    console.log('  3. Set environment variables in Coolify');
    console.log('  4. Deploy on port 8080');
    console.log('  5. Verify health check at /health');
    
    return true;
  }

  async validate() {
    console.log('🔍 Starting final deployment validation...\n');
    
    this.validateWorkspaceConfiguration();
    this.validateDockerfile();
    this.validateFrontendApps();
    this.validatePlatformStarter();
    this.validateEnvironmentFiles();
    
    return this.generateReport();
  }
}

// Run validation
const validator = new DeploymentValidator();
validator.validate().then(isReady => {
  process.exit(isReady ? 0 : 1);
});