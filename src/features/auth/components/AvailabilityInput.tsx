'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvailabilityInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: 'username' | 'email'
  label: string
  hint?: string
  error?: string
  onAvailabilityChange?: (isAvailable: boolean) => void
  register: any // from react-hook-form
}

export function AvailabilityInput({
  type,
  label,
  hint,
  error,
  register,
  className,
  onAvailabilityChange,
  ...props
}: AvailabilityInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [debouncedValue] = useDebounce(inputValue, 500)
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'available' | 'taken' | 'rate-limited' | 'error' | 'invalid'
  >('idle')
  const [apiError, setApiError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const checkAvailability = useCallback(
    async (value: string) => {
      if (!value) {
        setStatus('idle')
        setValidationError(null)
        onAvailabilityChange?.(false)
        return
      }

      // Validation before API call
      if (type === 'username') {
        if (value.includes(' ')) {
          setStatus('invalid')
          setValidationError('Medzery nie sú povolené')
          onAvailabilityChange?.(false)
          return
        }

        if (value.length < 4 || value.length > 20) {
          setStatus('invalid')
          setValidationError(
            value.length < 4 ? 'Meno je príliš krátke (min. 4)' : 'Meno je príliš dlhé (max. 20)',
          )
          onAvailabilityChange?.(false)
          return
        }

        const usernameRegex = /^[a-zA-Z0-9_.]+$/
        if (!usernameRegex.test(value)) {
          setStatus('invalid')
          setValidationError('Len písmená, čísla, . a _')
          onAvailabilityChange?.(false)
          return
        }
      }

      if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          // For email we stay in idle until it's valid enough to check
          setStatus('idle')
          setValidationError(null)
          onAvailabilityChange?.(false)
          return
        }
      }

      setStatus('loading')
      setValidationError(null)
      setApiError(null)

      try {
        const res = await fetch(
          `/api/users/check-availability?type=${type}&value=${encodeURIComponent(value)}`,
        )

        if (res.status === 429) {
          setStatus('rate-limited')
          onAvailabilityChange?.(false)
          return
        }

        if (!res.ok) throw new Error('Failed to check availability')

        const data = await res.json()
        if (data.available) {
          setStatus('available')
          onAvailabilityChange?.(true)
        } else {
          setStatus('taken')
          onAvailabilityChange?.(false)
        }
      } catch (err) {
        console.error(err)
        setStatus('error')
        onAvailabilityChange?.(false)
      }
    },
    [type, onAvailabilityChange],
  )

  useEffect(() => {
    if (debouncedValue) {
      checkAvailability(debouncedValue)
    } else {
      setStatus('idle')
    }
  }, [debouncedValue, checkAvailability])

  const { onChange, ...registerRest } = register

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onChange(e) // Call react-hook-form's onChange
  }

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor={props.id}
          className="text-xs font-medium text-white/80 uppercase tracking-wider ml-1"
        >
          {label}
        </label>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10"
          aria-live="polite"
        >
          {status === 'loading' && (
            <>
              <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
              <span className="text-[10px] text-blue-400 uppercase font-bold tracking-tighter">
                Rozhodca preveruje video...
              </span>
            </>
          )}
          {status === 'available' && (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-tighter">
                Čistý ľad!
              </span>
            </>
          )}
          {status === 'invalid' && (
            <>
              <XCircle className="w-3 h-3 text-red-400" />
              <span className="text-[10px] text-red-400 uppercase font-bold tracking-tighter">
                Zakázané uvoľnenie!
              </span>
            </>
          )}
          {status === 'taken' && (
            <>
              <XCircle className="w-3 h-3 text-red-400" />
              <span className="text-[10px] text-red-400 uppercase font-bold tracking-tighter">
                Ofsajd!
              </span>
            </>
          )}
          {status === 'rate-limited' && (
            <button
              type="button"
              onClick={() => checkAvailability(inputValue)}
              className="flex items-center gap-1.5 hover:bg-white/10 transition-colors px-1 rounded"
            >
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-tighter decoration-dotted underline underline-offset-2">
                Trestná lavica!
              </span>
            </button>
          )}
          {status === 'idle' && (
            <span className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">
              Čakám na zadanie
            </span>
          )}
        </div>
      </div>

      <div className="relative group">
        <input
          {...props}
          {...registerRest}
          onChange={handleInputChange}
          className={cn(
            'w-full px-4 py-3 rounded-app outline-none transition-all duration-200',
            'bg-white/5 border border-white/10 text-white placeholder:text-white/30',
            'focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30',
            'hover:bg-white/10 hover:border-white/20',
            (error || status === 'taken' || status === 'invalid') &&
              'border-red-500 focus:border-red-500 focus:ring-red-500',
            status === 'available' &&
              'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/50',
            className,
          )}
        />
      </div>

      {error ? (
        <p className="text-red-500 text-xs ml-1">{error}</p>
      ) : status === 'invalid' ? (
        <p className="text-red-400 text-[10px] uppercase font-bold tracking-tight ml-1 animate-pulse">
          {validationError || 'Zakázané uvoľnenie!'}
        </p>
      ) : status === 'taken' ? (
        <p className="text-red-500 text-xs ml-1">
          Toto {type === 'username' ? 'meno' : 'email'} je už v ofsajde (obsadené).
        </p>
      ) : status === 'rate-limited' ? (
        <div className="flex items-center justify-between ml-1">
          <p className="text-amber-500 text-xs font-medium italic">
            Si na trestnej lavici (cooldown). Skús to o chvíľu.
          </p>
          <button
            type="button"
            onClick={() => checkAvailability(inputValue)}
            className="text-[10px] text-white/60 hover:text-white uppercase font-bold tracking-wider underline underline-offset-2"
          >
            Skúsiť znova
          </button>
        </div>
      ) : hint ? (
        <p className="text-white/40 text-[10px] uppercase tracking-tight ml-1 leading-tight">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
