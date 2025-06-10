import { Home, DollarSign, CreditCard, Receipt, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Accounting Management', href: '/accounting-management', icon: Receipt },
    { name: 'Expense Monitoring', href: '/expense-monitoring', icon: DollarSign },
    { name: 'Payment Processing', href: '/payment-processing', icon: CreditCard },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Admin Portal</h2>
      </div>
      <nav className="mt-6">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}