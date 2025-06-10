import { MainNavigation } from '../components/layout/MainNavigation'
import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
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