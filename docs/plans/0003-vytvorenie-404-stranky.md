# 0003 - Vytvorenie vtipnej 404 stránky

Tento plán popisuje vytvorenie štýlovej a vtipnej 404 stránky s využitím hokejovej terminológie.

## Ciele

- Vytvoriť používateľsky prívetivú a vtipnú 404 stránku.
- Využiť hokejové metafory (offside, icing, trestná lavica).
- Zabezpečiť prémiový vzhľad v súlade so zvyškom aplikácie.

## Navrhované zmeny

### 1. Preklady

- Pridanie namespace `NotFound` do `sk.json` a `en.json`.
- Texty: "Zakázané uvoľnenie!", "Puk sa stratil niekde v rohu klziska", "Rozhodca odpískal offside".

### 2. UI Komponent

- **[MODIFY]** `src/app/(frontend)/[locale]/not-found.tsx`:
  - Použitie `IceGlassCard`.
  - Pridanie Lucide ikon (napr. `Ghost` alebo `Search`).
  - Tlačidlo na návrat do lobby.

## Overenie

- Manuálne vyvolanie 404 chyby zadaním neexistujúcej URL.
- Kontrola dizajnu a prekladov.
