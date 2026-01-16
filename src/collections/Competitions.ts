// src/collections/Competitions.ts
import { CollectionConfig } from 'payload';
import { formatSlug } from '../hooks/use-format-slug'; // Tvoj custom hook pre auto-generovanie
import { isAdmin } from '../access';
import { createId } from '@paralleldrive/cuid2';

export const Competitions: CollectionConfig = {
  slug: 'competitions',
  admin: { useAsTitle: 'name', group: 'Admin' },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
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
    { name: 'name', type: 'text', required: true },
    { 
      name: 'slug', 
      type: 'text', 
      unique: true, 
      hooks: { beforeValidate: [formatSlug('name')] }, // Auto-slug z názvu
      admin: { position: 'sidebar' }
    },
    {
      name: 'banner',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: [
        { label: 'Aktuálna', value: 'active' },
        { label: 'Pripravovaná', value: 'upcoming' },
        { label: 'Ukončená', value: 'finished' },
      ],
      required: true,
      admin: { position: 'sidebar' }
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' }
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' }
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'scoringRules',
      type: 'json',
      admin: {
        description: 'Custom scoring rules for this competition. Leave empty for defaults.',
      },
    },
  ],
};