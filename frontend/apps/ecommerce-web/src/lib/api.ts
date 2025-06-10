import axios from 'axios'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// Authentication API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/api/auth/login', credentials),
  
  register: (userData: { email: string; password: string; name: string }) =>
    apiClient.post('/api/auth/register', userData),
  
  logout: () =>
    apiClient.post('/api/auth/logout'),
  
  getUser: () =>
    apiClient.get('/api/auth/user'),
}

// Products API
export const productsAPI = {
  getAll: (params?: { category?: string; search?: string; branch?: string }) =>
    apiClient.get('/api/products', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/api/products/${id}`),
  
  create: (product: any) =>
    apiClient.post('/api/products', product),
  
  update: (id: string, product: any) =>
    apiClient.put(`/api/products/${id}`, product),
  
  delete: (id: string) =>
    apiClient.delete(`/api/products/${id}`),
}

// Categories API
export const categoriesAPI = {
  getAll: () =>
    apiClient.get('/api/categories'),
  
  getById: (id: string) =>
    apiClient.get(`/api/categories/${id}`),
  
  create: (category: any) =>
    apiClient.post('/api/categories', category),
  
  update: (id: string, category: any) =>
    apiClient.put(`/api/categories/${id}`, category),
  
  delete: (id: string) =>
    apiClient.delete(`/api/categories/${id}`),
}

// Export all APIs
export const API = {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
}

export default API