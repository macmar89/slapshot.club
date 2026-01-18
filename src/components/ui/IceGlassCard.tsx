import React from 'react'
import { cn } from '@/lib/utils'

interface IceGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
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
          'backdrop-blur-xs', // Deep blur for the ice effect
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
        <div className="relative z-10 p-6 flex flex-col items-center justify-center gap-6 text-white h-full">
          {children || (
            // Default Layout for Hockey Match (can be overridden by children)
            <DefaultMatchContent />
          )}
        </div>
      </div>
    )
  },
)
IceGlassCard.displayName = 'IceGlassCard'

// Helper component for the default match layout shown in the requirements
// This makes it easy to visualize the "default" state but allows passing custom children
const DefaultMatchContent = () => (
  <>
    {/* Header: Logos & Score */}
    <div className="flex items-center justify-between w-full max-w-[80%]">
      {/* Home Team */}
      <div className="flex flex-col items-center gap-2">
        {/* Placeholder for Logo */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg flex items-center justify-center text-xs font-bold text-black border-2 border-white/20">
          VGK
        </div>
      </div>

      {/* Score Center */}
      <div className="flex flex-col items-center">
        {/* Main Score - Large & Bold with specific font */}
        <div className="text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight drop-shadow-lg">
          2 - 0
        </div>
        <div className="text-xs font-medium tracking-[0.2em] text-white/60 uppercase mt-1">
          Match
        </div>
      </div>

      {/* Away Team */}
      <div className="flex flex-col items-center gap-2">
        {/* Placeholder for Logo */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg flex items-center justify-center text-xs font-bold text-white border-2 border-white/20">
          EDM
        </div>
      </div>
    </div>

    {/* Footer: Stats / Players (Mock Data) */}
    <div className="w-full mt-2 pt-4 border-t border-white/10 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-600/50" />
        <div className="flex flex-col text-sm">
          <span className="font-semibold">M. Stone</span>
          <span className="text-xs text-white/50">1G, 1A</span>
        </div>
        <div className="ml-auto text-xs font-bold px-2 py-1 rounded bg-white/10">MVP</div>
      </div>
    </div>
  </>
)
