import { CollectionConfig } from 'payload'
import { createId } from '@paralleldrive/cuid2'

export const CompetitionSnapshots: CollectionConfig = {
  slug: 'competition-snapshots',
  admin: {
    useAsTitle: 'id',
    group: 'Game',
    description: 'História bodov a poradia pre grafy.',
  },
  access: {
    read: () => true,
    create: () => false, // Vytvára sa automaticky systémom (Hooks/Actions)
    update: () => false,
    delete: () => false,
  },
  indexes: [{ fields: ['competition', 'date'] }, { fields: ['user', 'competition'] }],
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
    {
      name: 'competition',
      type: 'relationship',
      relationTo: 'competitions',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'rank', // Poradie
      type: 'number',
      required: true,
    },
    {
      name: 'ovr',
      type: 'number',
      required: true,
    },
    {
      name: 'points', // Počet bodov
      type: 'number',
      required: true,
    },
    {
      name: 'exactGuesses', // Počet presne uhádnutých zápasov
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'winnerDiff', // Víťaz + rozdiel
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'winner', // Víťaz
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'adjacent', // Tipy vedľa
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'totalTips', // Počet tipov
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'date', // Dátum
      type: 'date',
      required: true,
    },
  ],
}
