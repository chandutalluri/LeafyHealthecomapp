import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { GlassInput } from '../components/ui/GlassInput'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, isLoginLoading, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/')
    return null
  }

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <GlassCard className="text-center">
          <div className="flex items-center justify-center mb-8">
            <Leaf className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">LeafyHealth</h1>
          </div>

          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <GlassInput
                type="email"
                placeholder="Email address"
                {...register('email')}
                className={errors.email ? 'border-red-300' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <GlassInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
                className={errors.password ? 'border-red-300 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoginLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
              Forgot your password?
            </Link>
          </div>
        </GlassCard>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}