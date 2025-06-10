import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API } from '../lib/api'
import { handleApiError } from '../lib/utils'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { create } from 'zustand'

// Simple auth store for the app
interface AuthState {
  user: any | null
  token: string | null
  isAuthenticated: boolean
  login: (user: any, token: string) => void
  logout: () => void
  setUser: (user: any) => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => {
    set({ user, token, isAuthenticated: true })
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  },
  setUser: (user) => set({ user }),
}))

// Login mutation
export const useLogin = () => {
  const { login } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await API.auth.login(credentials)
      return response.data
    },
    onSuccess: (data) => {
      const { user, token } = data
      login(user, token)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success(`Welcome back, ${user.name}!`)
      
      // Redirect based on role
      const roleRedirects = {
        customer: '/',
        staff: '/staff',
        manager: '/manager',
        admin: '/admin',
        super_admin: '/super-admin',
      }
      
      router.push(roleRedirects[user.role as keyof typeof roleRedirects] || '/')
    },
    onError: (error) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// Register mutation
export const useRegister = () => {
  const { login } = useAuthStore()
  const router = useRouter()
  
  return useMutation({
    mutationFn: async (userData: { email: string; password: string; name: string }) => {
      const response = await API.auth.register(userData)
      return response.data
    },
    onSuccess: (data) => {
      const { user, token } = data
      login(user, token)
      toast.success(`Welcome to LeafyHealth, ${user.name}!`)
      router.push('/')
    },
    onError: (error) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// Logout mutation
export const useLogout = () => {
  const { logout } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      await API.auth.logout()
    },
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('Logged out successfully')
      router.push('/auth/login')
    },
    onError: (error) => {
      // Even if API call fails, still logout locally
      logout()
      queryClient.clear()
      router.push('/auth/login')
    },
  })
}

// Get current user query
export const useCurrentUser = () => {
  const { isAuthenticated, token } = useAuthStore()
  
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await API.auth.getUser()
      return response.data
    },
    enabled: isAuthenticated && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })
}

// Update profile mutation
export const useUpdateProfile = () => {
  const { setUser, user } = useAuthStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await API.auth.getUser()
      return response.data
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// Re-export auth store hook
export const useAuth = useAuthStore