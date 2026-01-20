import { CollectionConfig, FieldHook } from 'payload'
import { createId } from '@paralleldrive/cuid2'

// -------------------------
// HOOKS LOGIC
// -------------------------

// Helper na generovanie názvu "SVK vs CZE" pre Admin zoznam
const populateDisplayTitle: FieldHook = async ({ data, req }) => {
  // Spustíme len ak máme obe ID a zmenili sa (alebo titul chýba)
  if (data?.homeTeam && data?.awayTeam) {
    try {
      // Paralelný fetch pre rýchlosť
      const [home, away] = await Promise.all([
        req.payload.findByID({ collection: 'teams', id: data.homeTeam }),
        req.payload.findByID({ collection: 'teams', id: data.awayTeam }),
      ])

      if (home && away) {
        // Používame shortName (SVK vs CZE), je to prehľadnejšie ako dlhé názvy
        return `${home.shortName} vs ${away.shortName}`
      }
    } catch (error) {
      console.error('Error fetching teams for title:', error)
    }
  }
  return data?.displayTitle
}

// -------------------------
// COLLECTION CONFIG
// -------------------------

export const Matches: CollectionConfig = {
  slug: 'matches',
  admin: {
    useAsTitle: 'displayTitle',
    defaultColumns: ['displayTitle', 'date', 'status', 'score'], // Score custom field v stĺpci
    group: 'Game',
  },
  access: {
    read: () => true,
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
    {
      name: 'displayTitle',
      type: 'text',
      admin: {
        hidden: true, // V UI to nevidíme, ale v DB to chceme pre vyhľadávanie
      },
      hooks: {
        beforeChange: [populateDisplayTitle],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'competition',
          type: 'relationship',
          relationTo: 'competitions',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'd.M.yyyy HH:mm', // Náš formát dátumu
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'homeTeam',
          type: 'relationship',
          relationTo: 'teams',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'awayTeam',
          type: 'relationship',
          relationTo: 'teams',
          required: true,
          admin: { width: '50%' },
          // UX Vychytávka: Nedovoľ vybrať ten istý tím, čo je Home
          filterOptions: ({ data }) => {
            if (data?.homeTeam) {
              return {
                id: { not_equals: data.homeTeam },
              }
            }
            return true
          },
          validate: (value, { data }) => {
            if (value === data?.homeTeam) {
              return 'Domáci a Hostia nemôžu byť ten istý tím.'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'scheduled',
      required: true,
      options: [
        { label: 'Naplánovaný', value: 'scheduled' },
        { label: 'LIVE (Prebieha)', value: 'live' },
        { label: 'Ukončený (Final)', value: 'finished' },
        { label: 'Zrušený', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar', // Status patrí do sidebaru, nezavadzia v obsahu
      },
    },
    // VÝSLEDKY ZÁPASU
    {
      name: 'result',
      type: 'group',
      label: 'Výsledková tabuľa',
      admin: {
        // Zobrazíme len ak sa už hrá
        condition: (data) => data?.status !== 'scheduled',
        className: 'match-result-group', // Pre prípadné CSS štýlovanie v admine
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'homeScore',
              type: 'number',
              min: 0,
              defaultValue: 0,
              label: 'Domáci (Góly)',
            },
            {
              name: 'awayScore',
              type: 'number',
              min: 0,
              defaultValue: 0,
              label: 'Hostia (Góly)',
            },
          ],
        },
        {
          name: 'endingType', // Premenované z isOvertime, lebo už to nie je áno/nie
          type: 'select',
          defaultValue: 'regular',
          required: true,
          label: 'Spôsob ukončenia zápasu',
          options: [
            {
              label: 'Riadny hrací čas (60 min)',
              value: 'regular',
            },
            {
              label: 'Po predĺžení (PP)',
              value: 'ot', // 'ot' = Overtime (International standard)
            },
            {
              label: 'Po nájazdoch (SN)',
              value: 'so', // 'so' = Shootout (International standard)
            },
          ],
          admin: {
            description: 'Zvoľ, či zápas skončil po 60 minútach, v predĺžení alebo nájazdoch.',
            width: '50%', // Aby to bolo pekne vedľa seba alebo pod skóre
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // TRIGGER PRE VÝPOČET BODOV
        // Spustíme len vtedy, keď sa status zmení na 'finished'
        if (doc.status === 'finished' && previousDoc?.status !== 'finished') {
          req.payload.logger.info(
            `🏁 Zápas ${doc.displayTitle} skončil. Spúšťam vyhodnotenie tipov...`,
          )

          // TODO: Tu zavoláme funkciu: await evaluatePredictions(doc.id, req.payload);
          // Toto je heavy operácia, v produkcii by mala ísť do Background Jobu (Inngest/BullMQ)
        }
      },
    ],
  },
}
