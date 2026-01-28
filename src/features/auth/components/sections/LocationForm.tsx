'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { MapPin } from 'lucide-react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Button } from '@/components/ui/Button'
import { updateLocationAction } from '@/features/auth/account-actions'

interface LocationFormProps {
  initialCountry: number | { id: number; name: string } | null | undefined
  initialRegion: number | { id: number; name: string } | null | undefined
  initialCustomCountry: string | null | undefined
  countries: Array<{ id: number; name: string; code: string }>
}

export function LocationForm({ initialCountry, initialRegion, initialCustomCountry, countries }: LocationFormProps) {
  const t = useTranslations('Account')
  const commonT = useTranslations('Common')
  // Get initial IDs
  // Get initial IDs
  const initialCountryId = typeof initialCountry === 'object' ? initialCountry?.id : initialCountry
  const initialRegionId = typeof initialRegion === 'object' ? initialRegion?.id : initialRegion

  // Determine initial selected country
  // 1. If we have a country ID, use it.
  // 2. If not, but we have a customCountry, try to find a match in the list by name.
  // 3. If no match found but customCountry exists, default to 'other'.
  // 4. Otherwise null.
  const getInitialSelectedCountry = () => {
    if (initialCountryId) return initialCountryId
    if (initialCustomCountry) {
      const match = countries.find(c => c.name.toLowerCase() === initialCustomCountry.toLowerCase())
      if (match) return match.id
      return 'other'
    }
    return null
  }

  const [selectedCountry, setSelectedCountry] = useState<number | 'other' | null>(getInitialSelectedCountry())
  const [selectedRegion, setSelectedRegion] = useState<number | null>(initialRegionId || null)
  const [availableRegions, setAvailableRegions] = useState<Array<{ id: number; name: string }>>([])
  
  // If we matched a custom country to an ID, we don't need to show it in the custom input anymore.
  const getInitialCustomCountry = () => {
    const calculatedSelectedCountry = getInitialSelectedCountry()
    // If it was mapped to a real ID, clear the custom input
    if (typeof calculatedSelectedCountry === 'number') return ''
    return initialCustomCountry || ''
  }

  const [customCountry, setCustomCountry] = useState(getInitialCustomCountry())
  const [isLocationSubmitting, setIsLocationSubmitting] = useState(false)
  const [isLoadingRegions, setIsLoadingRegions] = useState(false)

  // Fetch regions when country changes (only for SK/CZ)
  useEffect(() => {
    const country = countries.find(c => c.id === selectedCountry)
    const isSkOrCz = country?.code === 'SK' || country?.code === 'CZ'

    if (selectedCountry && isSkOrCz) {
      setIsLoadingRegions(true)
      fetch(`/api/regions?where[country][equals]=${selectedCountry}&limit=100`)
        .then(res => res.json())
        .then(data => {
          setAvailableRegions(data.docs.map((r: any) => ({ id: r.id, name: r.name })))
          setIsLoadingRegions(false)
        })
        .catch(err => {
          console.error('Failed to fetch regions:', err)
          setIsLoadingRegions(false)
        })
    } else {
      setAvailableRegions([])
    }
  }, [selectedCountry, countries])

  const onLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLocationSubmitting(true)
    const countryIdParam = selectedCountry === 'other' ? null : selectedCountry
    const res = await updateLocationAction(countryIdParam, selectedRegion || null, customCountry || null)
    setIsLocationSubmitting(false)
    if (res.ok) {
      toast.success(commonT('success_title'))
      if (selectedCountry === 'other' && customCountry) {
        toast.info(t('location_other_notice'))
      }
    } else {
      toast.error(res.error || commonT('error_generic'))
    }
  }

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:p-8 md:col-span-2">
      <form onSubmit={onLocationSubmit} className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-warning" />
            {t('location_section')}
          </h3>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{t('location_description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('location_country')}</label>
            <select
              value={selectedCountry || ''}
              onChange={(e) => {
                const val = e.target.value === 'other' ? 'other' : (e.target.value ? Number(e.target.value) : null)
                setSelectedCountry(val)
                setSelectedRegion(null) // Reset region when country changes
                if (val !== 'other') setCustomCountry('') // Clear custom country if not 'other'
              }}
              className="w-full px-4 py-2.5 md:py-3 rounded-app bg-white/5 border border-white/10 text-white outline-none focus:border-warning/50 transition-all font-bold text-sm md:text-base"
            >
              <option value="">{t('location_select_country')}</option>
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="other">{t('location_other')}</option>
            </select>
          </div>
          {selectedCountry && countries.find(c => c.id === selectedCountry)?.code && ['SK', 'CZ'].includes(countries.find(c => c.id === selectedCountry)!.code) && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('location_region')}</label>
              <select
                value={selectedRegion || ''}
                onChange={(e) => setSelectedRegion(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 md:py-3 rounded-app bg-white/5 border border-white/10 text-white outline-none focus:border-warning/50 transition-all font-bold text-sm md:text-base"
                disabled={isLoadingRegions}
              >
                <option value="">{isLoadingRegions ? commonT('loading') : t('location_region_placeholder')}</option>
                {availableRegions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}
          {selectedCountry === 'other' && (
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('location_custom_country')}</label>
              <input
                type="text"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                className="w-full px-4 py-2.5 md:py-3 rounded-app bg-white/5 border border-white/10 text-white outline-none focus:border-warning/50 transition-all font-bold text-sm md:text-base"
                placeholder={t('location_custom_country_placeholder')}
              />
              <p className="text-[10px] text-white/30 italic">{t('location_other_hint')}</p>
            </div>
          )}
        </div>

        <Button type="submit" color="warning" className="w-full md:w-auto self-end px-12 bg-warning text-black font-black uppercase italic tracking-widest text-xs md:text-sm h-10 md:h-12" disabled={isLocationSubmitting}>
          {isLocationSubmitting ? commonT('loading') : t('save_button')}
        </Button>
      </form>
    </IceGlassCard>
  )
}
