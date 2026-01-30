'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button, ButtonProps } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps extends ButtonProps {
  label?: React.ReactNode
  fallbackPath?: string
}

export function BackButton({ 
  className, 
  label, 
  onClick, 
  fallbackPath,
  children,
  ...props 
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e)
      return
    }
    
    // Default behavior
    if (window.history.length > 1) {
        router.back()
    } else if (fallbackPath) {
        router.push(fallbackPath)
    } else {
        router.back() 
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 text-white hover:text-warning transition-colors self-start text-xs font-bold uppercase tracking-widest h-auto p-0 cursor-pointer hover:bg-transparent",
        className
      )}
      {...props}
    >
      <ArrowLeft className="w-4 h-4" />
      {label || children || 'Späť'}
    </Button>
  )
}
