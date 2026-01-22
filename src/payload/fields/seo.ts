import { Field } from 'payload';

export const seoFields: Field[] = [
  {
    name: 'seo',
    type: 'group',
    label: 'SEO Nastavenia',
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Meta Title',
        minLength: 10,
        maxLength: 60,
        admin: {
          description: 'Ak nevyplníš, použije sa globálny titulok.',
        },
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Meta Description',
        minLength: 50,
        maxLength: 160,
        admin: {
          description: 'Ak nevyplníš, použije sa globálny popis.',
        },
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        label: 'OG Image (Social)',
      },
    ],
  },
];