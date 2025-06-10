import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const glassCardVariants = cva(
  'backdrop-blur-lg border rounded-3xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white/10 border-white/20 shadow-lg',
        heavy: 'bg-white/20 border-white/30 shadow-xl',
        brand: 'bg-green-500/10 border-green-400/20 shadow-lg',
        dark: 'bg-black/10 border-black/20 shadow-lg',
        primary: 'bg-green-500/10 border-green-400/30 shadow-green-500/20',
        secondary: 'bg-gray-500/10 border-gray-400/20',
        success: 'bg-green-500/10 border-green-400/30',
        warning: 'bg-yellow-500/10 border-yellow-400/30',
        danger: 'bg-red-500/10 border-red-400/30',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-xl',
        glow: 'hover:shadow-green-500/20 hover:border-green-400/40',
        scale: 'hover:scale-[1.02]',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: 'lift',
      padding: 'md',
    },
  }
)

export interface GlassCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, hover, padding, children, ...props }, ref) => {
    return (
      <div
        className={cn(glassCardVariants({ variant, hover, padding, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'