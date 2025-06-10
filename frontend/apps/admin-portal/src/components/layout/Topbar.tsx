import { Search, Bell, User } from 'lucide-react'

export function Topbar() {
  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-900">LeafyHealth Admin</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}