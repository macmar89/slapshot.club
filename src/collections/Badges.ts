import { CollectionConfig } from 'payload'

export const Badges: CollectionConfig = {
  slug: 'badges',
  admin: {
    useAsTitle: 'name',
    group: 'Gamification',
  },
  access: { read: () => true }, // Verejné, aby sme ich mohli ukázať v zozname "Čo môžeš získať"
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true, // "Sniper" / "Ostreľovač"
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true, // "Traf presný výsledok 3x po sebe."
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'rarity',
      type: 'select',
      options: [
        { label: 'Bežné (Bronze)', value: 'bronze' },
        { label: 'Vzácne (Silver)', value: 'silver' },
        { label: 'Legendárne (Gold)', value: 'gold' },
      ],
    },
    // Technický identifikátor pre kód (aby sme vedeli, kedy ho prideliť)
    {
      name: 'code',
      type: 'text',
      unique: true,
      admin: { description: 'napr. exact_hattrick, supporter_lvl1' },
    },
  ],
}
