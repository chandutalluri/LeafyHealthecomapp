import Link from 'next/link'
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-black/40 backdrop-blur-lg text-white py-16 px-8 w-full border-t border-white/10">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 text-6xl">🥬</div>
        <div className="absolute top-12 right-8 text-4xl">🥕</div>
        <div className="absolute bottom-8 left-1/4 text-5xl">🍎</div>
        <div className="absolute bottom-4 right-1/3 text-3xl">🥒</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl">🌱</div>
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-400">LeafyHealth</h3>
                <p className="text-xs text-emerald-200">Fresh & Organic Delivered</p>
              </div>
            </div>
            <p className="text-emerald-200 opacity-80 text-sm leading-relaxed">
              Your trusted partner for fresh, organic produce delivered straight from local farms to your doorstep. 
              Supporting sustainable agriculture and healthy living since 2020.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-emerald-500/30 transition-all duration-300 group">
                <Facebook className="w-5 h-5 text-emerald-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-emerald-500/30 transition-all duration-300 group">
                <Instagram className="w-5 h-5 text-emerald-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-emerald-500/30 transition-all duration-300 group">
                <Twitter className="w-5 h-5 text-emerald-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Shop Fresh</h4>
            <ul className="space-y-3 text-emerald-200 opacity-80">
              <li>
                <Link href="/products" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/organic" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  Organic Selection
                </Link>
              </li>
              <li>
                <Link href="/seasonal" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  Seasonal Produce
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  Fresh Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Customer Care</h4>
            <ul className="space-y-3 text-emerald-200 opacity-80">
              <li>
                <Link href="/help" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/freshness-guarantee" className="hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                  Freshness Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Stay Fresh</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-200 opacity-80">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">1-800-LEAFY-FRESH</span>
              </div>
              <div className="flex items-center space-x-3 text-emerald-200 opacity-80">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">hello@leafyhealth.com</span>
              </div>
              <div className="flex items-start space-x-3 text-emerald-200 opacity-80">
                <MapPin className="w-4 h-4 text-emerald-400 mt-1" />
                <span className="text-sm">Fresh Markets District<br />Organic Valley, CA 90210</span>
              </div>
              
              {/* Newsletter signup */}
              <div className="mt-6">
                <p className="text-sm text-emerald-200 opacity-80 mb-3">Get fresh deals & seasonal recipes</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-l-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-sm"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-r-lg transition-all duration-300 text-sm font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications & Trust badges */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2 text-emerald-300">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-medium">USDA Organic Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-300">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Farm-to-Table Fresh</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-300">
              <span className="text-lg">🌱</span>
              <span className="text-sm font-medium">Sustainably Sourced</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-300">
              <span className="text-lg">🚚</span>
              <span className="text-sm font-medium">Same-Day Delivery</span>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-white/20 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-emerald-200 opacity-80 text-sm">
              &copy; 2025 LeafyHealth. All rights reserved. Fresh food, delivered with love.
            </p>
            <div className="flex space-x-6 text-emerald-200 opacity-80 text-sm">
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/sustainability" className="hover:text-emerald-400 transition-colors duration-300">
                Sustainability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}