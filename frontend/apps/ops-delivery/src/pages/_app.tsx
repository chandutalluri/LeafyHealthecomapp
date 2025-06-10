import type { AppProps } from 'next/app'
import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
}