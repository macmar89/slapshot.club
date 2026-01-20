import { CollectionConfig } from 'payload'
import { createId } from '@paralleldrive/cuid2'

export const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name',
    group: 'Database',
    defaultColumns: ['name', 'shortName', 'type'],
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
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Názov tímu',
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'URL slug (napr. svk-team), voliteľné pre detail tímu.',
      },
    },
    {
      name: 'shortName',
      type: 'text',
      required: true,
      maxLength: 3,
      admin: {
        description: 'Trojmiestna skratka pre scoreboard (napr. SVK, KOS, SLO).',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'club',
      options: [
        { label: 'Klub (Logo) ', value: 'club' },
        { label: 'Národný tím (Vlajka)', value: 'national' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'country',
      type: 'select',
      required: false,
      options: [
        { label: 'Slovensko', value: 'SVK' },
        { label: 'Česko', value: 'CZE' },
        { label: 'USA', value: 'USA' },
        { label: 'Kanada', value: 'CAN' },
      ],
      admin: {
        description: 'Určuje, odkiaľ tím pochádza (nie kde hrá). Boston Bruins = USA.',
      },
    },
    {
      name: 'leagueTags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Tipos Extraliga', value: 'sk' },
        { label: 'NHL', value: 'nhl' },
        { label: 'Česká Extraliga', value: 'cz' },
        { label: 'Medzinárodné', value: 'iihf' },
      ],
      admin: {
        description: 'Pomocné tagy pre ľahšie vyhľadávanie pri vytváraní zápasov.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Logo alebo Vlajka',
    },
    {
      name: 'colors',
      type: 'group',
      label: 'Branding & Vizualizácia',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'primary',
              type: 'text',
              required: true,
              defaultValue: '#000000',
              label: 'Primárna farba (Pozadie)',
              validate: (val: string | string[] | null | undefined) => {
                if (typeof val !== 'string') return 'Musí byť validný HEX kód (napr. #FF0000)'
                // Jednoduchý Regex pre HEX kód (napr. #ffffff)
                const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                if (!regex.test(val)) return 'Musí byť validný HEX kód (napr. #FF0000)'
                return true
              },
            },
            {
              name: 'secondary',
              type: 'text',
              required: true,
              defaultValue: '#ffffff',
              label: 'Sekundárna farba (Text)',
              validate: (val: string | string[] | null | undefined) => {
                if (typeof val !== 'string') return 'Musí byť validný HEX kód'
                const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                if (!regex.test(val)) return 'Musí byť validný HEX kód'
                return true
              },
            },
          ],
        },
      ],
    },
  ],
}
