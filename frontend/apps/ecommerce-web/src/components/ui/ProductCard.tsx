import { forwardRef } from 'react'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { GlassCard } from './GlassCard'
import { Button } from './Button'
import { formatCurrency } from '../../lib/utils'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  inStock: boolean
  organic: boolean
  rating: number
  reviews: number
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onToggleFavorite?: (productId: string) => void
  isFavorite?: boolean
  className?: string
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, onAddToCart, onToggleFavorite, isFavorite, className }, ref) => {
    return (
      <GlassCard
        ref={ref}
        className={`group relative overflow-hidden ${className}`}
        hover="lift"
        padding="none"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-3xl">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.organic && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Organic
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite?.(product.id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(product.price)}
            </div>
            <Button
              size="sm"
              onClick={() => onAddToCart?.(product)}
              disabled={!product.inStock}
              className="shrink-0"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>
    )
  }
)

ProductCard.displayName = 'ProductCard'