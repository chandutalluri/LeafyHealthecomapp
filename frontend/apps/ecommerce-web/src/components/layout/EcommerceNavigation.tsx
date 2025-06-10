import { Home, Package, Users, MessageSquare, Bell, FileText, Store, ShoppingCart, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function EcommerceNavigation() {
  const router = useRouter();
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Catalog', href: '/catalog-management', icon: Package },
    { name: 'Orders', href: '/order-management', icon: ShoppingCart },
    { name: 'Customers', href: '/customer-service', icon: Users },
    { name: 'Content', href: '/content-management', icon: FileText },
    { name: 'Marketplace', href: '/marketplace-management', icon: Store },
    { name: 'Labels', href: '/label-design', icon: FileText },
    { name: 'Notifications', href: '/notification-service', icon: Bell },
    { name: 'Analytics', href: '/analytics-reporting', icon: BarChart3 },
  ]

  return (
    <nav className="w-64 bg-white shadow-lg border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">🛒</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">LeafyHealth</h2>
            <p className="text-xs text-gray-500">E-commerce Platform</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-4 py-3 rounded-lg transition-colors mb-1
                ${isActive 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  )
}