export interface ServiceStatus {
  name: string
  status: 'running' | 'stopped' | 'error'
  port: number
  category: string
  description: string
  uptime: string
}

export interface SystemMetrics {
  totalMicroservices: number
  runningServices: number
  totalUsers: number
  systemHealth: 'Healthy' | 'Warning' | 'Critical'
  databaseConnections: number
  uptime: string
}

export interface SystemStatusResponse {
  services: ServiceStatus[]
  metrics: SystemMetrics
}

class MicroserviceAPI {
  private baseUrl = 'http://localhost:8080'

  async getSystemStatus(): Promise<SystemStatusResponse> {
    try {
      // Mock data for demo - replace with real API calls
      const services: ServiceStatus[] = [
        {
          name: 'Identity & Access',
          status: 'running',
          port: 3010,
          category: 'security',
          description: 'User authentication and authorization',
          uptime: '2d 14h'
        },
        {
          name: 'User Role Management',
          status: 'running',
          port: 3011,
          category: 'security',
          description: 'Role and permission management',
          uptime: '2d 14h'
        },
        {
          name: 'Catalog Management',
          status: 'running',
          port: 3020,
          category: 'ecommerce',
          description: 'Product catalog and categories',
          uptime: '2d 14h'
        },
        {
          name: 'Inventory Management',
          status: 'running',
          port: 3021,
          category: 'ecommerce',
          description: 'Stock tracking and warehouse operations',
          uptime: '2d 14h'
        },
        {
          name: 'Order Management',
          status: 'running',
          port: 3022,
          category: 'ecommerce',
          description: 'Order processing and fulfillment',
          uptime: '2d 14h'
        },
        {
          name: 'Payment Processing',
          status: 'running',
          port: 3023,
          category: 'finance',
          description: 'Payment gateway and transactions',
          uptime: '2d 14h'
        },
        {
          name: 'Notification Service',
          status: 'running',
          port: 3024,
          category: 'communication',
          description: 'Email, SMS, and push notifications',
          uptime: '2d 14h'
        },
        {
          name: 'Customer Service',
          status: 'running',
          port: 3031,
          category: 'support',
          description: 'Customer support and communication',
          uptime: '2d 14h'
        },
        {
          name: 'Accounting Management',
          status: 'running',
          port: 3032,
          category: 'finance',
          description: 'Financial accounting and bookkeeping',
          uptime: '2d 14h'
        },
        {
          name: 'Analytics & Reporting',
          status: 'running',
          port: 3033,
          category: 'analytics',
          description: 'Business intelligence and data analysis',
          uptime: '2d 14h'
        },
        {
          name: 'Compliance & Audit',
          status: 'running',
          port: 3034,
          category: 'compliance',
          description: 'Regulatory compliance and audit trails',
          uptime: '2d 14h'
        },
        {
          name: 'Content Management',
          status: 'running',
          port: 3035,
          category: 'content',
          description: 'Website content and marketing materials',
          uptime: '2d 14h'
        },
        {
          name: 'Employee Management',
          status: 'running',
          port: 3036,
          category: 'hr',
          description: 'HR management and staff operations',
          uptime: '2d 14h'
        },
        {
          name: 'Expense Monitoring',
          status: 'running',
          port: 3037,
          category: 'finance',
          description: 'Business expense tracking and monitoring',
          uptime: '2d 14h'
        },
        {
          name: 'Integration Hub',
          status: 'running',
          port: 3038,
          category: 'integration',
          description: 'Third-party service integrations',
          uptime: '2d 14h'
        },
        {
          name: 'Label Design',
          status: 'running',
          port: 3039,
          category: 'content',
          description: 'Product labeling and design services',
          uptime: '2d 14h'
        },
        {
          name: 'Marketplace Management',
          status: 'running',
          port: 3040,
          category: 'integration',
          description: 'Multi-vendor marketplace operations',
          uptime: '2d 14h'
        },
        {
          name: 'Performance Monitor',
          status: 'running',
          port: 3041,
          category: 'monitoring',
          description: 'System performance and monitoring',
          uptime: '2d 14h'
        },
        {
          name: 'Shipping & Delivery',
          status: 'running',
          port: 3042,
          category: 'logistics',
          description: 'Logistics and delivery management',
          uptime: '2d 14h'
        },
        {
          name: 'Multi-Language Management',
          status: 'running',
          port: 3050,
          category: 'content',
          description: 'Language localization system',
          uptime: '2d 14h'
        },
        {
          name: 'Reporting Management',
          status: 'running',
          port: 3065,
          category: 'analytics',
          description: 'Advanced business reporting system',
          uptime: '1d 8h'
        }
      ]

      const metrics: SystemMetrics = {
        totalMicroservices: services.length,
        runningServices: services.filter(s => s.status === 'running').length,
        totalUsers: 1847,
        systemHealth: 'Healthy',
        databaseConnections: 21,
        uptime: '2 days, 14 hours'
      }

      return { services, metrics }
    } catch (error) {
      console.error('Error fetching system status:', error)
      // Return minimal data on error
      return {
        services: [],
        metrics: {
          totalMicroservices: 0,
          runningServices: 0,
          totalUsers: 0,
          systemHealth: 'Critical',
          databaseConnections: 0,
          uptime: 'Unknown'
        }
      }
    }
  }
}

export const microserviceAPI = new MicroserviceAPI()