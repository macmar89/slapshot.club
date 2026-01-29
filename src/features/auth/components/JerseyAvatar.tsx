import React from 'react'
import { cn } from '@/lib/utils'

export type JerseyPattern = 'stripes' | 'bands' | 'plain' | 'chevrons' | 'hoops'
export type JerseyStyle = 'classic' | 'modern'

interface JerseyAvatarProps {
  primaryColor?: string
  secondaryColor?: string
  pattern?: JerseyPattern
  number?: string
  style?: JerseyStyle
  className?: string
  size?: number
}

export function JerseyAvatar({
  primaryColor = '#ef4444',
  secondaryColor = '#ffffff',
  pattern = 'stripes',
  number = '10',
  style = 'classic',
  className,
  size = 120,
}: JerseyAvatarProps) {
  // SVG Patterns
  const renderPattern = () => {
    switch (pattern) {
      case 'stripes':
        return (
          <g transform="translate(10,0) scale(0.8, 1)">
             <rect x="25" y="0" width="10" height="100" fill={secondaryColor} />
             <rect x="65" y="0" width="10" height="100" fill={secondaryColor} />
          </g>
        )
      case 'bands':
        return (
          <g>
            <rect x="0" y="35" width="100" height="15" fill={secondaryColor} />
            <rect x="0" y="65" width="100" height="15" fill={secondaryColor} />
          </g>
        )
      case 'chevrons':
        return (
          <g>
            <path d="M0,40 L50,60 L100,40 L100,55 L50,75 L0,55 Z" fill={secondaryColor} />
            <path d="M0,60 L50,80 L100,60 L100,75 L50,95 L0,75 Z" fill={secondaryColor} />
          </g>
        )
      case 'hoops':
         return (
          <g>
            <rect x="0" y="38" width="100" height="12" fill={secondaryColor} />
            <rect x="0" y="58" width="100" height="12" fill={secondaryColor} />
          </g>
         )
      default: // plain
        return null
    }
  }

  return (
    <div 
      className={cn("relative flex items-center justify-center drop-shadow-xl", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-all duration-500 hover:scale-105"
      >
        {/* Bulkier Hockey Silhouette */}
        <path
          id="jersey-body"
          d="M20 25 L10 55 L15 62 L22 50 L22 88 Q50 95 78 88 L78 50 L85 62 L90 55 L80 25 L65 10 Q50 15 35 10 Z"
          fill={primaryColor}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        
        {/* Clip for patterns */}
        <mask id="hockeyJerseyMask">
           <path d="M20 25 L10 55 L15 62 L22 50 L22 88 Q50 95 78 88 L78 50 L85 62 L90 55 L80 25 L65 10 Q50 15 35 10 Z" fill="white" />
        </mask>

        {/* Pattern Layer */}
        <g mask="url(#hockeyJerseyMask)">
          {renderPattern()}
          
          {/* Permanent Elbow Stripes (Hockey Style) */}
          <g opacity="0.8">
            {/* Left Sleeve */}
            <path d="M12 45 L18 55" stroke={secondaryColor} strokeWidth="2.5" />
            <path d="M14 48 L20 58" stroke={secondaryColor} strokeWidth="2.5" />
            
            {/* Right Sleeve */}
            <path d="M88 45 L82 55" stroke={secondaryColor} strokeWidth="2.5" />
            <path d="M86 48 L80 58" stroke={secondaryColor} strokeWidth="2.5" />
          </g>

          {/* Bottom Hem Stripe */}
          <path d="M22 82 Q50 89 78 82" stroke={secondaryColor} strokeWidth="4" opacity="0.7" fill="none" />
        </g>

        {/* Premium V-Neck Collar */}
        <g>
          {style === 'modern' ? (
            <path d="M35 10 Q50 25 65 10" stroke={secondaryColor} strokeWidth="4" fill="none" strokeLinecap="round" />
          ) : (
            <g>
              {/* V-Shape */}
              <path d="M35 10 L50 28 L65 10" fill={primaryColor} stroke={secondaryColor} strokeWidth="3" />
              {/* Center Insert */}
              <path d="M46 15 L50 21 L54 15" fill={secondaryColor} />
              {/* Laces detail */}
              <line x1="47" y1="18" x2="53" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              <line x1="48" y1="21" x2="52" y2="21" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* Shoulder Detail / Padding Lines */}
        <path d="M25 15 C30 25 22 30 22 30" stroke="rgba(0,0,0,0.1)" fill="none" strokeWidth="0.8" />
        <path d="M75 15 C70 25 78 30 78 30" stroke="rgba(0,0,0,0.1)" fill="none" strokeWidth="0.8" />

        {/* Large Centered Number */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontSize="42"
          fontFamily="'Inter', 'Arial Black', sans-serif"
          fontWeight="900"
          fill={secondaryColor}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
          className="select-none pointer-events-none"
          style={{ 
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))',
            letterSpacing: '-0.05em'
          }}
        >
          {number}
        </text>
        
        {/* Subtle Sleeve Numbers (optional aesthetic) */}
        <g opacity="0.3" fontSize="8" fontWeight="bold" fill={secondaryColor}>
           <text x="18" y="42" transform="rotate(-45 18 42)" textAnchor="middle">{number}</text>
           <text x="82" y="42" transform="rotate(45 82 42)" textAnchor="middle">{number}</text>
        </g>

      </svg>
    </div>
  )
}
