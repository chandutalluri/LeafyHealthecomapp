import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { suppressQueryErrors } from '../lib/errorHandler';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Sidebar } from '../components/layout/Sidebar'

// Initialize global error handling
suppressQueryErrors();

export default function AdminPortalApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
        </div>
      </main>
    </div>
  )
}