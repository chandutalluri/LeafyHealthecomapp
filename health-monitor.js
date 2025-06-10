/**
 * Health Monitoring System for Coolify Deployment
 * Provides comprehensive health checks and system monitoring
 */

const http = require('http');
const { Pool } = require('pg');

class HealthMonitor {
  constructor() {
    this.services = [
      { name: 'identity-access', port: 3010 },
      { name: 'user-role-management', port: 3011 },
      { name: 'catalog-management', port: 3020 },
      { name: 'inventory-management', port: 3021 },
      { name: 'order-management', port: 3022 },
      { name: 'payment-processing', port: 3023 },
      { name: 'notification-service', port: 3024 },
      { name: 'customer-service', port: 3031 },
      { name: 'accounting-management', port: 3032 },
      { name: 'analytics-reporting', port: 3033 },
      { name: 'compliance-audit', port: 3034 },
      { name: 'content-management', port: 3035 },
      { name: 'employee-management', port: 3036 },
      { name: 'expense-monitoring', port: 3037 },
      { name: 'integration-hub', port: 3038 },
      { name: 'label-design', port: 3039 },
      { name: 'marketplace-management', port: 3040 },
      { name: 'performance-monitor', port: 3041 },
      { name: 'shipping-delivery', port: 3042 }
    ];
    
    this.dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  async checkServiceHealth(service) {
    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: service.port,
        path: '/health',
        method: 'GET',
        timeout: 2000
      };

      const req = http.request(options, (res) => {
        resolve({
          name: service.name,
          status: res.statusCode === 200 ? 'healthy' : 'unhealthy',
          port: service.port,
          responseTime: Date.now() - startTime
        });
      });

      const startTime = Date.now();
      req.on('error', () => {
        resolve({
          name: service.name,
          status: 'unreachable',
          port: service.port,
          responseTime: null
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          name: service.name,
          status: 'timeout',
          port: service.port,
          responseTime: null
        });
      });

      req.end();
    });
  }

  async checkDatabaseHealth() {
    try {
      const client = await this.dbPool.connect();
      const startTime = Date.now();
      const result = await client.query('SELECT 1 as health_check');
      const responseTime = Date.now() - startTime;
      client.release();
      
      return {
        status: 'healthy',
        responseTime,
        connected: true
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false
      };
    }
  }

  async getSystemHealth() {
    const serviceChecks = await Promise.all(
      this.services.map(service => this.checkServiceHealth(service))
    );

    const databaseHealth = await this.checkDatabaseHealth();

    const healthyServices = serviceChecks.filter(s => s.status === 'healthy').length;
    const totalServices = serviceChecks.length;

    return {
      timestamp: new Date().toISOString(),
      overall: healthyServices === totalServices && databaseHealth.status === 'healthy' ? 'healthy' : 'degraded',
      services: {
        healthy: healthyServices,
        total: totalServices,
        details: serviceChecks
      },
      database: databaseHealth,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: {
        node: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
  }
}

module.exports = HealthMonitor;