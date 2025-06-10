import { forwardRef, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      />
    )
  }
)

Avatar.displayName = 'Avatar'

interface AvatarImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn('aspect-square h-full w-full object-cover', className)}
        {...props}
      />
    )
  }
)

AvatarImage.displayName = 'AvatarImage'

interface AvatarFallbackProps extends HTMLAttributes<HTMLDivElement> {}

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium',
          className
        )}
        {...props}
      />
    )
  }
)

AvatarFallback.displayName = 'AvatarFallback'