import { CollectionConfig, FieldHook } from 'payload'
import { createId } from '@paralleldrive/cuid2'
import { evaluateMatch, revertMatchEvaluation } from '@/features/matches/utils/evaluation'

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
  endpoints: [
    {
      path: '/:id/recalculate',
      method: 'post',
      handler: async (req) => {
        const id = req.routeParams?.id
        
        // 🔐 Security: Check if user is admin
        const { user } = req
        if (!user || (user as any).role !== 'admin') {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        try {
          req.payload.logger.info(`🔄 Manual recalculation triggered for match ${id} by ${user.email}`)
          // Revert first to clear old points accurately
          await revertMatchEvaluation(id as string, req.payload)
          // Then evaluate with current scores
          await evaluateMatch(id as string, req.payload)
          
          return Response.json({ message: 'Points recalculated successfully' })
        } catch (error: any) {
          req.payload.logger.error(`Manual recalculation failed: ${error.message}`)
          return Response.json({ error: `Recalculation failed: ${error.message}` }, { status: 500 })
        }
      },
    },
  ],
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
          filterOptions: ({ data }: { data: any }) => {
            if (data?.homeTeam) {
              return {
                id: { not_equals: data.homeTeam },
              }
            }
            return true
          },
          validate: (value: any, { data }: { data: any }) => {
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
        position: 'sidebar',
      },
    },
    {
      name: 'result',
      type: 'group',
      label: 'Výsledková tabuľa',
      admin: {
        className: 'match-result-group',
      },
      fields: [
        {
          name: 'stage_type',
          type: 'select',
          required: true,
          defaultValue: 'regular_season',
          label: 'Fáza súťaže',
          options: [
            { label: 'Základná časť (Liga)', value: 'regular_season' },
            { label: 'Skupinová fáza (Turnaj)', value: 'group_phase' },
            { label: 'Play-off / Vyraďovačka', value: 'playoffs' },
            { label: 'Príprava', value: 'pre_season' },
          ],
          admin: {
            description: 'Vyber fázu pre zobrazenie špecifických polí',
          },
        },
        {
          type: 'row',
          admin: {
            condition: (data) => data?.status !== 'scheduled',
          },
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
          name: 'endingType',
          type: 'select',
          defaultValue: 'regular',
          required: true,
          label: 'Spôsob ukončenia zápasu',
          options: [
            { label: 'Riadny hrací čas (60 min)', value: 'regular' },
            { label: 'Po predĺžení (PP)', value: 'ot' },
            { label: 'Po nájazdoch (SN)', value: 'so' },
          ],
          admin: {
            condition: (data) => data?.status !== 'scheduled',
            description: 'Zvoľ, či zápas skončil po 60 minútach, v predĺžení alebo nájazdoch.',
            width: '50%',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'round_label',
              type: 'text',
              label: 'Názov kola / Fázy',
              admin: {
                width: '50%',
                placeholder: 'napr. 39. kolo, Štvrťfinále, Skupina B',
              },
            },
            {
              name: 'round_order',
              type: 'number',
              label: 'Poradie (pre triedenie)',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'group_name',
          type: 'text',
          label: 'Názov skupiny',
          admin: {
            condition: (data) => data?.result?.stage_type === 'group_phase',
            placeholder: 'A, B...',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'series_game_number',
              type: 'number',
              label: 'Číslo zápasu v sérii',
              min: 1,
              max: 7,
              admin: {
                condition: (data) => data?.result?.stage_type === 'playoffs',
                width: '30%',
              },
            },
            {
              name: 'series_state',
              type: 'text',
              label: 'Stav série (Kontext)',
              admin: {
                condition: (data) => data?.result?.stage_type === 'playoffs',
                width: '70%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'recalculatePoints',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/features/matches/components/RecalculateButton',
        },
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        try {
          // 1. STATUS CHANGE: Scheduled/Live -> Finished
          if (doc.status === 'finished' && previousDoc?.status !== 'finished') {
            req.payload.logger.info(`[HOOK] Status changed to FINISHED for: ${doc.displayTitle}`)
            await evaluateMatch(doc.id, req.payload)
            return
          }

          // 2. STATUS CHANGE: Finished -> Anything else (Revert)
          if (previousDoc?.status === 'finished' && doc.status !== 'finished') {
            req.payload.logger.info(`[HOOK] Status changed FROM finished to ${doc.status} for: ${doc.displayTitle}`)
            await revertMatchEvaluation(doc.id, req.payload)
            return
          }

          // 3. SCORE CHANGE while Finished (Revert & Re-evaluate)
          if (doc.status === 'finished' && previousDoc?.status === 'finished') {
             const scoreChanged = 
              doc.result?.homeScore !== previousDoc.result?.homeScore ||
              doc.result?.awayScore !== previousDoc.result?.awayScore ||
              doc.result?.endingType !== previousDoc.result?.endingType ||
              doc.result?.stage_type !== previousDoc.result?.stage_type

             if (scoreChanged) {
               req.payload.logger.info(`[HOOK] Score/Type changed for finished match: ${doc.displayTitle}`)
               await revertMatchEvaluation(doc.id, req.payload)
               await evaluateMatch(doc.id, req.payload)
             }
          }
        } catch (error: any) {
          req.payload.logger.error(`[HOOK ERROR] Failed to process match evaluation: ${error.message}`)
        }
      },
    ],
  },
}
