import { CollectionConfig } from 'payload'
import { customAlphabet } from 'nanoid'

// Generátor krátkych kódov pre pozvánky (napr. "A7X9P")
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 5)

export const MiniLeagues: CollectionConfig = {
  slug: 'mini-leagues',
  admin: {
    useAsTitle: 'name',
    group: 'Community',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Názov partie',
    },
    {
      name: 'competition',
      type: 'relationship',
      relationTo: 'competitions',
      required: true,
      // Mini-liga je viazaná na konkrétnu súťaž (napr. MS 2026)
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { readOnly: true }, // Vlastník sa nastaví pri vytvorení
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Členovia partie',
    },
    {
      name: 'inviteCode',
      type: 'text',
      unique: true,
      admin: {
        description: 'Kód, ktorý pošleš kamošom, aby sa pridali.',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create') {
              return nanoid() // Automaticky vygeneruje napr. "HK82X"
            }
            return value
          },
        ],
      },
    },
  ],
}
