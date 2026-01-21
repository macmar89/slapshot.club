# 0002 - Vytvorenie Dashboardu, Zápasov a Rebríčka

Tento plán popisuje vytvorenie stránok pre detail súťaže, zoznam zápasov a rebríček (leaderboard).

## Ciele

- Implementovať prehľadné zobrazenie detailu súťaže.
- Vytvoriť dedikované stránky pre zápasy a rebríček pod dynamickou cestou `/dashboard/[slug]`.
- Pripraviť znovupoužiteľné view komponenty v `src/features`.

## Navrhované zmeny

### 1. Feature Komponenty (Views)

- **[NEW]** `src/features/dashboard/components/DashboardView.tsx`: Prehľad súťaže (štatistiky, info).
- **[MODIFY]** `src/features/matches/components/MatchesView.tsx`: Zoznam zápasov pre konkrétnu súťaž.
- **[NEW]** `src/features/leaderboard/components/LeaderboardView.tsx`: Tabuľka poradia a štatistík.

### 2. Stránky (App Router)

- **[MODIFY]** `src/app/(frontend)/[locale]/dashboard/[slug]/page.tsx`: Prepojenie na `DashboardView`.
- **[NEW]** `src/app/(frontend)/[locale]/dashboard/[slug]/matches/page.tsx`: Prepojenie na `MatchesView`.
- **[NEW]** `src/app/(frontend)/[locale]/dashboard/[slug]/leaderboard/page.tsx`: Prepojenie na `LeaderboardView`.

### 3. Preklady

- Pridanie chýbajúcich prekladov do `messages/sk.json` a `messages/en.json` pre všetky tri nové sekcie.

## Overenie

- Navigácia medzi sekciami dashboardu.
- Kontrola správneho načítania dát pre daný `slug`.
- Overenie funkčnosti v oboch jazykoch.
