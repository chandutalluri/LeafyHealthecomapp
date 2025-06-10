import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard, Truck } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useCartStore } from '../stores/cartStore'
import { formatCurrency } from '../lib/utils'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { 
    items: cartItems, 
    totalPrice: cartTotal, 
    totalItems: cartCount,
    updateItemQuantity, 
    removeFromCart, 
    clearCart 
  } = useCartStore()

  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      toast.success('Item removed from cart')
    } else {
      updateItemQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id)
    toast.success(`${name} removed from cart`)
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared')
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      clearCart()
      setIsCheckingOut(false)
      toast.success('Order placed successfully!')
    }, 2000)
  }

  return (
    <>
      <Head>
        <title>Shopping Cart - LeafyHealth</title>
        <meta name="description" content="Review your fresh organic products before checkout. Quality groceries delivered fresh to your door." />
      </Head>

      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 relative overflow-hidden page-transition">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link href="/products" className="inline-flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors duration-300 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Continue Shopping</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full mb-6 shadow-2xl border border-white/30">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              Your Fresh Cart
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Review your organic selections and proceed to checkout for fresh delivery
            </p>
          </div>

          {(cartItems || []).length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-16">
              <div className="grocery-glass p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6">🛒</div>
                <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
                <p className="text-white/80 mb-8">
                  Start adding fresh organic products to your cart
                </p>
                <Link href="/products">
                  <button className="cart-button">
                    <ShoppingBag className="w-5 h-5" />
                    Browse Products
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* Cart Items */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grocery-glass p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Cart Items ({cartCount})</h2>
                    <button 
                      onClick={handleClearCart}
                      className="text-white/60 hover:text-red-400 transition-colors duration-300 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400/30 via-emerald-500/30 to-teal-600/30 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                          <span className="text-3xl">🥬</span>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg truncate">{item.name}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="price-display">{formatCurrency(item.price)}</span>
                            {item.organic && (
                              <span className="organic-badge">
                                🌱 Organic
                              </span>
                            )}
                          </div>
                          <p className="text-white/60 text-sm mt-1">{item.category}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border border-white/30"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="font-bold text-white text-lg w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 bg-emerald-500/80 hover:bg-emerald-600/80 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border border-white/30"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>

                        {/* Item Total & Remove */}
                        <div className="text-right">
                          <div className="font-bold text-white text-lg">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-white/60 hover:text-red-400 transition-colors duration-300 mt-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div className="grocery-glass p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white/80">
                      <span>Subtotal ({cartCount} items)</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Delivery Fee</span>
                      <span className="text-emerald-400">FREE</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Packaging Fee</span>
                      <span className="text-emerald-400">FREE</span>
                    </div>
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex justify-between text-xl font-bold text-white">
                        <span>Total</span>
                        <span className="price-display">{formatCurrency(cartTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-2">
                      <Truck className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium text-white">Free Delivery</span>
                    </div>
                    <p className="text-white/80 text-sm">
                      Expected delivery: Today, 6:00 PM - 8:00 PM
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full cart-button text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <CreditCard className="w-5 h-5" />
                        <span>Proceed to Checkout</span>
                      </div>
                    )}
                  </button>

                  <p className="text-white/60 text-xs text-center mt-4">
                    Secure checkout with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  )
}