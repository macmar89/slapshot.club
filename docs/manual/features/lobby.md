# Lobby

Sekcia Lobby je hlavným miestom, kde môžete nájsť a zapojiť sa do rôznych súťaží.

## Funkcie

- **Zobrazenie súťaží**: Zoznam všetkých aktuálne prebiehajúcich a nadchádzajúcich súťaží.
- **Vstup do súťaže**: Používatelia sa môžu zapojiť do súťaže kliknutím na tlačidlo "Vstúpiť".
- **Sledovanie bodov**: Po vstupe do súťaže sa vytvorí záznam v rebríčku, kde sa sledujú vaše body, počet zápasov, presné tipy a správne trendy.

## Technické detaily

Pri vstupe do súťaže sa v systéme vytvorí `leaderboard-entry`, ktorý inicializuje nasledujúce hodnoty:
- `totalPoints`: 0
- `totalMatches`: 0
- `exactGuesses`: 0
- `correctTrends`: 0

Tieto hodnoty sa aktualizujú na základe vašich tipov v zápasoch.
