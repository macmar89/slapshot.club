import type { CollectionConfig } from 'payload'
import { createId } from '@paralleldrive/cuid2'

export const Badges: CollectionConfig = {
  slug: 'badges',
  admin: {
    useAsTitle: 'name',
    group: 'Database',
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
       name: 'slug',
       type: 'text',
       required: true,
       unique: true,
       admin: {
         description: 'Unikátny identifikátor pre systémové prideľovanie (napr. beta-tester, referral-1)',
       }
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
       name: 'description',
       type: 'textarea',
       localized: true,
       admin: {
         description: 'Podmienky získania odznaku',
       }
    },
    {
      name: 'iconType',
      type: 'select',
      defaultValue: 'lucide',
      options: [
        { label: 'Lucide Icon', value: 'lucide' },
        { label: 'Upload (Media)', value: 'upload' },
      ],
    },
    {
      name: 'iconLucide',
      type: 'text',
      admin: {
        condition: (data) => data?.iconType === 'lucide',
        description: 'Názov ikonky z lucide-react',
      },
    },
    {
      name: 'iconMedia',
      type: 'relationship',
      relationTo: 'badge-media',
      admin: {
        condition: (data) => data?.iconType === 'upload',
      },
    },
    {
      name: 'weight',
      type: 'number',
      min: 1,
      max: 10,
      defaultValue: 1,
      admin: {
        description: 'Váha pre výpočet prestíže (1-10)',
      },
    },
    {
      name: 'rarity',
      type: 'select',
      defaultValue: 'bronze',
      options: [
        { label: 'Bronze', value: 'bronze' },
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' },
        { label: 'Platinum', value: 'platinum' },
      ],
    },
    {
      name: 'isAutomatic',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Určuje, či ho prideľuje systém automaticky',
      },
    },
  ],
}
