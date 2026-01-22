import { GlobalConfig } from 'payload';
import { seoFields } from '@/payload/fields/seo';

export const GeneralSettings: GlobalConfig = {
  slug: 'general-settings',
  label: 'Nastavenia Webu',
  access: {
    read: () => true, // Verejné pre Next.js server
  },
  fields: [
    ...seoFields,
  ],
};