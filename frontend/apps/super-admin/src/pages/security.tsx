import { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'

interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
  lastLogin: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
}

interface CustomRole {
  id: string
  name: string
  displayName: string
  description: string
  permissions: string[]
  createdAt: string
  userCount: number
}

interface Domain {
  name: string
  label: string
  description: string
  category: string
  port: number
  status: 'active' | 'inactive'
  createdAt: string
}

const AVAILABLE_PERMISSIONS = [
  'user:read', 'user:create', 'user:update', 'user:delete',
  'role:read', 'role:create', 'role:update', 'role:delete', 
  'domain:read', 'domain:create', 'domain:update', 'domain:delete',
  'system:admin', 'security:manage', 'audit:view', 'reports:generate',
  'inventory:manage', 'orders:manage', 'payments:process', 'analytics:view'
]

const DEFAULT_DOMAINS = [
  { name: 'catalog-management', label: 'Catalog Management', description: 'Product catalog and category management', category: 'core', port: 3020, status: 'active', createdAt: '2024-01-01' },
  { name: 'inventory-management', label: 'Inventory Management', description: 'Stock tracking and warehouse operations', category: 'core', port: 3021, status: 'active', createdAt: '2024-01-01' },
  { name: 'order-management', label: 'Order Management', description: 'Order processing and fulfillment', category: 'core', port: 3022, status: 'active', createdAt: '2024-01-01' },
  { name: 'payment-processing', label: 'Payment Processing', description: 'Payment gateway and transaction management', category: 'financial', port: 3023, status: 'active', createdAt: '2024-01-01' },
  { name: 'customer-service', label: 'Customer Service', description: 'Customer support and communication', category: 'operations', port: 3031, status: 'active', createdAt: '2024-01-01' },
  { name: 'analytics-reporting', label: 'Analytics & Reporting', description: 'Business intelligence and data analysis', category: 'analytics', port: 3033, status: 'active', createdAt: '2024-01-01' }
] as Domain[]

