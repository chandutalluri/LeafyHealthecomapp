'use client';

import { useState, useEffect } from 'react';
import { SuperAdminLayout } from '../../components/layout/SuperAdminLayout';

interface IdentityAccessItem {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export default function IdentityAccessPage() {
  const [items, setItems] = useState<IdentityAccessItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      // Replace with actual API endpoint
      const response = await fetch('/api/identity-access');
      if (response.ok) {
        const data = await response.json();
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching identity-access data:', error);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading identity-access...</span>
      </div>
    );
  }

  return (
    <SuperAdminLayout
      title="Identity & Access Management"
      subtitle="User authentication and access control system"
      icon="🔐"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">1,847</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Sessions</dt>
                  <dd className="text-lg font-medium text-green-600">342</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Security Level</dt>
                  <dd className="text-lg font-medium text-blue-600">High</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Failed Logins</dt>
                  <dd className="text-lg font-medium text-red-600">23</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add New User
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center">
              <span className="mr-2">⚙️</span>
              Filter
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="px-2 py-1 text-xs rounded-full text-white bg-blue-500">
                        {item.role || 'User'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{item.status || 'Active'}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{item.username}</h4>
                  <p className="text-xs text-gray-600 mb-2">{item.email}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Last Login</span>
                    <span className="text-xs text-gray-500">{item.lastLogin || 'Never'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first user account.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Create First User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New user registration: admin@leafyhealth.com</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Password reset completed for user: customer@gmail.com</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Failed login attempt detected</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}