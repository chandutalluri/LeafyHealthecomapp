import Head from 'next/head'
import { useState } from 'react'
import { Search, Filter, Grid, List, ShoppingCart, Leaf, Star } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlassInput } from '../../components/ui/GlassInput'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { useCartStore } from '../../stores/cartStore'
import { formatCurrency } from '../../lib/utils'
import Link from 'next/link'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import toast from 'react-hot-toast'

// Loading skeleton component
function ProductSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-pulse">
      <div className="w-full h-32 bg-white/20 rounded-xl mb-4"></div>
      <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-white/20 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-white/20 rounded w-1/3"></div>
        <div className="h-8 bg-white/20 rounded w-24"></div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { addItem } = useCartStore()

  // Fetch data
  const { data: products, isLoading: productsLoading, error } = useProducts({
    search: searchTerm,
    category: selectedCategory,
  })
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      organic: product.organic
    })
    toast.success(`${product.name} added to cart!`)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Store Temporarily Closed</h2>
          <p className="text-emerald-200 mb-6 opacity-80">
            We're restocking our fresh produce. Please try again in a moment.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
          >
            Refresh Store
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Fresh Organic Products - LeafyHealth</title>
        <meta name="description" content="Browse our wide selection of fresh organic fruits, vegetables, and grocery items. Premium quality produce delivered fresh to your door." />
        <meta name="keywords" content="organic products, fresh fruits, vegetables, grocery, healthy food, farm fresh" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Header />
        
        <div className="relative pt-20 pb-16 px-8 w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full mb-6 shadow-2xl backdrop-blur-lg border-4 border-white/30">
              <Leaf className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-2xl">
              Fresh <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">Organic</span> Products
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Discover premium organic produce sourced directly from local farms
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-300 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search fresh produce..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300 font-medium"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-300 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 font-medium appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">All Categories</option>
                    {categories?.map((category: any) => (
                      <option key={category.id} value={category.id} className="bg-slate-800">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 font-medium appearance-none cursor-pointer"
                >
                  <option value="name" className="bg-slate-800">Sort by Name</option>
                  <option value="price" className="bg-slate-800">Sort by Price</option>
                  <option value="category" className="bg-slate-800">Sort by Category</option>
                </select>

                {/* View Toggle */}
                <div className="flex bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-emerald-500 text-white shadow-lg' 
                        : 'text-emerald-300 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-emerald-500 text-white shadow-lg' 
                        : 'text-emerald-300 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto">
            {productsLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product: any) => (
                  <div
                    key={product.id}
                    className={`group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      viewMode === 'list' ? 'flex p-6 items-center space-x-6' : 'p-6'
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'mb-4'}`}>
                      <div className={`w-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 ${
                        viewMode === 'list' ? 'h-24' : 'h-32'
                      }`}>
                        🥬
                      </div>
                      {product.organic && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                          <Leaf className="w-3 h-3 inline mr-1" />
                          Organic
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 flex items-center bg-black/50 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-full text-xs">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        4.8
                      </div>
                    </div>

                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className={`font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300 ${
                        viewMode === 'list' ? 'text-xl' : 'text-lg'
                      }`}>
                        {product.name}
                      </h3>

                      <p className={`text-emerald-200 opacity-80 group-hover:opacity-100 transition-opacity duration-300 mb-4 ${
                        viewMode === 'list' ? 'text-base' : 'text-sm'
                      }`}>
                        {product.description}
                      </p>

                      <div className={`flex items-center ${viewMode === 'list' ? 'justify-between' : 'justify-between'}`}>
                        <div>
                          <span className={`font-black text-emerald-400 ${
                            viewMode === 'list' ? 'text-2xl' : 'text-xl'
                          }`}>
                            {formatCurrency(product.price)}
                          </span>
                          {viewMode === 'list' && (
                            <div className="text-xs text-emerald-300 opacity-80">
                              Category: {product.category}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
                <p className="text-emerald-200 opacity-80 mb-6">
                  Try adjusting your search or browse all categories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('')
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="fixed bottom-8 right-8 z-40">
            <Link href="/cart">
              <button className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-2 border-white/30">
                <ShoppingCart className="w-6 h-6" />
              </button>
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}