// src/collections/Competitions.ts
import { CollectionConfig } from 'payload'
import { formatSlug } from '../hooks/use-format-slug' // Tvoj custom hook pre auto-generovanie
import { isAdmin } from '../access'
import { createId } from '@paralleldrive/cuid2'

export const Competitions: CollectionConfig = {
  slug: 'competitions',
  admin: { useAsTitle: 'name', group: 'Admin' },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => createId(),
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: { beforeValidate: [formatSlug('name')] }, // Auto-slug z názvu
      admin: { position: 'sidebar' },
    },
    {
      name: 'banner',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: [
        { label: 'Pripravuje sa', value: 'upcoming' },
        { label: 'Aktuálna', value: 'active' },
        { label: 'Ukončená', value: 'finished' },
      ],
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isRegistrationOpen',
      type: 'checkbox',
      label: 'Povoliť registrácie / nákup členstva',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Ak je zapnuté, používatelia sa môžu pridať do súťaže (aj keď je ešte len "upcoming").',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 160,
      label: 'Krátky popis (pre karty súťaží)',
    },
    {
      name: 'requiredTiers',
      type: 'relationship',
      relationTo: 'membership-tiers',
      hasMany: true, // Jedna súťaž môže byť dostupná pre viacero balíkov
      required: true,
      label: 'Vyžadované členstvo',
      admin: {
        description: 'Ktoré úrovne členstva majú prístup do tejto súťaže?',
      },
    },
    {
      name: 'totalPlayedMatches',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
      label: 'Celkový počet odohratých zápasov',
    },
    {
      name: 'totalPossiblePoints',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
      label: 'Počet možných bodov',
    },
    {
      name: 'recalculationHour',
      type: 'number',
      defaultValue: 5,
      min: 0,
      max: 23,
      admin: {
        position: 'sidebar',
        description: 'Hodina (0-23), kedy sa má prepočítať rebríček (default: 5:00).',
      },
    },
    {
      name: 'apiHockeyId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Externé ID súťaže z hokejovej API (ak existuje).',
      },
    },
  ],
}
