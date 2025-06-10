import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Category {
  id: string
  name: string
  icon: string
  productCount: number
  description?: string
}

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('/api/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.categories || data.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}