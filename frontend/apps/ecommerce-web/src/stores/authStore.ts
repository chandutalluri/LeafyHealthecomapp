import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  role: string
  branchId?: string
  phone?: string
  avatar?: string
}

export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  coordinates: {
    lat: number
    lng: number
  }
  isActive: boolean
}

interface AuthStore {
  user: User | null
  token: string | null
  selectedBranch: Branch | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: { name: string; email: string; password: string }) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  setSelectedBranch: (branch: Branch) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      selectedBranch: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error('Login failed')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            throw new Error('Registration failed')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          selectedBranch: null,
          isAuthenticated: false
        })
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      setToken: (token) => {
        set({ token, isAuthenticated: !!token })
      },

      setSelectedBranch: (branch) => {
        set({ selectedBranch: branch })
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          selectedBranch: null,
          isAuthenticated: false
        })
      }
    }),
    {
      name: 'leafyhealth-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        selectedBranch: state.selectedBranch,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)