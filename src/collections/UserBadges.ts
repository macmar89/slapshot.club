import { CollectionConfig } from 'payload'

export const UserBadges: CollectionConfig = {
  slug: 'user-badges', // V URL /api/user-badges
  admin: {
    useAsTitle: 'id',
    group: 'Gamification',
    defaultColumns: ['user', 'badge', 'earnedAt', 'isSeen'],
    description: 'Zoznam udelených odznakov používateľom.',
  },
  access: {
    // User vidí len svoje odznaky
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { user: { equals: user?.id } }
    },
    create: () => false, // Vytvára len systém (backend logika)
    update: () => false, // Odznaky sa nemenia
    delete: ({ req: { user } }) => (user as any)?.role === 'admin', // Len admin môže odobrať omylom
  },
  indexes: [
    { fields: ['user', 'badge'], unique: true }, // User môže mať jeden typ odznaku len raz (ak to tak chceš)
    { fields: ['user', 'isSeen'] }, // Pre rýchle zobrazenie notifikácie "Nový odznak!"
  ],
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'badge',
      type: 'relationship',
      relationTo: 'badges', // Odkaz na definíciu odznaku (názov, ikona)
      required: true,
      hasMany: false,
    },
    {
      name: 'earnedAt',
      type: 'date',
      defaultValue: () => new Date(), // Automaticky aktuálny čas
      required: true,
      admin: {
        readOnly: true,
      },
    },
    // UX FEATURE: Notifikácia o novom odznaku
    {
      name: 'isSeen',
      type: 'checkbox',
      defaultValue: false,
      label: 'Videl už používateľ tento odznak?',
      admin: {
        description: 'Ak je false, front-end zobrazí vyskakovacie okno (Modal).',
      },
    },
    // Voliteľné: Kontext (Za čo to dostal?)
    {
      name: 'context',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        {
          name: 'match', // Ak to bolo za konkrétny zápas (napr. Hattrick v tipovaní)
          type: 'relationship',
          relationTo: 'matches',
          required: false,
        },
        {
          name: 'competition', // Ak to bolo za umiestnenie v lige
          type: 'relationship',
          relationTo: 'competitions',
          required: false,
        },
      ],
    },
  ],
}
