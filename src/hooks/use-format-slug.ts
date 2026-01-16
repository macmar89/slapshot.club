// src/hooks/formatSlug.ts
import type { FieldHook } from 'payload'

/**
 * Utility funkcia na premenu stringu na slug.
 * Odstraňuje diakritiku, špeciálne znaky a nahrádza medzery pomlčkami.
 */
const format = (val: string): string =>
  val
    .normalize('NFD') // Rozloží znaky s diakritikou (č -> c + ˇ)
    .replace(/[\u0300-\u036f]/g, '') // Odstráni diakritické znamienka
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Všetko čo nie je písmeno alebo číslo nahradí pomlčkou
    .replace(/(^-|-$)+/g, '') // Odstráni pomlčky na začiatku a na konci

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    // 1. Ak už používateľ manuálne zadal slug, použijeme ten (formátovaný)
    if (typeof value === 'string' && value.length > 0) {
      return format(value)
    }

    // 2. Pri vytváraní (create) alebo ak je slug prázdny, generujeme z fallback poľa (napr. title)
    if (operation === 'create' || !value) {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }