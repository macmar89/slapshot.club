'use client'

import React, { useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | null
  availableDates: string[]
  onSelectDate: (date: string) => void
}

export function CalendarDialog({
  isOpen,
  onClose,
  selectedDate,
  availableDates,
  onSelectDate,
}: CalendarDialogProps) {
  // Extract months that have matches
  const activeMonths = useMemo(() => {
    const months = new Set<string>()
    availableDates.forEach((date) => {
      const d = new Date(date)
      months.add(`${d.getFullYear()}-${d.getMonth()}`)
    })
    return Array.from(months).sort()
  }, [availableDates])

  const [currentMonthIndex, setCurrentMonthIndex] = React.useState(0)

  // Initialize month index based on selected date or first available date
  React.useEffect(() => {
    if (selectedDate && isOpen) {
      const d = new Date(selectedDate)
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`
      const index = activeMonths.indexOf(monthKey)
      if (index !== -1) setCurrentMonthIndex(index)
    }
  }, [selectedDate, isOpen, activeMonths])

  const currentMonthKey = activeMonths[currentMonthIndex]
  const [year, month] = currentMonthKey
    ? currentMonthKey.split('-').map(Number)
    : [new Date().getFullYear(), new Date().getMonth()]

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 is Sunday

  // Adjust for Monday start (Slovak style)
  // 0 (Sun) -> 6, 1 (Mon) -> 0, 2 (Tue) -> 1, ...
  const adjustedFirstDay = (firstDayOfMonth + 6) % 7

  const monthName = new Date(year, month).toLocaleDateString('sk-SK', {
    month: 'long',
    year: 'numeric',
  })

  const calendarDays = useMemo(() => {
    const days = []
    // Padding for start of month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null)
    }
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({
        day: i,
        dateStr,
        hasMatches: availableDates.includes(dateStr),
        isSelected: selectedDate === dateStr,
      })
    }
    return days
  }, [year, month, adjustedFirstDay, daysInMonth, availableDates, selectedDate])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] bg-[#0c0f14]/95 backdrop-blur-3xl border-white/10 text-white rounded-[2rem] p-6 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Abstract Background Decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#eab308]/10 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-black uppercase tracking-widest text-[#eab308]">
            Vyber dátum
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6 bg-white/5 p-2 rounded-xl border border-white/10">
            <button
              onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentMonthIndex === 0}
              className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-black uppercase tracking-widest text-sm text-white">
              {monthName}
            </span>
            <button
              onClick={() =>
                setCurrentMonthIndex((prev) => Math.min(activeMonths.length - 1, prev + 1))
              }
              disabled={currentMonthIndex === activeMonths.length - 1}
              className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((d) => (
              <div
                key={d}
                className="text-center text-[0.6rem] font-black uppercase text-white/30 py-2"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-10" />

              const isToday = day.dateStr === new Date().toISOString().split('T')[0]

              return (
                <button
                  key={day.dateStr}
                  disabled={!day.hasMatches}
                  onClick={() => {
                    onSelectDate(day.dateStr)
                    onClose()
                  }}
                  className={cn(
                    'h-10 w-full flex flex-col items-center justify-center rounded-xl transition-all duration-300 relative group',
                    day.isSelected
                      ? 'bg-[#eab308] text-black font-black scale-110 shadow-[0_5px_15px_rgba(234,179,8,0.3)] z-10'
                      : day.hasMatches
                        ? 'bg-white/5 hover:bg-white/20 text-white'
                        : 'opacity-10 cursor-not-allowed text-white/40',
                  )}
                >
                  <span className="text-xs">{day.day}</span>
                  {day.hasMatches && !day.isSelected && (
                    <div className="w-1 h-1 rounded-full bg-[#eab308]/50 absolute bottom-1.5" />
                  )}
                  {isToday && !day.isSelected && (
                    <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-blue-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
