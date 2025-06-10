import { forwardRef, ReactNode } from 'react'
import { GlassCard } from './GlassCard'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, className }, ref) => {
    return (
      <GlassCard
        ref={ref}
        className={`text-center ${className}`}
        hover="lift"
        variant="default"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-green-500/10 text-green-600">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </GlassCard>
    )
  }
)

FeatureCard.displayName = 'FeatureCard'