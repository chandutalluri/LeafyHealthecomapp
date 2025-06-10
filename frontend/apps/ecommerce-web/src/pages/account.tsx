import Head from 'next/head'
import { useState } from 'react'
import { User, Package, MapPin, CreditCard, Bell, LogOut } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { GlassInput } from '../components/ui/GlassInput'
import Header from '../components/layout/Header'
import toast from 'react-hot-toast'

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Green Street',
    city: 'Organic City',
    postalCode: '12345'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = () => {
    toast.success('Profile updated successfully!')
  }

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-06-07',
      status: 'Delivered',
      total: 42.50,
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-06-05',
      status: 'In Transit',
      total: 28.90,
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2024-06-02',
      status: 'Delivered',
      total: 15.75,
      items: 1
    }
  ]

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  return (
    <>
      <Head>
        <title>My Account - LeafyHealth</title>
      </Head>

      <Header />
      
      <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-xl text-gray-600">Manage your profile and preferences</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{profileData.name}</h3>
                  <p className="text-sm text-gray-600">{profileData.email}</p>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-green-100 text-green-800 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                  <button className="w-full flex items-center px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </nav>
              </GlassCard>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <GlassCard className="p-8">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <GlassInput
                        label="Full Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                      />
                      <GlassInput
                        label="Email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                      <GlassInput
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={handleInputChange}
                      />
                      <GlassInput
                        label="Address"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                      />
                      <GlassInput
                        label="City"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                      />
                      <GlassInput
                        label="Postal Code"
                        name="postalCode"
                        value={profileData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mt-8">
                      <Button variant="primary" onClick={handleSave}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">Order {order.id}</h3>
                              <p className="text-sm text-gray-600">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'Delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'In Transit'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{order.items} items</span>
                            <span className="font-semibold text-green-600">${order.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Delivery Addresses</h2>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Home</h3>
                            <p className="text-gray-600">
                              {profileData.address}<br />
                              {profileData.city}, {profileData.postalCode}
                            </p>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        </div>
                      </div>
                      <Button variant="outline">Add New Address</Button>
                    </div>
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Methods</h2>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CreditCard className="w-8 h-8 text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium">**** **** **** 1234</p>
                              <p className="text-sm text-gray-600">Expires 12/26</p>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        </div>
                      </div>
                      <Button variant="outline">Add New Payment Method</Button>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Order Updates</h3>
                          <p className="text-sm text-gray-600">Get notified about your order status</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Promotions</h3>
                          <p className="text-sm text-gray-600">Receive special offers and discounts</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Weekly Newsletter</h3>
                          <p className="text-sm text-gray-600">Fresh produce tips and recipes</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}