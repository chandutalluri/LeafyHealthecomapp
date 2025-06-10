/**
 * Port Configuration for LeafyHealth Microservices
 * Provides standardized port allocation across all services
 */

const SERVICE_PORTS = {
  'identity-access': 3010,
  'user-role-management': 3011,
  'catalog-management': 3020,
  'inventory-management': 3021,
  'order-management': 3022,
  'payment-processing': 3023,
  'notification-service': 3024,
  'customer-service': 3031,
  'accounting-management': 3032,
  'analytics-reporting': 3033,
  'compliance-audit': 3034,
  'content-management': 3035,
  'employee-management': 3036,
  'expense-monitoring': 3037,
  'integration-hub': 3038,
  'label-design': 3039,
  'marketplace-management': 3040,
  'performance-monitor': 3041,
  'shipping-delivery': 3042
};

/**
 * Get port number for a backend service
 * @param {string} serviceName - Name of the service
 * @returns {number} Port number
 */
function getBackendPort(serviceName) {
  const port = SERVICE_PORTS[serviceName] || process.env.SERVICE_PORT;
  if (!port) {
    console.warn(`No port configured for service: ${serviceName}, using default 3000`);
    return 3000;
  }
  return parseInt(port);
}

/**
 * Get all service configurations
 * @returns {Object} All service port mappings
 */
function getAllServices() {
  return SERVICE_PORTS;
}

/**
 * Check if a port is allocated to a service
 * @param {number} port - Port number to check
 * @returns {string|null} Service name or null if not found
 */
function getServiceByPort(port) {
  for (const [serviceName, servicePort] of Object.entries(SERVICE_PORTS)) {
    if (servicePort === port) {
      return serviceName;
    }
  }
  return null;
}

module.exports = {
  getBackendPort,
  getAllServices,
  getServiceByPort,
  SERVICE_PORTS
};