'use client';

import { useState, useEffect } from 'react';
import { SuperAdminLayout } from '../../components/layout/SuperAdminLayout';

interface UserRoleManagementItem {
  id: string;
  roleName: string;
  permissions: string;
  userCount: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserRoleManagementPage() {
  const [items, setItems] = useState<UserRoleManagementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      // Replace with actual API endpoint
      const response = await fetch('/api/user-role-management');
      if (response.ok) {
        const data = await response.json();
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching user-role-management data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = (items || []).filter(item =>
    Object.values(item || {}).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <SuperAdminLayout
      title="User Role Management"
      subtitle="Define and manage user roles and permissions"
      icon="👤"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🔑</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Roles</dt>
                  <dd className="text-lg font-medium text-gray-900">12</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Roles</dt>
                  <dd className="text-lg font-medium text-green-600">9</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Permissions</dt>
                  <dd className="text-lg font-medium text-blue-600">247</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Assigned Users</dt>
                  <dd className="text-lg font-medium text-purple-600">1,847</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Role Configuration</h3>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Create New Role
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center">
              <span className="mr-2">⚙️</span>
              Filter
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading roles...</span>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="px-2 py-1 text-xs rounded-full text-white bg-red-500">
                      Super Admin
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Super Administrator</h4>
                <p className="text-xs text-gray-600 mb-2">Full system access and control</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Users: 1</span>
                  <span className="text-xs text-green-600">All Permissions</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="px-2 py-1 text-xs rounded-full text-white bg-blue-500">
                      Admin
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Administrator</h4>
                <p className="text-xs text-gray-600 mb-2">Administrative access with restrictions</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Users: 23</span>
                  <span className="text-xs text-blue-600">187 Permissions</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="px-2 py-1 text-xs rounded-full text-white bg-green-500">
                      Manager
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Store Manager</h4>
                <p className="text-xs text-gray-600 mb-2">Operational management access</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Users: 156</span>
                  <span className="text-xs text-green-600">89 Permissions</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="px-2 py-1 text-xs rounded-full text-white bg-purple-500">
                      Staff
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Staff Member</h4>
                <p className="text-xs text-gray-600 mb-2">Basic operational access</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Users: 567</span>
                  <span className="text-xs text-purple-600">34 Permissions</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="px-2 py-1 text-xs rounded-full text-white bg-orange-500">
                      Customer
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Customer</h4>
                <p className="text-xs text-gray-600 mb-2">Customer portal access</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Users: 1,100</span>
                  <span className="text-xs text-orange-600">12 Permissions</span>
                </div>
              </div>

              {filteredItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="px-2 py-1 text-xs rounded-full text-white bg-gray-500">
                        {item.roleName || 'Role'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{item.status || 'Active'}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{item.roleName}</h4>
                  <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Users: {item.userCount || '0'}</span>
                    <span className="text-xs text-gray-600">{item.permissions || 'No permissions'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔑</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first user role.</p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                Create First Role
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Permission Matrix</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Permission</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-900">Super Admin</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-900">Admin</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-900">Manager</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-900">Staff</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-900">Customer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">User Management</td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-yellow-600">~</span></td>
                  <td className="text-center py-3 px-4"><span className="text-red-600">✗</span></td>
                  <td className="text-center py-3 px-4"><span className="text-red-600">✗</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">Product Management</td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-yellow-600">~</span></td>
                  <td className="text-center py-3 px-4"><span className="text-red-600">✗</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">Order Processing</td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-yellow-600">~</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">Financial Reports</td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-green-600">✓</span></td>
                  <td className="text-center py-3 px-4"><span className="text-yellow-600">~</span></td>
                  <td className="text-center py-3 px-4"><span className="text-red-600">✗</span></td>
                  <td className="text-center py-3 px-4"><span className="text-red-600">✗</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}