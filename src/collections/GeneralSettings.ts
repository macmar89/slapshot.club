import { GlobalConfig } from 'payload';
import { seoFields } from '@/payload/fields/seo';
import { 
  lexicalEditor, 
  FixedToolbarFeature, 
  HeadingFeature, 
  OrderedListFeature, 
  UnorderedListFeature 
} from '@payloadcms/richtext-lexical';

export const GeneralSettings: GlobalConfig = {
  slug: 'general-settings',
  label: 'Nastavenia Webu',
  access: {
    read: () => true, // Verejné pre Next.js server
  },
  fields: [
    ...seoFields,
    {
      name: 'gdpr',
      label: 'GDPR',
      type: 'group',
      fields: [
        {
          name: 'content',
          label: 'Obsah',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              FixedToolbarFeature(),
              HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
              OrderedListFeature(),
              UnorderedListFeature(),
            ],
          }),
        },
      ],
    },
  ],
};