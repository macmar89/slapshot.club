import { CollectionConfig, Access } from 'payload'
import { createId } from '@paralleldrive/cuid2'

// Limity definované ako konštanty pre ľahkú zmenu v budúcnosti
const LIMITS = {
  createdPrivate: 3,
  joinedPrivate: 5,
  maxMembersPrivate: 30,
}

const canCreateLeague: Access = async ({ req: { user, payload }, data }) => {
  if (!user) return false

  // Admin môže čokoľvek
  if (user.roles?.includes('admin')) return true

  // Ak chce vytvoriť PUBLIC ligu, musí byť admin (už sme checkli hore, ale pre istotu)
  if (data?.type === 'public') {
    return false
  }

  // Ak chce vytvoriť PRIVATE ligu, skontrolujeme limity
  if (data?.type === 'private' || !data?.type) {
    const existingLeagues = await payload.find({
      collection: 'leagues',
      where: {
        and: [{ commissioner: { equals: user.id } }, { type: { equals: 'private' } }],
      },
      limit: 0, // Len spočítame
    })

    return existingLeagues.totalDocs < LIMITS.createdPrivate
  }

  return true
}

export const Leagues: CollectionConfig = {
  slug: 'leagues',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'commissioner', 'stats.memberCount', 'createdAt'],
  },
  access: {
    // Čítať môže každý prihlásený (aby si našiel ligu), ale detaily len členovia (riešené na FE alebo cez access funkciu)
    read: ({ req: { user } }) => !!user,
    // Vytvoriť môže len prihlásený user
    create: ({ req: { user } }) => !!user,
    // Upraviť môže len Commissioner (zakladateľ) alebo Admin
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true

      return {
        commissioner: {
          equals: user.id,
        },
      }
    },
    // Zmazať môže len Admin (aby sa nestrácali dáta)
    delete: ({ req: { user } }) => user?.role === 'admin' || false,
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
      name: 'name',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 30, // Aby nám to nerozbilo UI na mobile
      index: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Súkromná (Private)', value: 'private' },
        { label: 'Verejná (Public)', value: 'public' },
      ],
      defaultValue: 'private',
      required: true,
      admin: {
        description: 'Verejné ligy sa nepočítajú do limitov užívateľov.',
      },
    },
    {
      name: 'code',
      type: 'text',
      unique: true, // Kritické pre rýchle vyhľadávanie pri vstupe do ligy
      admin: {
        description: 'Unikátny kód na pozývanie (napr. PUK-XYZ)',
        readOnly: true, // Generuje sa automaticky
      },
    },
    {
      name: 'commissioner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        readOnly: true, // Vlastník sa nemení (iba admin cez DB zásah)
      },
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      // 🛡️ KRITICKÁ VALIDÁCIA
      validate: async (userIds, { data, req, payload, operation }) => {
        // Ak ide o public ligu, neriešime limity tu (môžu byť riešené inde alebo neobmedzené)
        if ((data as any)?.type === 'public') return true

        const targetMax = data?.maxMembers || LIMITS.maxMembersPrivate

        // 1. Kontrola kapacity ligy
        if (Array.isArray(userIds) && userIds.length > targetMax) {
          return `Liga je plná (max ${targetMax} hráčov).`
        }

        // 2. Kontrola limitov pre užívateľov (max 5 privátnych líg)
        // Pri create/update kontrolujeme novopridaných užívateľov
        if (Array.isArray(userIds) && payload) {
          // Musíme zistiť, kto bol pridaný (ak je to update)
          // Alebo jednoducho skontrolovať všetkých, čo je istejšie
          for (const userId of userIds) {
            const joinedPrivateLeagues = await payload.find({
              collection: 'leagues',
              where: {
                and: [{ type: { equals: 'private' } }, { members: { contains: userId } }],
              },
              limit: 0,
            })

            // Ak už je v 5 ligách a táto liga medzitým nie je jedna z nich (pri update)
            // Pri update musíme započítať, že už tam je.
            // Zjednodušene: ak totalDocs >= 5 a userId už v tejto lige nie je členom (pri update), tak stop.

            // Táto validácia je drahá (N dotazov), ideálne by bolo kontrolovať len pridávaného usera v Server Action.
            // Ale ak to chceme v CMS, tak aspoň základný check:
            if (joinedPrivateLeagues.totalDocs >= LIMITS.joinedPrivate) {
              // Musíme overiť, či už v TEJTO lige nie je členom (potom je to OK, len update ostatných dát)
              // Ale v `validate` nemáme prístup k pôvodnému dokumentu ľahko bez ďalšieho await payload.findByID
              // Pre zjednodušenie to necháme takto a odporúčaný join flow bude cez Server Action.
            }
          }
        }

        return true
      },
    },
    {
      name: 'maxMembers',
      type: 'number',
      defaultValue: LIMITS.maxMembersPrivate,
      required: true,
      admin: {
        description: 'Maximálny počet členov. Pre Public ligy zvýšiť manuálne.',
      },
      validate: (val: number | null | undefined, { data }: { data: any }) => {
        if (data?.type === 'private' && val && val > LIMITS.maxMembersPrivate) {
          return `Súkromná liga môže mať maximálne ${LIMITS.maxMembersPrivate} hráčov.`
        }
        return true
      },
    },
    // 🛡️ ANTI-CHEATING FIELD
    {
      name: 'historicalMembers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        description: 'Hráči, ktorí ligu opustili, ale ich body sa stále rátajú do priemeru sezóny.',
        readOnly: true, // Manuálne sa nemení, plní to logika
      },
    },
    // CACHED STATS (Pre výkon - vypočítané CRON jobom)
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'averageScore',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'totalScore',
          type: 'number', // Pre rebríček líg
          defaultValue: 0,
        },
        {
          name: 'memberCount',
          type: 'number',
          defaultValue: 1, // Zakladateľ je vždy člen
        },
        {
          name: 'rank', // Poradie ligy v globálnom rebríčku
          type: 'number',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req, originalDoc }) => {
        const { payload, user } = req

        // 1. Automatické generovanie invite kódu pri vytvorení
        if (operation === 'create') {
          // Generujeme krátky kód z cuid2
          data.code = `LIGA-${createId().substring(0, 6).toUpperCase()}`

          // Nastavíme zakladateľa (commissioner) automaticky z req.user
          if (user) {
            data.commissioner = user.id
            // Pridáme zakladateľa aj do members, ak tam nie je
            if (!data.members) data.members = []
            if (!data.members.includes(user.id)) {
              data.members.push(user.id)
            }
          }
        }

        // 2. Kontrola limitov pri pridávaní členov
        if (data.members && Array.isArray(data.members)) {
          const newMembers =
            operation === 'create'
              ? data.members
              : data.members.filter((id: string) => !originalDoc?.members?.includes(id))

          for (const memberId of newMembers) {
            const joinedPrivateLeagues = await payload.find({
              collection: 'leagues',
              where: {
                and: [{ type: { equals: 'private' } }, { members: { contains: memberId } }],
              },
              limit: 0,
            })

            if (joinedPrivateLeagues.totalDocs >= LIMITS.joinedPrivate && data.type === 'private') {
              throw new Error(
                `Užívateľ ${memberId} je už v maximálnom počte privátnych líg (${LIMITS.joinedPrivate}).`,
              )
            }
          }
        }

        // 3. Aktualizácia memberCount
        if (data.members) {
          if (!data.stats) data.stats = {}
          data.stats.memberCount = data.members.length
        }

        return data
      },
    ],
  },
}
