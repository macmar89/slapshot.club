# Pravidlá Mini Lígl (Slapshot Club)

Tento dokument definuje pravidlá pre fungovanie mini líg v aplikácii Slapshot Club, vrátane obmedzení pre jednotlivé úrovne predplatného a logiku správy členov.

## Typy Predplatného a Obmedzenia

### 1. Free (Zadarmo)
- **Vytváranie líg**: Nemá možnosť vytvoriť ligu.
- **Pripájanie sa**: Môže sa prihlásiť maximálne do **1** ligy (vyžaduje pozývací kód).
- **Rola v lige**: Bežný člen.

### 2. Pro
- **Vytváranie líg**: Môže vytvoriť maximálne **2** ligy.
- **Pripájanie sa**: Môže sa pripojiť/byť členom maximálne **5** líg súčasne (počet zahŕňa ním vytvorené ligy + ligy, kde je členom).
- **Rola v lige**:
    - Vo vlastnej lige: **C** (Kapitán).
    - V cudzej lige: **A** (Asistent).

### 3. VIP
- **Vytváranie líg**: Môže vytvoriť maximálne **5** líg.
- **Pripájanie sa**: Môže sa pripojiť/byť členom maximálne **10** líg súčasne (počet zahŕňa ním vytvorené ligy + ligy, kde je členom).
- **Rola v lige**:
    - Vo vlastnej lige: **C** (Kapitán).
    - V cudzej lige: **A** (Asistent).

## Kapacita Ligy (Členovia)

Hráči vždy vytvárajú **súkromné** mini ligy.
Maximálny počet členov v lige (kapacita) je dynamický a závisí od počtu platiacich členov (Pro/VIP) v danej lige.

- **Pravidlo**: Na 1 Pro/VIP hráča v lige pripadajú **4 miesta pre Free hráčov**.
- **Výpočet kapacity**:
  - Každý Pro/VIP člen "odomkne" slot pre seba + 4 ďalších Free hráčov.
  - *Poznámka: Toto pravidlo sa aplikuje tak, že sa dynamicky navyšuje `max_members` pri pridaní platiaceho člena.*

## Práva a Funkcionalita

### Majiteľ Ligy (Kapitán)
- **Invite Kód**: Iba majiteľ ligy vidí unikátny pozývací kód.
- **Správa členov**:
    - Môže odstrániť hráča z ligy.
    - Musí **potvrdiť** (schváliť) záujemcu o pridanie do ligy po zadaní kódu. Hráč sa v lige nezobrazí, kým nie je potvrdený.
- **Správa ligy**:
    - Môže zrušiť celú ligu.
    - Môže presunúť vlastníctvo ligy na iného člena.

### Zobrazovanie v UI
- **Detail Ligy**:
    - Musí jasne zobrazovať Kapitána (C) a, ak je to aplikovateľné, Asistentov (A).
    - Musí obsahovať sekciu pre "Mini-chat" alebo "Podpichovanie" (Kabína).
- **Pravidlá**:
    - V aplikácii musí byť viditeľná stránka/sekcia s týmito pravidlami.
