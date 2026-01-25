import { CollectionConfig } from 'payload'
import { createId } from '@paralleldrive/cuid2'

export const LeaderboardEntries: CollectionConfig = {
  slug: 'leaderboard-entries',
  admin: {
    useAsTitle: 'id',
    group: 'Game',
    description: 'Cache pre body používateľov v súťažiach. Nemeniť manuálne!',
  },
  access: {
    read: () => true, // Rebríčky sú verejné
    create: () => false, // Vytvára sa automaticky systémom (Hooks/Actions)
    update: () => false, // Body sa menia len cez vyhodnotenie tipov
  },
  indexes: [
    { fields: ['competition', 'totalPoints'] }, // Pre rýchle triedenie rebríčka
    { fields: ['user', 'competition'], unique: true }, // User môže byť v súťaži len raz
  ],
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
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'competition',
      type: 'relationship',
      relationTo: 'competitions', // <--- Tu je prepojenie na súťaž
      required: true,
    },
    {
      name: 'totalPoints',
      type: 'number',
      defaultValue: 0,
      index: true, // KĽÚČOVÉ pre rýchlosť rebríčkov
      admin: {
        description: 'Aktuálny počet bodov. Prepočítava sa cez hooks pri vyhodnotení zápasu.',
      },
    },
    {
      name: 'totalMatches', // Celkový počet zápasov v tejto sezóne
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        description:
          'Aktuálny počet tipovaných zápasov. Prepočítava sa cez hooks pri vyhodnotení zápasu.',
      },
    },
    {
      name: 'exactGuesses', // Štatistika: Koľko presných výsledkov trafil
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'correctTrends', // Štatistika: Koľko víťazov uhádol (ale nie skóre)
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'correctDiffs', // Štatistika: Koľko rozdielov gólov trafil
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'wrongGuesses', // Štatistika: Koľko tipov bolo úplne mimo (neuhádol ani trend)
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'currentRank',
      type: 'number',
      index: true, // Dôležité pre rýchle hľadanie "Kto je prvý"
      admin: { readOnly: true },
    },
    {
      name: 'previousRank',
      type: 'number',
      admin: { readOnly: true, description: 'Pozícia pri poslednom prepočte (včera/minulé kolo).' },
    },
    {
      name: 'rankChange', // Virtuálne pole (alebo vypočítané pri save), aby frontend nemusel počítať
      type: 'number', // Napr. +3 (posun hore), -1 (posun dole), 0 (rovnako)
      admin: { readOnly: true },
    },
    {
      name: 'activeLeague',
      type: 'relationship',
      relationTo: 'leagues',
      admin: {
        description:
          'Posledná zvolená liga používateľa v tejto súťaži (pre perzistenciu prepínača).',
      },
    },
  ],
}
