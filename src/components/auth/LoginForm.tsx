import React from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const LoginForm = () => {
  return (
    <form className="w-full max-w-sm flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center mb-4">
        <h2 className="text-2xl font-bold text-white tracking-tighter uppercase">Vitaj späť</h2>
        <p className="text-sm text-white/40 font-medium">Pokračuj vo svojej víťaznej ceste</p>
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

      <Button color="gold" className="w-full py-6 text-lg">
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
