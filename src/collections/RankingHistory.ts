import { CollectionConfig } from 'payload'

export const RankingHistory: CollectionConfig = {
  slug: 'ranking-history',
  admin: {
    useAsTitle: 'id',
    group: 'Analytics', // Schováme to do samostatnej skupiny
    defaultColumns: ['user', 'date', 'rank', 'points'],
  },
  access: {
    read: ({ req: { user } }) => {
      // User vidí len svoju históriu (pre grafy), Admin všetko
      if (user?.role === 'admin') return true
      return { user: { equals: user?.id } }
    },
    create: () => false, // Vytvára len systém
    update: () => false, // História sa neprepisuje
    delete: () => false,
  },
  indexes: [
    { fields: ['user', 'date'] }, // Pre rýchle načítanie grafu používateľa
  ],
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Deň, ku ktorému sa viaže tento snapshot.',
      },
    },
    {
      name: 'rank',
      type: 'number',
      required: true,
    },
    {
      name: 'points',
      type: 'number',
      required: true,
    },
    // Môžeme pridať aj snapshot pre konkrétnu súťaž, ak chceš graf per liga
    {
      name: 'competition',
      type: 'relationship',
      relationTo: 'competitions',
      required: false, // Ak je prázdne, ide o globálny ranking
    },
  ],
}
