import { useState, useEffect } from 'react'
import { microserviceAPI, type ServiceStatus, type SystemMetrics } from '../lib/microserviceApi'

export default function SuperAdminDashboard() {
  const [microservices, setMicroservices] = useState<ServiceStatus[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalMicroservices: 0,
    runningServices: 0,
    totalUsers: 0,
    systemHealth: 'Healthy',
    databaseConnections: 0,
    uptime: '0 days'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        const { services, metrics: systemMetrics } = await microserviceAPI.getSystemStatus()
        setMicroservices(services)
        setMetrics(systemMetrics)
      } catch (error) {
        console.error('Error loading system status:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadSystemStatus()
  }, [])

  const refreshServices = async () => {
    setLoading(true)
    const { services, metrics: systemMetrics } = await microserviceAPI.getSystemStatus()
    setMicroservices(services)
    setMetrics(systemMetrics)
    setLoading(false)
  }

  const categoryColors: Record<string, string> = {
    security: 'bg-red-500',
    ecommerce: 'bg-blue-500', 
    finance: 'bg-green-500',
    communication: 'bg-purple-500',
    support: 'bg-yellow-500',
    analytics: 'bg-indigo-500',
    compliance: 'bg-pink-500',
    content: 'bg-orange-500',
    hr: 'bg-teal-500',
    integration: 'bg-gray-500',
    monitoring: 'bg-cyan-500',
    logistics: 'bg-amber-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">LeafyHealth Super Admin</h1>
                <p className="text-sm text-purple-600">System Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                System Status: <span className="text-green-600 font-medium">Operational</span>
              </div>
              <button 
                onClick={refreshServices}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh
              </button>
              <button 
                onClick={() => window.location.href = '/security'}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Security Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Security Warning */}
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Super Admin Security Notice</h3>
                <p className="text-red-700 text-sm">
                  Only ONE Super Admin should exist in the system. This account has unrestricted access to all functions including user permission management.
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading microservices status...</span>
            </div>
          )}

          {/* Real-Time System Metrics */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                {/* Total Microservices */}
                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 truncate">Total Services</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.totalMicroservices}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-3xl">⚙️</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Running Services */}
                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 truncate">Running</p>
                        <p className="text-2xl font-bold text-green-600">{metrics.runningServices}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-3xl">✅</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 truncate">System Health</p>
                        <p className={`text-2xl font-bold ${
                          metrics.systemHealth === 'Healthy' ? 'text-green-600' : 
                          metrics.systemHealth === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {metrics.systemHealth}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-3xl">💚</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Users */}
                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 truncate">Active Users</p>
                        <p className="text-2xl font-bold text-blue-600">{metrics.totalUsers.toLocaleString()}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-3xl">👥</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database Connections */}
                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 truncate">DB Connections</p>
                        <p className="text-2xl font-bold text-purple-600">{metrics.databaseConnections}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-3xl">🗄️</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Uptime */}
                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 truncate">System Uptime</p>
                        <p className="text-2xl font-bold text-indigo-600">{metrics.uptime}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-3xl">⏱️</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Microservices Grid */}
              <div className="bg-white shadow-lg rounded-xl border border-gray-100 mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Live Microservices Status</h3>
                    <span className="text-sm text-gray-500">Real-time monitoring</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {microservices.map((service) => (
                      <div key={service.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              service.status === 'running' ? 'bg-green-500' : 
                              service.status === 'stopped' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className={`px-2 py-1 text-xs rounded-full text-white ${categoryColors[service.category] || 'bg-gray-500'}`}>
                              {service.category}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">:{service.port}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{service.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${
                            service.status === 'running' ? 'text-green-600' : 
                            service.status === 'stopped' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {service.status}
                          </span>
                          <span className="text-xs text-gray-500">{service.uptime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow-lg rounded-xl border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">System Controls</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <button 
                      onClick={() => window.location.href = '/performance-monitor'}
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 text-left flex items-center"
                    >
                      <span className="mr-3">📊</span>
                      Performance Monitor
                    </button>
                    <button 
                      onClick={() => window.location.href = '/security'}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-left flex items-center"
                    >
                      <span className="mr-3">🔒</span>
                      Security Settings
                    </button>
                    <button 
                      onClick={() => window.location.href = '/integration-hub'}
                      className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 text-left flex items-center"
                    >
                      <span className="mr-3">🔗</span>
                      Integration Hub
                    </button>
                    <button 
                      onClick={() => window.location.href = '/multi-language-management'}
                      className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 text-left flex items-center"
                    >
                      <span className="mr-3">🌐</span>
                      Multi-Language Management
                    </button>
                  </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent System Activities</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">All {metrics.totalMicroservices} microservices operational</p>
                          <p className="text-xs text-gray-500">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Reporting Management service deployed</p>
                          <p className="text-xs text-gray-500">5 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Security scan completed - no issues found</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Performance optimization applied</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              LeafyHealth Super Admin v1.1
            </p>
            <p className="text-sm text-gray-500">
              {metrics.totalMicroservices} Microservices Managed
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}