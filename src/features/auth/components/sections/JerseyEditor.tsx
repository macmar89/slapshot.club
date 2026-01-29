'use client'

import React, { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Shirt, Save, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { updateJerseyAction } from '@/features/auth/account-actions'
import { toast } from 'sonner'
import { JerseyAvatar, JerseyPattern, JerseyStyle } from '../JerseyAvatar'
import { cn } from '@/lib/utils'

interface JerseyEditorProps {
  initialJersey?: {
    primaryColor?: string
    secondaryColor?: string
    pattern?: string
    number?: string
    style?: string
  }
}

const COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#f97316', // Orange
  '#a855f7', // Purple
  '#000000', // Black
  '#ffffff', // White
  '#64748b', // Slate
  '#0f172a', // Navy
]

const PATTERNS: { value: JerseyPattern }[] = [
  { value: 'stripes' },
  { value: 'bands' },
  { value: 'plain' },
  { value: 'chevrons' },
  { value: 'hoops' },
]

import { IceGlassCard } from '@/components/ui/IceGlassCard'

export function JerseyEditor({ initialJersey }: JerseyEditorProps) {
  const t = useTranslations('Jersey')
  const [isPending, startTransition] = useTransition()
  
  const [jersey, setJersey] = useState({
    primaryColor: initialJersey?.primaryColor || '#ef4444',
    secondaryColor: initialJersey?.secondaryColor || '#ffffff',
    pattern: (initialJersey?.pattern as JerseyPattern) || 'stripes',
    number: initialJersey?.number || '10',
    style: (initialJersey?.style as JerseyStyle) || 'classic',
  })

  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field: string, value: any) => {
    setJersey(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateJerseyAction({
        primaryColor: jersey.primaryColor,
        secondaryColor: jersey.secondaryColor,
        pattern: jersey.pattern,
        number: jersey.number,
        style: jersey.style
      })

      if (result.ok) {
        toast.success(t('success'))
        setHasChanges(false)
      } else {
        toast.error(t('error') + ': ' + result.error)
      }
    })
  }

  return (
    <IceGlassCard backdropBlur="md" className="md:col-span-2 overflow-hidden flex flex-col md:flex-row shadow-xl p-0 border border-white/10">
      {/* Visual Preview Area */}
      <div className="relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent md:w-1/3 border-b md:border-b-0 md:border-r border-white/10">
         <div className="scale-125 md:scale-150 transform transition-transform duration-500 hover:rotate-2">
            <JerseyAvatar 
              {...jersey} 
              size={180}
              className="drop-shadow-2xl"
            />
         </div>
         <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 text-warning/80">
                <Shirt className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">{t('title')}</span>
            </div>
         </div>
      </div>

      {/* Controls Area */}
      <div className="p-6 md:p-8 flex-1 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Colors */}
            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/40">{t('colors_title')}</h3>
                <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-white/60">{t('primary')}</span>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => handleChange('primaryColor', c)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                                        jersey.primaryColor === c ? "border-white scale-110 shadow-lg" : "border-white/10"
                                    )}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-white/60">{t('secondary')}</span>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => handleChange('secondaryColor', c)}
                                    className={cn(
                                        "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                                        jersey.secondaryColor === c ? "border-white scale-110 shadow-lg" : "border-white/10"
                                    )}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Config */}
            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/40">{t('design_title')}</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/60">{t('pattern')}</label>
                        <div className="flex flex-wrap gap-2">
                            {PATTERNS.map(p => (
                                <button
                                    key={p.value}
                                    onClick={() => handleChange('pattern', p.value)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                                        jersey.pattern === p.value 
                                            ? "bg-white text-black border-white" 
                                            : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    {t(`patterns.${p.value}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-24">
                             <label className="text-[10px] font-bold text-white/60 block mb-1">{t('number')}</label>
                             <input 
                                value={jersey.number}
                                onChange={(e) => {
                                    if (e.target.value.length <= 2) {
                                        handleChange('number', e.target.value)
                                    }
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-center font-black text-lg outline-none focus:border-warning/50 transition-all placeholder:text-white/20"
                                placeholder="10"
                             />
                        </div>
                        <div className="flex-1 space-y-2">
                             <label className="text-[10px] font-bold text-white/60 block mb-1">{t('style')}</label>
                             <div className="flex gap-2">
                                <button 
                                    onClick={() => handleChange('style', 'classic')}
                                    className={cn("flex-1 py-1 rounded-lg text-[10px] font-bold uppercase border transition-all",
                                        jersey.style === 'classic' ? "bg-white text-black border-white" : "bg-white/5 border-white/10"
                                    )}
                                >
                                    {t('styles.classic')}
                                </button>
                                <button 
                                    onClick={() => handleChange('style', 'modern')}
                                    className={cn("flex-1 py-1 rounded-lg text-[10px] font-bold uppercase border transition-all",
                                        jersey.style === 'modern' ? "bg-white text-black border-white" : "bg-white/5 border-white/10"
                                    )}
                                >
                                    {t('styles.modern')}
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
            <Button 
                onClick={handleSave} 
                className="w-full md:w-auto px-8 bg-warning text-black font-black uppercase italic tracking-widest text-xs md:text-sm"
                color="warning"
                disabled={!hasChanges || isPending}
            >
                {isPending ? (
                    <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t('saving')}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        <span>{t('save')}</span>
                    </div>
                )}
            </Button>
        </div>
      </div>
    </IceGlassCard>
  )
}
