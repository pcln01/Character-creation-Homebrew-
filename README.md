# Siegelrolle — Charaktererschaffung für „Das gebrochene Siegel“

Web-App zum Erstellen und Verwalten von Charakteren für die Homebrew-Kampagne „Das gebrochene Siegel“.

**Online:** https://pcln01.github.io/Character-creation-Homebrew-/

## Funktionen

- Charaktererschaffung in fünf Schritten: Rasse, Klasse, Werte (Point Buy, 27 Punkte), Klassenwahl mit Proficiencies, „Wen du kennst“
- Aufstieg mit Hit Points, Ability Score Improvements, Mitama-Banden und den Klassenwahlen jeder Stufe
- Kampfwerte, Klassen-Ressourcen, Short Rest, Long Rest und Schreinbesuch
- Inventar mit Gewicht und Traglast
- Export als PDF und Import aus einer exportierten PDF

## Speicherung

Charaktere werden im Browser gespeichert (localStorage). Zum Sichern oder Weitergeben einen Charakter als PDF exportieren; die PDF enthält alle Daten und lässt sich wieder importieren.

## Aufbau

Eine einzelne Datei: `index.html`. Keine Installation, kein Build. Der PDF-Export lädt html2canvas und jsPDF von cdnjs.
