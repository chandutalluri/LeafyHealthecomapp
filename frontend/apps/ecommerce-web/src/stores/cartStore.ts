import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image?: string
  organic: boolean
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,

      addItem: (product) => {
        const { items } = get()
        const existingItem = items.find(item => item.id === product.id)
        
        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + product.price,
            isOpen: true
          }))
        } else {
          set(state => ({
            items: [...state.items, { ...product, quantity: 1 }],
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + product.price,
            isOpen: true
          }))
        }
        
        // Auto-close cart after 3 seconds
        setTimeout(() => {
          set(state => ({ isOpen: false }))
        }, 3000)
      },

      removeItem: (id) => {
        const { items } = get()
        const item = items.find(item => item.id === id)
        if (item) {
          set(state => ({
            items: state.items.filter(item => item.id !== id),
            totalItems: state.totalItems - item.quantity,
            totalPrice: state.totalPrice - (item.price * item.quantity)
          }))
        }
      },

      updateItemQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        const { items } = get()
        const item = items.find(item => item.id === id)
        if (item) {
          const quantityDiff = quantity - item.quantity
          const priceDiff = item.price * quantityDiff
          
          set(state => ({
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity } : item
            ),
            totalItems: state.totalItems + quantityDiff,
            totalPrice: state.totalPrice + priceDiff
          }))
        }
      },

      removeFromCart: (id: string) => {
        get().removeItem(id)
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 })
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      }
    }),
    {
      name: 'leafyhealth-cart',
      partialize: (state) => ({ 
        items: state.items, 
        totalItems: state.totalItems, 
        totalPrice: state.totalPrice 
      })
    }
  )
)