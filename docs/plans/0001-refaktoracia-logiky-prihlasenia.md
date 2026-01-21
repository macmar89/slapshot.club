# 0001 - Refaktorácia logiky prihlásenia do súťaže

Tento dokument popisuje presun logiky prihlasovania do súťaže z `LobbyView` priamo do `CompetitionCard` a implementáciu dynamického načítavania modálu pre lepší výkon.

## Ciele

- Zvýšiť modularitu kódu presunom logiky do príslušného komponentu.
- Zlepšiť výkon pomocou dynamického importu modálu (`next/dynamic`).
- Zjednodušiť `LobbyView` odstránením prebytočných stavov.

## Navrhované zmeny

### 1. CompetitionCard.tsx

- Pridanie stavov pre otvorenie modálu a prebiehajúce prihlasovanie.
- Dynamický import `JoinCompetitionModal`.
- Vlastná logika `handleEnter` (prihlásenie vs. dashboard).
- Priame volanie `joinCompetition` akcie.

### 2. LobbyView.tsx

- Odstránenie stavov `isJoinModalOpen`, `selectedCompetition`, `isJoining`.
- Odstránenie funkcií `handleEnter` a `handleConfirmJoin`.
- Odstránenie modálu z hlavného renderu.

## Overenie

- [ ] Klik na súťaž kde som prihlásený -> Dashbord.
- [ ] Klik na novú súťaž -> Modal -> Úspešné prihlásenie.
