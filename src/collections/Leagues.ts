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
  if ((user as any).role === 'admin') return true

  // Ak chce vytvoriť PUBLIC ligu, musí byť admin
  if (data?.type === 'public') {
    return false
  }

  // Ak chce vytvoriť PRIVATE ligu, skontrolujeme limity
  if (data?.type === 'private' || !data?.type) {
    const existingLeagues = await payload.find({
      collection: 'leagues',
      where: {
        and: [{ owner: { equals: user.id } }, { type: { equals: 'private' } }],
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
    defaultColumns: ['name', 'owner', 'stats.memberCount', 'createdAt'],
  },
  access: {
    // Čítať môže každý prihlásený (aby si našiel ligu)
    read: ({ req: { user } }) => !!user,
    // Vytvoriť môže len prihlásený user
    create: canCreateLeague,
    // Upraviť môže len Owner (zakladateľ) alebo Admin
    update: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'admin') return true

      return {
        owner: {
          equals: user.id,
        },
      }
    },
    // Zmazať môže len Admin
    delete: ({ req: { user } }) => (user as any)?.role === 'admin' || false,
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
      maxLength: 30,
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
      unique: true,
      index: true,
      admin: {
        description: 'Unikátny kód na pozývanie (napr. PUK-XYZ)',
        readOnly: true,
      },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      validate: async (userIds, { data, req }) => {
        const dataAny = data as any
        // Ak ide o public ligu, neriešime limity
        if (dataAny?.type === 'public') return true

        const targetMax = dataAny?.maxMembers || LIMITS.maxMembersPrivate

        // 1. Kontrola kapacity ligy
        if (Array.isArray(userIds) && userIds.length > targetMax) {
          return `Liga je plná (max ${targetMax} hráčov).`
        }

        // Poznámka: Komplexnú validáciu max 5 joined líg pre každého člena
        // je lepšie riešiť v Server Actions kvôli výkonu, ale basic check tu nezaškodí.

        return true
      },
    },
    {
      name: 'competition',
      type: 'relationship',
      relationTo: 'competitions',
      required: true,
      index: true,
      admin: {
        readOnly: true, // Typically set on creation
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
    },
    // Cached Stats for Leaderboards
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
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'memberCount',
          type: 'number',
          defaultValue: 1,
        },
        {
          name: 'rank',
          type: 'number',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        const { user } = req

        if (operation === 'create') {
          // 1. Generovanie Invite kódu
          // PUK-xxxx
          if (!data.code) {
            data.code = `PUK-${createId().substring(0, 4).toUpperCase()}`
          }

          // 2. Nastavenie Ownera
          if (user) {
            data.owner = user.id
            // Pridať ownera do members
            if (!data.members) data.members = []
            if (!data.members.includes(user.id)) {
              data.members.push(user.id)
            }
          }
        }

        // 3. Update memberCount
        if (data.members && Array.isArray(data.members)) {
          if (!data.stats) data.stats = {}
          data.stats.memberCount = data.members.length
        }

        return data
      },
    ],
  },
}
