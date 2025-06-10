import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ArrowLeft, ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Button } from '../../components/ui/Button'
import { GlassCard } from '../../components/ui/GlassCard'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [quantity, setQuantity] = useState(1)

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/api/catalog/products/${id}`)
      if (!response.ok) {
        throw new Error('Product not found')
      }
      return response.json()
    },
    enabled: !!id
  })

  const handleAddToCart = () => {
    if (product) {
      // Simple cart functionality - could be enhanced with Zustand later
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cartItems.find((item: any) => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          category: product.category,
          organic: product.organic
        })
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems))
      toast.success(`Added ${quantity} ${product.name} to cart`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 w-32"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-3xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{product.name} - LeafyHealth</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/products" className="inline-flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <GlassCard className="aspect-square p-8 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                  <span className="text-8xl">
                    {product.category === 'Leafy Greens' ? '🥬' : 
                     product.category === 'Vegetables' ? '🥕' :
                     product.category === 'Fruits' ? '🍎' :
                     product.category === 'Herbs' ? '🌿' :
                     product.category === 'Root Vegetables' ? '🥕' : '🥬'}
                  </span>
                </div>
                {product.organic && (
                  <div className="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full font-medium">
                    Certified Organic
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600">{product.category}</p>
                
                {/* Rating */}
                <div className="flex items-center mt-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 4.5)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.reviewCount || 23} reviews)
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(product.price)}
                <span className="text-lg text-gray-600 font-normal">/{product.unit || 'kg'}</span>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Origin</span>
                  <span className="font-medium">{product.origin || 'Local Farms'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Freshness</span>
                  <span className="font-medium text-green-600">Harvested Today</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Storage</span>
                  <span className="font-medium">{product.storage || 'Refrigerate'}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart - {formatCurrency(product.price * quantity)}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-12 h-12 p-0"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">🚚 Free Delivery</h3>
                <p className="text-sm text-gray-600">
                  Order before 2 PM for same-day delivery. Free delivery on orders over $25.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <GlassCard className="p-6 text-center">
              <div className="text-3xl mb-3">🌱</div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Organic</h3>
              <p className="text-sm text-gray-600">
                Grown without synthetic pesticides or fertilizers
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fresh Delivery</h3>
              <p className="text-sm text-gray-600">
                Delivered within hours of harvest for maximum freshness
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <div className="text-3xl mb-3">💚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">
                Not satisfied? Get a full refund, no questions asked
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  )
}