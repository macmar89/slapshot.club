# Cloudflare Turnstile Integration

Tento plán popisuje kroky potrebné na implementáciu Cloudflare Turnstile na ochranu prihlasovacích a (v budúcnosti) registračných formulárov pred botmi.

## Čo je potrebné (Požiadavky)

Pre implementáciu Turnstile budete potrebovať:

1. **Cloudflare účet**: Ak ho ešte nemáte, vytvorte si ho.
2. **Turnstile Widget**: V Cloudflare dashboarde (Turnstile > Add Site) pridajte svoju doménu a získate:
   - `Site Key` (Verejný, používa sa v kóde na frontende).
   - `Secret Key` (Súkromný, používa sa na overenie na serveri).
3. **Konfigurácia prostredia**: Pridať tieto kľúče do `.env` súboru.

## Kde sa Turnstile používa?

Turnstile sa nepoužíva len pri registrácii. Odporúča sa ho použiť všade, kde hrozí zneužitie botmi:

- **Prihlásenie (Login)**: Ochrana pred brute-force útokmi.
- **Registrácia**: Ochrana pred hromadným vytváraním účtov.
- **Zabudnuté heslo**: Ochrana pred spamovaním e-mailov na obnovu hesla.
- **Kontaktné formuláre / Feedback**: Ochrana pred spamovými správami.

## Navrhované zmeny

### [Component Name]

#### [NEW] [turnstile.ts](file:///Users/marian/Documents/work/apps/slapshot.club/slapshot.club/src/lib/turnstile.ts)

Vytvorenie utility na overenie Turnstile tokenu na strane servera.

#### [MODIFY] [LoginForm.tsx](file:///Users/marian/Documents/work/apps/slapshot.club/slapshot.club/src/features/auth/components/LoginForm.tsx)

Pridanie Turnstile widgetu a zber tokenu pred odoslaním formulára.

#### [MODIFY] [actions.ts](file:///Users/marian/Documents/work/apps/slapshot.club/slapshot.club/src/features/auth/actions.ts)

Úprava `loginUser` akcie, aby prijímala a verifikovala Turnstile token.

## Plán overenia

### Manuálne overenie

- Skúsiť sa prihlásiť bez Turnstile tokenu (malo by zlyhať).
- Skúsiť sa prihlásiť s neplatným Turnstile tokenom (malo by zlyhať).
- Skúsiť úspešné prihlásenie s platným Turnstile tokenom.

### Automatizované testy

- `npm run test` (ak existujú relevantné testy, overiť ich funkčnosť po zmene).
