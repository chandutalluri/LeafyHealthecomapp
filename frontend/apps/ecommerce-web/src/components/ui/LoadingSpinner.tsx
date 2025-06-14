import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', className }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-green-500',
          sizeClasses[size],
          className
        )}
      />
    )
  }
)

LoadingSpinner.displayName = 'LoadingSpinner'