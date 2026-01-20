import React from 'react'
import { cn } from '@/lib/utils'

interface IceGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  backdropBlur?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

const blurMap = {
  none: 'backdrop-blur-none',
  xs: 'backdrop-blur-xs',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
  '3xl': 'backdrop-blur-3xl',
}

/**
 * IceGlassCard
 * Replicates a "thick block of ice" effect with premium glassmorphism.
 * Features:
 * - High transparency with deep blur (backdrop-blur-xl)
 * - Complex box-shadows for beveled edges and specular highlights
 * - Subtle inner gradient for volume
 */
export const IceGlassCard = React.forwardRef<HTMLDivElement, IceGlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          // Shape & Size
          'rounded-md',
          // Border
          'border border-2 border-[#5d626d]',
          // Background & Transparency
          // 'bg-white/5', // Very subtle base
          blurMap[props.backdropBlur || 'xs'], // Deep blur for the ice effect, customizable
          // Border & Bevel simulation
          // We use a combination of box-shadows to create the 3D ice block look
          // 1. Inset white ring for the sharp top/left edge highlight (specular)
          // 2. Inset subtle dark ring for depth
          // 3. Outer diffuse shadow for lift
          'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.3)]',
          // Gradient Overlay for "sheen"
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none',
          className,
        )}
        {...props}
      >
        {/* Content Container - ensures text is on top of the gradient */}
        <div className={cn('relative z-10 text-white h-full', className)}>
          {children}
        </div>
      </div>
    )
  },
)
IceGlassCard.displayName = 'IceGlassCard'

