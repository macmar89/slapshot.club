import { CollectionConfig } from 'payload'

export const Predictions: CollectionConfig = {
  slug: 'predictions',
  admin: {
    useAsTitle: 'id',
    group: 'Game',
    defaultColumns: ['user', 'match', 'homeData', 'awayData', 'points'],
  },
  access: {
    // User vidí len svoje tipy, Admin všetky
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { user: { equals: user?.id } }
    },
    // Vytvoriť tip môže len prihlásený user
    create: ({ req: { user } }) => !!user,
    // Upraviť tip môže user len kým nezačal zápas (rieši hook nižšie)
    update: ({ req: { user } }) => !!user,
  },
  indexes: [
    { fields: ['user', 'match'], unique: true }, // Jeden user = jeden tip na zápas
    { fields: ['match'] }, // Pre rýchle vyhodnotenie všetkých tipov zápasu
  ],
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: { readOnly: true }, // User sa priradí automaticky
    },
    {
      name: 'match',
      type: 'relationship',
      relationTo: 'matches',
      required: true,
      hasMany: false,
    },
    // TIPOVANÉ HODNOTY
    {
      type: 'row',
      fields: [
        {
          name: 'homeGoals',
          type: 'number',
          required: true,
          min: 0,
          label: 'Tip Domáci',
        },
        {
          name: 'awayGoals',
          type: 'number',
          required: true,
          min: 0,
          label: 'Tip Hostia',
        },
      ],
    },
    // VÝSLEDOK TIPOVAČKY (Vyplní systém)
    {
      name: 'points',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, description: 'Body pridelené po vyhodnotení.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Čaká na zápas', value: 'pending' },
        { label: 'Vyhodnotené', value: 'evaluated' },
        { label: 'Zrušené', value: 'void' }, // Ak sa zápas zruší
      ],
      admin: { readOnly: true },
    },
    {
      name: 'editCount',
      type: 'number',
      defaultValue: 1, // Pri vytvorení je to 1. pokus
      admin: {
        readOnly: true, // User ani Admin to nemôžu prepísať ručne
        position: 'sidebar',
        description: 'Koľkokrát používateľ uložil/zmenil tento tip.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          // Automaticky priradíme usera, ak chýba (pre bezpečnosť)
          if (!data?.user && req.user) {
            data.user = req.user.id
          }
        }

        // KONTROLA ČASU: Nedovoľ tipovať po začiatku zápasu
        if (data?.match) {
          const match = await req.payload.findByID({
            collection: 'matches',
            id: data.match,
          })

          if (match) {
            const now = new Date()
            const matchDate = new Date(match.date)

            // Ak je zápas už "live" alebo skončil, alebo je čas > dátum zápasu
            if (now >= matchDate || match.status !== 'scheduled') {
              throw new Error('Tento zápas už začal, nie je možné pridať alebo meniť tip.')
            }
          }
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // 1. Pri vytvorení nového tipu
        if (operation === 'create') {
          data.editCount = 1
        }

        // 2. Pri úprave existujúceho tipu
        if (operation === 'update' && originalDoc) {
          // Skontrolujeme, či sa reálne zmenilo skóre
          // (Payload posiela v 'data' len to, čo sa zmenilo, alebo všetko, záleží od frontendu.
          //  Pre istotu porovnávame existenciu hodnoty v 'data' s 'originalDoc')

          const newHome = data.homeGoals ?? originalDoc.homeGoals
          const newAway = data.awayGoals ?? originalDoc.awayGoals

          const hasChanged = newHome !== originalDoc.homeGoals || newAway !== originalDoc.awayGoals

          if (hasChanged) {
            // Vezmeme starý count (alebo 1 ak neexistoval) a zvýšime
            const currentCount = originalDoc.editCount || 1
            data.editCount = currentCount + 1
          }
        }

        return data
      },
    ],
  },
}
