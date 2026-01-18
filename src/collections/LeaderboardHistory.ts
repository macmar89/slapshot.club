import { CollectionConfig } from 'payload'

export const LeaderboardHistory: CollectionConfig = {
  slug: 'leaderboard-history',
  admin: {
    useAsTitle: 'id',
    group: 'Analytics',
    defaultColumns: ['date', 'competition', 'user', 'rank', 'points'],
  },
  access: {
    read: ({ req: { user } }) => {
      // User vidí len svoju históriu v danej súťaži
      if (user?.role === 'admin') return true
      return { user: { equals: user?.id } }
    },
    create: () => false, // Len systém
    update: () => false, // História je nemenná
    delete: () => false,
  },
  indexes: [
    { fields: ['competition', 'user', 'date'] }, // Pre vykreslenie grafu usera v súťaži
  ],
  fields: [
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
      name: 'date',
      type: 'date',
      required: true,
      index: true,
    },
    {
      name: 'points',
      type: 'number',
      required: true,
    },
    {
      name: 'rank',
      type: 'number',
      required: true,
    },
    // Voliteľné: Ak chceš graf podľa "Kola" (Round 1, Round 2) namiesto dátumu
    {
      name: 'roundLabel',
      type: 'text', // napr. "Kolo 5" alebo "Semifinále"
    },
  ],
}
