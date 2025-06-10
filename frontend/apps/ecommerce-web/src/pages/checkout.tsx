import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail } from 'lucide-react'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { formatCurrency } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { GlassInput } from '../components/ui/GlassInput'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function Checkout() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()
  const { user, token } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    // Customer Info
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    
    // Delivery Address
    address: '',
    city: '',
    postalCode: '',
    deliveryNotes: '',
    
    // Payment
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        items: items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        delivery: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.deliveryNotes
        },
        payment: {
          method: formData.paymentMethod,
          amount: totalPrice
        },
        totalAmount: totalPrice
      }

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Order submission failed')
      }

      const result = await response.json()
      
      // Clear cart and redirect to success page
      clearCart()
      toast.success('Order placed successfully!')
      router.push(`/order-confirmation?orderId=${result.id}`)
      
    } catch (error) {
      console.error('Order submission error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if ((items || []).length === 0) {
    return (
      <>
        <Head>
          <title>Checkout - LeafyHealth</title>
        </Head>
        
        <div className="min-h-screen pt-20 px-4">
          <div className="container mx-auto max-w-4xl text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No items in cart</h1>
            <p className="text-xl text-gray-600 mb-8">Add some products before checking out.</p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Checkout - LeafyHealth</title>
      </Head>

      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/cart" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer Information */}
                <GlassCard className="p-6">
                  <div className="flex items-center mb-6">
                    <User className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <GlassInput
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    <GlassInput
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <GlassInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="md:col-span-2"
                    />
                  </div>
                </GlassCard>

                {/* Delivery Address */}
                <GlassCard className="p-6">
                  <div className="flex items-center mb-6">
                    <MapPin className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <GlassInput
                      label="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <GlassInput
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                      <GlassInput
                        label="Postal Code"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Notes (Optional)
                      </label>
                      <textarea
                        name="deliveryNotes"
                        value={formData.deliveryNotes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl hover:bg-white/30 focus:bg-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                        placeholder="Special delivery instructions..."
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* Payment Information */}
                <GlassCard className="p-6">
                  <div className="flex items-center mb-6">
                    <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl hover:bg-white/30 focus:bg-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                      >
                        <option value="card">Credit/Debit Card</option>
                        <option value="cash">Cash on Delivery</option>
                      </select>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <>
                        <GlassInput
                          label="Card Number"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                          <GlassInput
                            label="Expiry Date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                          />
                          <GlassInput
                            label="CVV"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                          />
                        </div>
                        <GlassInput
                          label="Cardholder Name"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </>
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <GlassCard className="p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  
                  {/* Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">
                            {item.category === 'Leafy Greens' ? '🥬' : 
                             item.category === 'Vegetables' ? '🥕' :
                             item.category === 'Fruits' ? '🍎' :
                             item.category === 'Herbs' ? '🌿' :
                             item.category === 'Root Vegetables' ? '🥕' : '🥬'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-green-600">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </GlassCard>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}