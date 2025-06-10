import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, MapPin, Star } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import { formatCurrency } from '../lib/utils'
import Header from '../components/layout/Header'
import toast from 'react-hot-toast'

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<any>(null)
  const [nearestBranch, setNearestBranch] = useState<string>('Detecting location...')

  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const { data: products = [], isLoading: productsLoading } = useProducts()

  // Get user location and find nearest branch
  useEffect(() => {
    const getUserLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            
            try {
              // Use a free geocoding service
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
              const data = await response.json()
              
              const locationData = {
                latitude,
                longitude,
                address: data.locality || 'Unknown',
                city: data.city || data.locality || 'Unknown City',
                country: data.countryName || 'Unknown Country'
              }
              
              setUserLocation(locationData)
              setNearestBranch(`${locationData.city} Branch - Available`)
              
              // Store location for future use
              localStorage.setItem('userLocation', JSON.stringify(locationData))
              
            } catch (error) {
              console.error('Error getting address:', error)
              setNearestBranch('Location services unavailable')
            }
          },
          (error) => {
            console.error('Error getting location:', error)
            setNearestBranch('Enable location access in browser')
          },
          { enableHighAccuracy: true, timeout: 10000 }
        )
      } else {
        setNearestBranch('Location not supported by browser')
      }
    }

    getUserLocation()
  }, [])

  const filteredProducts = selectedCategory 
    ? (products || []).filter(product => product.category === selectedCategory)
    : products

  const handleAddToCart = (product: any) => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cartItems.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category,
        organic: product.organic
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems))
    window.dispatchEvent(new Event('cartUpdated'))
    toast.success(`Added ${product.name} to cart`)
  }

  const getCategoryIcon = (categoryName: string) => {
    const icons: { [key: string]: string } = {
      'Leafy Greens': '🥬',
      'Vegetables': '🥕',
      'Fruits': '🍎', 
      'Herbs': '🌿',
      'Root Vegetables': '🥔',
      'Citrus': '🍊',
      'Berries': '🫐',
      'Tropical': '🥭'
    }
    return icons[categoryName] || '🥬'
  }

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        <div className="pt-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-8 w-64"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-3xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Product Categories - LeafyHealth</title>
        <meta name="description" content="Browse fresh organic produce by category. Find the best fruits, vegetables, and herbs near you." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        
        <div className="pt-20 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Header Section */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
              <p className="text-xl text-gray-600 mb-6">
                Fresh organic produce organized by category for easy shopping
              </p>
              
              {/* Location Display */}
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{nearestBranch}</span>
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    selectedCategory === null
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-white/60 text-gray-700 hover:bg-white/80'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                      selectedCategory === category.name
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-white/60 text-gray-700 hover:bg-white/80'
                    }`}
                  >
                    <span className="text-lg">{getCategoryIcon(category.name)}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Grid */}
            {!selectedCategory && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse Categories</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categories.map((category) => {
                    const categoryProducts = (products || []).filter(p => p.category === category.name)
                    return (
                      <GlassCard 
                        key={category.id} 
                        className="group hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <div className="p-6 text-center">
                          <div className="text-6xl mb-4">
                            {getCategoryIcon(category.name)}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 mb-4">{category.description}</p>
                          <div className="text-sm text-green-600 font-medium">
                            {categoryProducts.length} products available
                          </div>
                        </div>
                      </GlassCard>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {selectedCategory && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory} ({filteredProducts.length} products)
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(null)}
                  >
                    View All Categories
                  </Button>
                </div>
                
                {(filteredProducts || []).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">No products available in this category right now</p>
                    <Button
                      variant="primary"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Browse All Categories
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <GlassCard key={product.id} className="group hover:scale-105 transition-transform duration-300">
                        <Link href={`/product/${product.id}`}>
                          <div className="relative overflow-hidden rounded-t-3xl">
                            <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                              <span className="text-6xl">
                                {getCategoryIcon(product.category)}
                              </span>
                            </div>
                            {product.organic && (
                              <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                Organic
                              </div>
                            )}
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                        
                        <div className="p-6">
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          
                          {/* Rating */}
                          <div className="flex items-center mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating || 4.5)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-xs text-gray-600">
                              ({product.reviews || 0})
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-sm text-gray-600">/kg</span>
                            </div>
                            
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className="min-w-[100px]"
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              {product.inStock ? 'Add' : 'Unavailable'}
                            </Button>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Delivery Info */}
            <div className="mt-16 bg-green-50 rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🚚 Free Delivery to {userLocation?.city || 'Your Area'}
              </h3>
              <p className="text-gray-600 mb-6">
                Order before 2 PM for same-day delivery. Free delivery on orders over $25.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl mb-2">⏰</div>
                  <h4 className="font-semibold text-gray-900">Same Day Delivery</h4>
                  <p className="text-sm text-gray-600">Order by 2 PM</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🌱</div>
                  <h4 className="font-semibold text-gray-900">100% Organic</h4>
                  <p className="text-sm text-gray-600">Certified fresh produce</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">💚</div>
                  <h4 className="font-semibold text-gray-900">Quality Guarantee</h4>
                  <p className="text-sm text-gray-600">Fresh or money back</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}