import Head from 'next/head'
import { useState } from 'react'
import { Leaf, ShoppingCart, Clock, Shield, Search, MapPin } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { GlassInput } from '../components/ui/GlassInput'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { formatCurrency } from '../lib/utils'
import { useCartStore } from '../stores/cartStore'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriesVisible, setCategoriesVisible] = useState(true)
  const { addItem } = useCartStore()
  
  // Fetch data from backend
  const { data: products, isLoading: productsLoading } = useProducts({ 
    search: searchTerm
  })
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  // Featured products (first 6)
  const featuredProducts = products?.slice(0, 6) || []

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      organic: product.organic
    })
    toast.success(`Added ${product.name} to cart`)
  }

  return (
    <>
      <Head>
        <title>LeafyHealth - Fresh Organic Produce Delivered</title>
        <meta name="description" content="Get the freshest organic fruits and vegetables delivered to your door. Premium quality, locally sourced produce for a healthier lifestyle." />
        <meta name="keywords" content="organic, fresh produce, vegetables, fruits, delivery, healthy food" />
      </Head>

      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 relative overflow-hidden page-transition">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-green-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Hero Section - Full Width */}
        <div className="relative pt-20 pb-16 px-8 w-full min-h-[85vh] flex items-center">
          <div className="w-full text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full mb-8 shadow-2xl backdrop-blur-lg border-4 border-white/30 animate-pulse">
              <span className="text-4xl drop-shadow-2xl">🌿</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none tracking-tighter drop-shadow-2xl">
              Fresh, <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent animate-pulse">Organic</span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl">Delivered Daily</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
              Premium organic produce sourced directly from local farms. Sustainable, 
              healthy, and delivered fresh to your doorstep.
            </p>
            
            {/* Search Bar - Sleek */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for fresh organic produce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 shadow-xl text-white placeholder-emerald-200 font-medium"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl pointer-events-none"></div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products">
                <button className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 transform hover:scale-105 border border-white/30">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Shop Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                </button>
              </Link>
              <button 
                onClick={() => setCategoriesVisible(!categoriesVisible)}
                className="relative px-8 py-4 text-lg font-bold rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                View Categories
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section - Streamlined */}
        {categoriesVisible && !categoriesLoading && categories && categories.length > 0 && (
          <div className="relative py-16 px-8 w-full bg-black/20 backdrop-blur-lg">
            <div className="w-full max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12 drop-shadow-xl">
                Shop by <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Category</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.slice(0, 6).map((category: any) => (
                  <Link key={category.id} href={`/products?category=${category.id}`}>
                    <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon || '🥬'}</div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">{category.name}</h3>
                      <p className="text-emerald-200 text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300">{category.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Featured Products Section - Streamlined */}
        {!productsLoading && featuredProducts.length > 0 && (
          <div className="relative py-16 px-8 w-full">
            <div className="w-full max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12 drop-shadow-xl">
                Featured <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Products</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product: any) => (
                  <div key={product.id} className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <div className="relative mb-4">
                      <div className="w-full h-32 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                        🥬
                      </div>
                      {product.organic && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Organic
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                      {product.name}
                    </h3>
                    
                    <p className="text-emerald-200 text-sm mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {product.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black text-emerald-400">
                        {formatCurrency(product.price)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features Section - Streamlined */}
        <div className="relative py-16 px-8 w-full bg-black/20 backdrop-blur-lg">
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12 drop-shadow-xl">
              Why Choose <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">LeafyHealth</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">100% Organic</h3>
                <p className="text-emerald-200 text-sm opacity-80">Certified organic produce from trusted local farms</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full mb-4 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Fast Delivery</h3>
                <p className="text-emerald-200 text-sm opacity-80">Same-day delivery for orders placed before 2 PM</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mb-4 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Quality Guaranteed</h3>
                <p className="text-emerald-200 text-sm opacity-80">100% satisfaction guarantee or your money back</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}