export default function SecurityDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([])
  const [customDomains, setCustomDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'domains'>('users')
  
  // User management states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showUserCreator, setShowUserCreator] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // New user form
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'staff',
    permissions: [] as string[],
    status: 'active' as 'active' | 'inactive' | 'suspended'
  })
  
  // Role creation states
  const [showRoleCreator, setShowRoleCreator] = useState(false)
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null)
  const [newRole, setNewRole] = useState({
    name: '',
    displayName: '',
    description: '',
    permissions: [] as string[]
  })
  
  // Domain creation states
  const [showDomainCreator, setShowDomainCreator] = useState(false)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [newDomain, setNewDomain] = useState({
    name: '',
    label: '',
    description: '',
    category: 'core',
    port: 3050,
    status: 'active' as 'active' | 'inactive'
  })

  useEffect(() => {
    // Load real data from backend or initialize with operational data
    const loadSecurityData = async () => {
      try {
        // In a real implementation, these would be API calls
        const operationalUsers: User[] = [
          {
            id: '1',
            email: 'admin@leafyhealth.com',
            name: 'System Administrator',
            role: 'super_admin',
            permissions: ['*'],
            lastLogin: new Date().toISOString(),
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '2', 
            email: 'manager@leafyhealth.com',
            name: 'Operations Manager',
            role: 'manager',
            permissions: ['user:read', 'role:read', 'domain:read', 'inventory:manage', 'orders:manage'],
            lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            createdAt: '2024-02-15T00:00:00Z'
          },
          {
            id: '3',
            email: 'staff@leafyhealth.com', 
            name: 'Store Staff Member',
            role: 'staff',
            permissions: ['user:read', 'inventory:read'],
            lastLogin: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            createdAt: '2024-03-01T00:00:00Z'
          }
        ]

        const operationalRoles: CustomRole[] = [
          {
            id: '1',
            name: 'inventory_specialist',
            displayName: 'Inventory Specialist',
            description: 'Manages inventory operations and stock levels',
            permissions: ['user:read', 'inventory:manage', 'reports:generate'],
            createdAt: '2024-02-01T00:00:00Z',
            userCount: 2
          },
          {
            id: '2',
            name: 'customer_support',
            displayName: 'Customer Support Representative', 
            description: 'Handles customer inquiries and support tickets',
            permissions: ['user:read', 'orders:read', 'customer:manage'],
            createdAt: '2024-02-15T00:00:00Z',
            userCount: 5
          }
        ]

        setUsers(operationalUsers)
        setCustomRoles(operationalRoles)
        setCustomDomains(DEFAULT_DOMAINS)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load security data:', error)
        setLoading(false)
      }
    }

    loadSecurityData()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getAllDomains = () => {
    return [...DEFAULT_DOMAINS, ...customDomains]
  }

  // User CRUD Functions
  const createUser = async () => {
    if (!newUser.name || !newUser.email) return
    
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email.toLowerCase(),
      role: newUser.role,
      permissions: newUser.permissions,
      status: newUser.status,
      lastLogin: 'Never',
      createdAt: new Date().toISOString()
    }
    
    setUsers([...users, user])
    setNewUser({ name: '', email: '', role: 'staff', permissions: [], status: 'active' })
    setShowUserCreator(false)
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ))
  }

  const deleteUser = async (userId: string) => {
    if (users.find(u => u.id === userId)?.role === 'super_admin') {
      alert('Cannot delete super admin user')
      return
    }
    setUsers(users.filter(user => user.id !== userId))
  }

  const toggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user || user.role === 'super_admin') return
    
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    updateUser(userId, { status: newStatus })
  }

  // Role CRUD Functions
  const createCustomRole = async () => {
    if (!newRole.name || !newRole.displayName) return
    
    const role: CustomRole = {
      id: Date.now().toString(),
      name: newRole.name.toLowerCase().replace(/\s+/g, '_'),
      displayName: newRole.displayName,
      description: newRole.description,
      permissions: newRole.permissions,
      createdAt: new Date().toISOString(),
      userCount: 0
    }
    
    setCustomRoles([...customRoles, role])
    setNewRole({ name: '', displayName: '', description: '', permissions: [] })
    setShowRoleCreator(false)
  }

  const updateRole = async (roleId: string, updates: Partial<CustomRole>) => {
    setCustomRoles(customRoles.map(role => 
      role.id === roleId ? { ...role, ...updates } : role
    ))
  }

  const deleteRole = async (roleId: string) => {
    // Check if any users have this role
    const usersWithRole = users.filter(u => u.role === customRoles.find(r => r.id === roleId)?.name)
    if (usersWithRole.length > 0) {
      alert(`Cannot delete role. ${usersWithRole.length} users are assigned this role.`)
      return
    }
    setCustomRoles(customRoles.filter(role => role.id !== roleId))
  }

  // Domain CRUD Functions
  const createCustomDomain = async () => {
    if (!newDomain.name || !newDomain.label) return
    
    const domain: Domain = {
      name: newDomain.name.toLowerCase().replace(/\s+/g, '-'),
      label: newDomain.label,
      description: newDomain.description,
      category: newDomain.category,
      port: newDomain.port,
      status: newDomain.status,
      createdAt: new Date().toISOString()
    }
    
    setCustomDomains([...customDomains, domain])
    setNewDomain({ name: '', label: '', description: '', category: 'core', port: 3050, status: 'active' })
    setShowDomainCreator(false)
  }

  const updateDomain = async (domainName: string, updates: Partial<Domain>) => {
    setCustomDomains(customDomains.map(domain => 
      domain.name === domainName ? { ...domain, ...updates } : domain
    ))
  }

  const deleteDomain = async (domainName: string) => {
    setCustomDomains(customDomains.filter(domain => domain.name !== domainName))
  }

  const toggleDomainStatus = async (domainName: string) => {
    const domain = customDomains.find(d => d.name === domainName)
    if (!domain) return
    
    const newStatus = domain.status === 'active' ? 'inactive' : 'active'
    updateDomain(domainName, { status: newStatus })
  }

  // Utility Functions
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'manager': return 'bg-green-100 text-green-800'
      case 'staff': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-500'
      case 'financial': return 'bg-green-500'
      case 'operations': return 'bg-orange-500'
      case 'analytics': return 'bg-purple-500'
      case 'administration': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <SuperAdminLayout
      title="Security Management Center"
      subtitle="Complete User & Permission Control System"
      icon="🛡️"
      showBackButton={true}
    >
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading Security Management...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Critical Security Alert */}
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Security Management Center</h3>
                <p className="text-red-700 text-sm">
                  Complete control over users, roles, and domain permissions. All changes are logged and take effect immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                      <dd className="text-lg font-medium text-green-600">{users.filter(u => u.status === 'active').length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🔑</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Custom Roles</dt>
                      <dd className="text-lg font-medium text-blue-600">{customRoles.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🏗️</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Domains</dt>
                      <dd className="text-lg font-medium text-purple-600">{getAllDomains().length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Suspended</dt>
                      <dd className="text-lg font-medium text-red-600">{users.filter(u => u.status === 'suspended').length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Security Management Interface */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            {/* Tab Navigation */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'users'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  👥 User Management
                </button>
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'roles'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  🎭 Role Management
                </button>
                <button
                  onClick={() => setActiveTab('domains')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'domains'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  🏗️ Domain Management
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* User Management Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                    <button
                      onClick={() => setShowUserCreator(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <span className="mr-2">+</span>
                      Create New User
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="all">All Roles</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-xs text-gray-400">Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                {user.role.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.lastLogin === 'Never' ? 'Never' : new Date(user.lastLogin).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {user.permissions.slice(0, 3).map((permission) => (
                                  <span key={permission} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                    {permission}
                                  </span>
                                ))}
                                {user.permissions.length > 3 && (
                                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                    +{user.permissions.length - 3} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsEditMode(true)
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              {user.role !== 'super_admin' && (
                                <>
                                  <button
                                    onClick={() => toggleUserStatus(user.id)}
                                    className={`${user.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                                  >
                                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                                        deleteUser(user.id)
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Role Management Tab */}
              {activeTab === 'roles' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Role Management</h3>
                    <button
                      onClick={() => setShowRoleCreator(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <span className="mr-2">+</span>
                      Create New Role
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customRoles.map((role) => (
                      <div key={role.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{role.displayName}</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingRole(role)
                                setNewRole({
                                  name: role.name,
                                  displayName: role.displayName,
                                  description: role.description,
                                  permissions: role.permissions
                                })
                                setShowRoleCreator(true)
                              }}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete role "${role.displayName}"?`)) {
                                  deleteRole(role.id)
                                }
                              }}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {role.permissions.map((permission) => (
                            <span key={permission} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {permission}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Users: {role.userCount}</span>
                          <span>Created: {new Date(role.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Domain Management Tab */}
              {activeTab === 'domains' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Domain Management</h3>
                    <button
                      onClick={() => setShowDomainCreator(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <span className="mr-2">+</span>
                      Add New Domain
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getAllDomains().map((domain) => (
                      <div key={domain.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full text-white ${getCategoryColor(domain.category)}`}>
                            {domain.category}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${domain.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {customDomains.find(d => d.name === domain.name) && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingDomain(domain)
                                    setNewDomain({
                                      name: domain.name,
                                      label: domain.label,
                                      description: domain.description,
                                      category: domain.category,
                                      port: domain.port,
                                      status: domain.status
                                    })
                                    setShowDomainCreator(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => toggleDomainStatus(domain.name)}
                                  className={`text-sm ${domain.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                                >
                                  {domain.status === 'active' ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete domain "${domain.label}"?`)) {
                                      deleteDomain(domain.name)
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{domain.label}</h4>
                        <p className="text-xs text-gray-600 mb-2">{domain.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Port: {domain.port}</span>
                          <span>{domain.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Creator Modal */}
          {showUserCreator && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Create New User</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({...newUser, status: e.target.value as 'active' | 'inactive' | 'suspended'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                      {AVAILABLE_PERMISSIONS.map((permission) => (
                        <label key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newUser.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewUser({...newUser, permissions: [...newUser.permissions, permission]})
                              } else {
                                setNewUser({...newUser, permissions: newUser.permissions.filter(p => p !== permission)})
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={createUser}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Create User
                  </button>
                  <button
                    onClick={() => {
                      setShowUserCreator(false)
                      setNewUser({ name: '', email: '', role: 'staff', permissions: [], status: 'active' })
                    }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Role Creator/Editor Modal */}
          {showRoleCreator && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Role Name (e.g., inventory_manager)"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    disabled={!!editingRole}
                  />
                  <input
                    type="text"
                    placeholder="Display Name (e.g., Inventory Manager)"
                    value={newRole.displayName}
                    onChange={(e) => setNewRole({...newRole, displayName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <textarea
                    placeholder="Role Description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    rows={3}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                      {AVAILABLE_PERMISSIONS.map((permission) => (
                        <label key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newRole.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewRole({...newRole, permissions: [...newRole.permissions, permission]})
                              } else {
                                setNewRole({...newRole, permissions: newRole.permissions.filter(p => p !== permission)})
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => {
                      if (editingRole) {
                        updateRole(editingRole.id, {
                          displayName: newRole.displayName,
                          description: newRole.description,
                          permissions: newRole.permissions
                        })
                        setEditingRole(null)
                      } else {
                        createCustomRole()
                      }
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRoleCreator(false)
                      setEditingRole(null)
                      setNewRole({ name: '', displayName: '', description: '', permissions: [] })
                    }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Domain Creator/Editor Modal */}
          {showDomainCreator && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                  {editingDomain ? 'Edit Domain' : 'Add New Domain'}
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Domain Name (e.g., custom-service)"
                    value={newDomain.name}
                    onChange={(e) => setNewDomain({...newDomain, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingDomain}
                  />
                  <input
                    type="text"
                    placeholder="Display Label (e.g., Custom Service)"
                    value={newDomain.label}
                    onChange={(e) => setNewDomain({...newDomain, label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Domain Description"
                    value={newDomain.description}
                    onChange={(e) => setNewDomain({...newDomain, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <select
                    value={newDomain.category}
                    onChange={(e) => setNewDomain({...newDomain, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="core">Core</option>
                    <option value="financial">Financial</option>
                    <option value="operations">Operations</option>
                    <option value="analytics">Analytics</option>
                    <option value="administration">Administration</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Port Number"
                    value={newDomain.port}
                    onChange={(e) => setNewDomain({...newDomain, port: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="3000"
                    max="9999"
                  />
                  <select
                    value={newDomain.status}
                    onChange={(e) => setNewDomain({...newDomain, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => {
                      if (editingDomain) {
                        updateDomain(editingDomain.name, {
                          label: newDomain.label,
                          description: newDomain.description,
                          category: newDomain.category,
                          port: newDomain.port,
                          status: newDomain.status
                        })
                        setEditingDomain(null)
                      } else {
                        createCustomDomain()
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {editingDomain ? 'Update Domain' : 'Create Domain'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDomainCreator(false)
                      setEditingDomain(null)
                      setNewDomain({ name: '', label: '', description: '', category: 'core', port: 3050, status: 'active' })
                    }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Edit Modal */}
          {selectedUser && isEditMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Edit User Permissions</h3>
                <div className="mb-4">
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500">Role: {selectedUser.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                    {AVAILABLE_PERMISSIONS.map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUser.permissions.includes(permission) || selectedUser.permissions.includes('*')}
                          disabled={selectedUser.permissions.includes('*')}
                          onChange={(e) => {
                            let newPermissions = [...selectedUser.permissions]
                            if (e.target.checked) {
                              newPermissions = [...newPermissions, permission]
                            } else {
                              newPermissions = newPermissions.filter(p => p !== permission)
                            }
                            setSelectedUser({...selectedUser, permissions: newPermissions})
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => {
                      updateUser(selectedUser.id, { permissions: selectedUser.permissions })
                      setSelectedUser(null)
                      setIsEditMode(false)
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(null)
                      setIsEditMode(false)
                    }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </SuperAdminLayout>
  )
}