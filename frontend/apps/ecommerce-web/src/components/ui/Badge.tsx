import { forwardRef, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-900 text-gray-50 shadow hover:bg-gray-900/80',
        secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80',
        destructive: 'border-transparent bg-red-500 text-gray-50 shadow hover:bg-red-500/80',
        outline: 'text-gray-950 border-gray-200',
        success: 'border-transparent bg-green-500 text-white shadow hover:bg-green-500/80',
        warning: 'border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80',
        info: 'border-transparent bg-blue-500 text-white shadow hover:bg-blue-500/80',
        organic: 'border-transparent bg-green-100 text-green-800 shadow hover:bg-green-100/80',
        glass: 'border-white/20 bg-white/10 backdrop-blur-sm text-gray-900 shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'