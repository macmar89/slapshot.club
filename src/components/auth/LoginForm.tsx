import React from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const LoginForm = () => {
  return (
    <form className="w-full max-w-sm flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center mb-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Vitaj späť</h1>
        <p className="text-sm text-white/60">Prihlás sa do svojho účtu</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-medium text-white/80 uppercase tracking-wider ml-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="meno@priklad.com"
            className={cn(
              'w-full px-4 py-3 rounded-xl outline-none transition-all duration-200',
              'bg-white/5 border border-white/10 text-white placeholder:text-white/30',
              'focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30',
              'hover:bg-white/10 hover:border-white/20',
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium text-white/80 uppercase tracking-wider ml-1"
            >
              Heslo
            </label>
            <a href="#" className="text-xs text-white/50 hover:text-white transition-colors">
              Zabudnuté heslo?
            </a>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className={cn(
              'w-full px-4 py-3 rounded-xl outline-none transition-all duration-200',
              'bg-white/5 border border-white/10 text-white placeholder:text-white/30',
              'focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30',
              'hover:bg-white/10 hover:border-white/20',
            )}
          />
        </div>
      </div>

      <Button className="w-full py-6 text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 bg-white text-black hover:bg-white/90">
        Prihlásiť sa
      </Button>

      <div className="text-center text-sm text-white/50 mt-2">
        Nemáš účet?{' '}
        <a href="#" className="text-white font-semibold hover:underline">
          Registruj sa
        </a>
      </div>
    </form>
  )
}
