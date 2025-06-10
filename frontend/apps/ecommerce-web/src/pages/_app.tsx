import { useState, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { suppressQueryErrors } from '../lib/errorHandler';
import '../styles/globals.css'

// Initialize global error handling
suppressQueryErrors();

// Loading component for smooth transitions
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full mb-6 shadow-2xl backdrop-blur-lg border-4 border-white/30 animate-pulse">
          <span className="text-4xl drop-shadow-2xl">🌿</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">LeafyHealth</h2>
        <p className="text-emerald-200">Loading fresh groceries...</p>
        <div className="mt-4 w-48 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading and prevent white flash
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Global background to prevent white flash */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900">
        <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(16, 185, 129, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            color: '#ffffff',
            fontWeight: '500',
          },
          success: {
            style: {
              background: 'rgba(34, 197, 94, 0.9)',
            },
          },
          error: {
            style: {
              background: 'rgba(239, 68, 68, 0.9)',
            },
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}