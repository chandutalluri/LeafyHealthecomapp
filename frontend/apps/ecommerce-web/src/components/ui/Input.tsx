import { forwardRef, InputHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  'flex w-full transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-gray-300 bg-white rounded-2xl px-4 py-3 hover:border-green-400 focus:border-green-500',
        glass: 'bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl px-4 py-3 hover:bg-white/30 focus:bg-white/40',
        search: 'bg-white/60 border border-white/40 rounded-full px-6 py-3 hover:bg-white/70 focus:bg-white/80',
        minimal: 'bg-transparent border-b border-gray-300 rounded-none px-0 py-2 hover:border-green-400 focus:border-green-500',
        filled: 'bg-gray-100 border border-transparent rounded-2xl px-4 py-3 hover:bg-gray-200 focus:bg-white focus:border-green-500',
      },
      inputSize: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
        xl: 'h-14 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'