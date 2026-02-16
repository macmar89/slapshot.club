# Slapshot Club App

> [!IMPORTANT]
> **MVP Status**: Táto aplikácia je momentálne vo fáze MVP (Minimum Viable Product). Funkcionalita je zameraná na základné funkcie tipovania a komunity.

**Slapshot Club** je webová aplikácia pre hokejovú komunitu, ktorá umožňuje fanúšikom tipovať výsledky zápasov, sledovať rebríčky a zapájať sa do súťaží. Aplikácia je navrhnutá s dôrazom na "mobile-first" zážitok a postavená na moderných webových technológiách.

## 🛠 Technický Stack

Aplikácia využíva robustný stack postavený na Next.js a Payload CMS 3.0.

-   **Frontend & Backend**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
-   **CMS**: [Payload 3.0](https://payloadcms.com/) (Headless CMS integrované priamo v Next.js)
-   **Jazyk**: TypeScript 5
-   **Databáza**: PostgreSQL (via `@payloadcms/db-postgres`)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **UI Komponenty**: Radix UI, Lucide React, Sonner
-   **Validácia**: Zod, React Hook Form
-   **PWA**: [Next PWA](https://github.com/ducanh2912/next-pwa) (Progressive Web App support)
-   **Notifikácie**: [OneSignal](https://onesignal.com/)
-   **Bezpečnosť**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (Anti-bot ochrana)
-   **Internationalizácia (i18n)**: `next-intl`
-   **Dátové úložisko (Media)**: S3 Compatible (Cloudflare R2)
-   **Spracovanie obrázkov**: Sharp
-   **Nasadenie (Deployment)**: VPS (Coolify + Cloudflare Tunnel)

## 🚀 Ako začať (Local Development)

Nasledujte tieto kroky pre spustenie projektu na lokálnom stroji:

### 1. Príprava
Uistite sa, že máte nainštalovaný Node.js (v18+) a `pnpm` (odporúčané).

### 2. Inštalácia závislostí
```bash
pnpm install
```

### 3. Nastavenie prostredia (.env)
Vytvorte súbor `.env` v koreňovom adresári (môžete skopírovať `.env.example`) a vyplňte potrebné premenné

### 4. Spustenie
```bash
npm run dev
```
Aplikácia bude bežať na [http://localhost:3000](http://localhost:3000).
-   **Web**: http://localhost:3000
-   **Admin Panel**: http://localhost:3000/admin

## 📂 Štruktúra Projektu

-   `/src/app`: Next.js App Router (stránky a API routes).
-   `/src/collections`: Definície dátových modelov pre Payload CMS.
-   `/src/components`: Zdieľané UI komponenty.
-   `/src/features`: Logika špecifická pre domény (Auth, Matches, Leaderboard...).
-   `/src/hooks`: Vlastné React hooky.
-   `/src/i18n`: Konfigurácia prekladoch.
-   `/src/messages`: JSON súbory s prekladmi.

## 📜 Skripty

-   `npm run build`: Vytvorí produkčný build aplikácie.
-   `npm run lint`: Skontroluje kód pomocou ESLint.
-   `npm run generate:types`: Vygeneruje TypeScript typy pre Payload kolekcie.
-   `npm run test`: Spustí integračné a E2E testy.
