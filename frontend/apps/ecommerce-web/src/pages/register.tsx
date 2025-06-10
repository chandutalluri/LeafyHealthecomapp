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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser, isRegisterLoading, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/')
    return null
  }

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...userData } = data
    registerUser(userData)
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
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <GlassInput
                type="text"
                placeholder="Full name"
                {...register('name')}
                className={errors.name ? 'border-red-300' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.name.message}</p>
              )}
            </div>

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

            <div>
              <GlassInput
                type="tel"
                placeholder="Phone number (optional)"
                {...register('phone')}
                className={errors.phone ? 'border-red-300' : ''}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.phone.message}</p>
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

            <div className="relative">
              <GlassInput
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-300 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isRegisterLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-green-600 hover:text-green-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-green-600 hover:text-green-700">
                Privacy Policy
              </Link>
            </p>
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