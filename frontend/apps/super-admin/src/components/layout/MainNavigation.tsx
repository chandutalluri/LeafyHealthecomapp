'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Shield, 
  Users, 
  Globe, 
  Zap, 
  Network, 
  Home,
  Settings,
  BarChart3
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  category: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'System overview and status',
    category: 'core'
  },
  {
    name: 'Security Center',
    href: '/security',
    icon: Shield,
    description: 'System security management',
    category: 'core'
  },
  {
    name: 'Identity & Access',
    href: '/identity-access',
    icon: Shield,
    description: 'User authentication and access control',
    category: 'security'
  },
  {
    name: 'User Role Management',
    href: '/user-role-management',
    icon: Users,
    description: 'Roles and permissions management',
    category: 'security'
  },
  {
    name: 'Multi-Language Management',
    href: '/multi-language-management',
    icon: Globe,
    description: 'Internationalization and localization',
    category: 'system'
  },
  {
    name: 'Performance Monitor',
    href: '/performance-monitor',
    icon: Zap,
    description: 'System performance monitoring',
    category: 'system'
  },
  {
    name: 'Integration Hub',
    href: '/integration-hub',
    icon: Network,
    description: 'Third-party integrations and APIs',
    category: 'system'
  },
  {
    name: 'Compliance Audit',
    href: '/compliance-audit',
    icon: BarChart3,
    description: 'Regulatory compliance and auditing',
    category: 'system'
  }
];

const categories = [
  { id: 'core', name: 'Core', color: 'bg-blue-500' },
  { id: 'security', name: 'Security', color: 'bg-red-500' },
  { id: 'system', name: 'System', color: 'bg-green-500' }
];

export function MainNavigation() {
  const router = useRouter();

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <nav className="w-80 bg-white shadow-xl border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">🌟</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Super Admin</h2>
            <p className="text-xs text-gray-500">System Administration</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {categories.map((category) => {
          const categoryItems = navigationItems.filter(item => item.category === category.id);
          
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {category.name}
                </h3>
              </div>
              
              <div className="space-y-1">
                {categoryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
                        ${isActive 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-[1.02]' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className={`
                        h-5 w-5 mr-3 transition-transform duration-200
                        ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                        ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                      `} />
                      <div className="flex-1">
                        <div className={`
                          font-medium text-sm
                          ${isActive ? 'text-white' : 'text-gray-900'}
                        `}>
                          {item.name}
                        </div>
                        <div className={`
                          text-xs mt-0.5
                          ${isActive ? 'text-indigo-100' : 'text-gray-500'}
                        `}>
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
        <div className="text-center">
          <p className="text-xs text-gray-500">LeafyHealth Super Admin v1.0</p>
          <p className="text-xs text-gray-400">19 Microservices Connected</p>
        </div>
      </div>
    </nav>
  );
}