'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  register: any
  rightElement?: React.ReactNode // For "Forgot password" link in Login
}

export function PasswordInput({
  label,
  error,
  hint,
  register,
  className,
  rightElement,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={props.id}
          className="text-xs font-medium text-white/80 uppercase tracking-wider ml-1"
        >
          {label}
        </label>
        {rightElement}
      </div>
      
      <div className="relative group">
        <input
          {...props}
          {...register}
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'w-full px-4 py-3 pr-11 rounded-app outline-none transition-all duration-200',
            'bg-white/5 border border-white/10 text-white placeholder:text-white/30',
            'focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30',
            'hover:bg-white/10 hover:border-white/20',
            props.disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={props.disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/30 hover:text-white transition-colors outline-none focus:text-white disabled:pointer-events-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {error ? (
        <p className="text-red-500 text-xs ml-1">{error}</p>
      ) : hint ? (
        <p className="text-white/40 text-[10px] uppercase tracking-tight ml-1 leading-tight">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
