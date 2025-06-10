import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  Search, 
  Menu, 
  X, 
  LogIn,
  UserPlus,
  Heart,
  Bell,
  Trash2,
  Plus,
  Minus
} from 'lucide-react'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'
import { formatCurrency } from '../../lib/utils'
import { useCartStore } from '../../stores/cartStore'
import toast from 'react-hot-toast'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  organic: boolean
}

interface Location {
  latitude: number
  longitude: number
  address: string
  city: string
}

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { 
    isOpen: isCartOpen, 
    toggleCart, 
    openCart, 
    closeCart,
    items: cartItems,
    totalPrice: cartTotal,
    totalItems: cartCount,
    updateQuantity,
    clearCart: clearCartStore
  } = useCartStore()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [nearestBranch, setNearestBranch] = useState<string>('Finding location...')



  // Get user location and find nearest branch
  useEffect(() => {
    const getUserLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            
            try {
              // Reverse geocoding to get address
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
              const data = await response.json()
              
              const locationData = {
                latitude,
                longitude,
                address: data.locality || 'Unknown',
                city: data.city || data.locality || 'Unknown City'
              }
              
              setLocation(locationData)
              
              // Find nearest branch (simulate API call)
              setNearestBranch(`${locationData.city} Branch`)
              
              // Store location for branch suggestions
              localStorage.setItem('userLocation', JSON.stringify(locationData))
              
            } catch (error) {
              console.error('Error getting address:', error)
              setNearestBranch('Location services unavailable')
            }
          },
          (error) => {
            console.error('Error getting location:', error)
            setNearestBranch('Enable location access')
          },
          { enableHighAccuracy: true, timeout: 10000 }
        )
      } else {
        setNearestBranch('Location not supported')
      }
    }

    getUserLocation()
  }, [])

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('userData')
      
      if (token && userData) {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      }
    }

    checkAuth()
  }, [])

  const updateCartItem = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
    if (newQuantity === 0) {
      toast.success('Item removed from cart')
    }
  }

  const handleClearCart = () => {
    clearCartStore()
    toast.success('Cart cleared')
    closeCart()
  }

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleRegister = () => {
    router.push('/auth/register')
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setIsAuthenticated(false)
    setUser(null)
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-emerald-600/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="w-full px-6 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300 backdrop-blur-md border border-white/30">
                <span className="text-white font-bold text-lg drop-shadow-md">🌿</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white drop-shadow-md tracking-tight">
                  LeafyHealth
                </span>
                <span className="text-xs text-emerald-100 font-medium tracking-wide">Fresh & Organic Delivered</span>
              </div>
            </Link>

            {/* Center Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-300" />
                <input
                  type="text"
                  placeholder="Search for fresh organic produce..."
                  className="w-full pl-12 pr-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all duration-300 text-sm font-medium"
                />
              </div>
            </div>

            {/* Location Display */}
            <div className="hidden md:flex items-center space-x-2 text-white bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30">
              <MapPin className="w-4 h-4 text-emerald-200" />
              <span className="font-medium text-sm">{nearestBranch}</span>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden xl:flex items-center space-x-6">
              <Link href="/products" className="text-white hover:text-emerald-200 transition-all duration-300 font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/10">
                Products
              </Link>
              <Link href="/categories" className="text-white hover:text-emerald-200 transition-all duration-300 font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/10">
                Categories
              </Link>
              <Link href="/branches" className="text-white hover:text-emerald-200 transition-all duration-300 font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/10">
                Branches
              </Link>
              <Link href="/about" className="text-white hover:text-emerald-200 transition-all duration-300 font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/10">
                About
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Wishlist */}
              <button className="p-2 text-white hover:text-pink-200 bg-white/20 hover:bg-pink-500/30 rounded-lg transition-all duration-300 backdrop-blur-md border border-white/30">
                <Heart className="w-4 h-4" />
              </button>

              {/* Cart */}
              <Link href="/cart">
                <button className="p-2 text-white hover:text-emerald-200 bg-white/20 hover:bg-emerald-500/30 rounded-lg transition-all duration-300 backdrop-blur-md border border-white/30 relative">
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link href="/account">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-xs text-white hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleLogin}
                    className="flex items-center space-x-1 px-3 py-2 text-white hover:text-emerald-200 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-lg transition-all duration-300 font-medium text-xs"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Login</span>
                  </button>
                  <button 
                    onClick={handleRegister}
                    className="flex items-center space-x-1 px-3 py-2 text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-lg transition-all duration-300 font-medium text-xs"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-white/20">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 pb-3 border-b border-gray-200">
                  <MapPin className="w-4 h-4" />
                  <span>{nearestBranch}</span>
                </div>
                <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors py-2">
                  Products
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-green-600 transition-colors py-2">
                  Categories
                </Link>
                <Link href="/branches" className="text-gray-700 hover:text-green-600 transition-colors py-2">
                  Branches
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors py-2">
                  About
                </Link>
                {isAuthenticated && (
                  <button 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 transition-colors py-2 text-left"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Dropdown */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 lg:static lg:inset-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={closeCart}
          />
          
          {/* Cart Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl lg:absolute lg:top-16 lg:right-4 lg:h-auto lg:max-h-96 lg:rounded-3xl lg:border border-white/20 overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{cartCount} items</span>
                  <button 
                    onClick={closeCart}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-600 mb-4">Your cart is empty</p>
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        closeCart()
                        router.push('/products')
                      }}
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">
                            {item.category === 'Leafy Greens' ? '🥬' : 
                             item.category === 'Vegetables' ? '🥕' :
                             item.category === 'Fruits' ? '🍎' :
                             item.category === 'Herbs' ? '🌿' : '🥬'}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                          {item.organic && (
                            <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1">
                              Organic
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateCartItem(item.id, 0)}
                            className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(cartTotal)}</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleClearCart}
                    >
                      Clear Cart
                    </Button>
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      onClick={() => {
                        closeCart()
                        router.push('/checkout')
                      }}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}