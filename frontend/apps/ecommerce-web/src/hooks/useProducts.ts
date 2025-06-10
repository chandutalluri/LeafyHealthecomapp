import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface ProductsFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

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

const fetchProducts = async (filters: ProductsFilters = {}): Promise<Product[]> => {
  try {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const response = await fetch(`/api/products?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.products || data.data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const useProducts = (filters: ProductsFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}