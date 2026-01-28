# Slapshot Club App

**Slapshot Club** je webová aplikácia pre hokejovú komunitu, ktorá umožňuje fanúšikom tipovať výsledky zápasov, sledovať rebríčky a zapájať sa do súťaží. Aplikácia je navrhnutá s dôrazom na "mobile-first" zážitok a postavená na moderných webových technológiách.

## 🛠 Technický Stack

Aplikácia využíva robustný stack postavený na Next.js a Payload CMS 3.0 (Beta).

-   **Frontend & Backend**: [Next.js 15](https://nextjs.org/) (App Router)
-   **CMS**: [Payload 3.0](https://payloadcms.com/) (Headless CMS integrované priamo v Next.js)
-   **Jazyk**: TypeScript 5
-   **Databáza**: PostgreSQL (via `@payloadcms/db-postgres`)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **UI Komponenty**: Radix UI, Lucide React
-   **Validácia**: Zod, React Hook Form
-   **Internationalizácia (i18n)**: `next-intl`
-   **Dátové úložisko (Media)**: S3 Compatible (Cloudflare R2)
-   **Testovanie**: Vitest (Unit/Integration), Playwright (E2E)
-   **Nasadenie (Deployment)**: Vercel

## ⏱️ Cron Endpointy

Aplikácia používa Vercel Cron na automatizáciu úloh. Endpointy sú chránené pomocou `CRON_SECRET`.

### 1. Aktualizácia Zápasov
-   **URL**: `/api/cron/update-matches`
-   **Frekvencia**: Každých 5 minút
-   **Popis**: Kontroluje všetky zápasy so stavom `scheduled`. Ak aktuálny čas (`NOW`) prekročí čas začiatku zápasu (`date`), status zápasu sa automaticky zmení na `live`.
-   **Dôvod**: Zabezpečuje, aby používatelia nemohli pridávať alebo upravovať svoje tipy po tom, čo zápas reálne začal.

## 🚀 Ako začať (Local Development)

Nasledujte tieto kroky pre spustenie projektu na lokálnom stroji:

### 1. Príprava
Uistite sa, že máte nainštalovaný Node.js (v18+) a `npm` alebo `pnpm`.

### 2. Inštalácia závislostí
```bash
npm install
# alebo
pnpm install
```

### 3. Nastavenie prostredia (.env)
Vytvorte súbor `.env` v koreňovom adresári (môžete skopírovať `.env.example`) a vyplňte potrebné premenné:
-   `DATABASE_URL`: URL k vašej PostgreSQL databáze.
-   `PAYLOAD_SECRET`: Náhodný reťazec pre zabezpečenie Payload CMS.
-   `CRON_SECRET`: Tajný kľúč pre zabezpečenie cron endpointov.
-   Ďalšie kľúče pre S3, Auth a pod.

### 4. Spustenie
```bash
npm run dev
```
Aplikácia bude bežať na [http://localhost:3000](http://localhost:3000).
-   **Web**: http://localhost:3000
-   **Admin Panel**: http://localhost:3000/admin

## 📂 Štruktúra Projektu

-   `/src/app`: Next.js App Router (stránky a API routes).
-   `/src/collections`: Definície dátových modelov pre Payload CMS (Zápasy, Tímy, Používatelia, Tipy...).
-   `/src/components`: Zdieľané UI komponenty (Header, Footer, Button...).
-   `/src/features`: Logika špecifická pre domény (Auth, Matches, Leaderboard...).
-   `/src/hooks`: Vlastné React hooky.
-   `/src/i18n`: Konfigurácia prekladoch (Slovenčina, Angličtina).
-   `/src/messages`: JSON súbory s prekladmi.

## 📜 Skripty

-   `npm run build`: Vytvorí produkčný build aplikácie.
-   `npm run lint`: Skontroluje kód pomocou ESLint.
-   `npm run generate:types`: Vygeneruje TypeScript typy na základe Payload kolekcií (dôležité spustiť po zmene v CMS configu).
