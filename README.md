# Siegelrolle — Charaktererschaffung für „Das gebrochene Siegel“

Web-App zum Erstellen und Verwalten von Charakteren für die Homebrew-Kampagne „Das gebrochene Siegel“.

**Online:** https://pcln01.github.io/Character-creation-Homebrew-/

## Funktionen

- Charaktererschaffung in fünf Schritten: Rasse, Klasse, Werte (Point Buy, 27 Punkte), Klassenwahl mit Proficiencies, „Wen du kennst“
- Aufstieg mit Hit Points, Ability Score Improvements, Mitama-Banden und den Klassenwahlen jeder Stufe
- Kampfwerte, Klassen-Ressourcen, Short Rest, Long Rest und Schreinbesuch
- Kampfseite je Klasse zum Live-Mitführen: Beute, Griffe und Jagdbuch-Boni, Kata und Eide, Bürde und Niō-Gestalt, Seelenrituale und Talismane, kanalisierter Gott, das Rad, Pakte und Yōki, Strophen und Widerhalle
- Onmyōji Wheelbreaker: fremde Zauber aus der SRD-5.2-Liste wählen (Erschaffung, Aufstieg, Klasse) und „Wirken auf gut Glück“: Ergebnis des 1d100 wählen, die App führt es aus
- Unterrassen (Kitsune: Moonfolk, Hitodama: Gashadokuro), vom Spielleiter in der Sammlung freigeschaltet und als Datei an den Spieler zurückgegeben
- Nutzungen der Rassenfähigkeiten (pro Short/Long Rest) direkt aus den Rassen-Dokumenten
- Yokai Hunter: Jagdbuch und Gegenmittel-Beutel im Inventar, Brauen beim Long Rest
- Inventar mit Gewicht und Traglast
- Export als kleine Datei (.json) oder als PDF; beides lässt sich wieder importieren
- Sammlung für den Spielleiter: importierte Bögen der Spieler ansehen und zu jedem Charakter eigene Notizen schreiben

## Charaktere der Runde

Fertige Charaktere liegen im Ordner `charaktere/` (Format wie der Datei-Export) und sind in `charaktere/index.json` eingetragen.

- Spieler laden ihren Charakter über einen Link: `https://pcln01.github.io/Character-creation-Homebrew-/?char=ryo`
- Der Spielleiter lädt in der Sammlung mit „Charaktere der Runde laden“ alle auf einmal.

## Speicherung

Charaktere, die Sammlung und die DM-Notizen werden nur im Browser gespeichert (localStorage). Spieler schicken dem Spielleiter ihren Charakter als Datei (.json) oder PDF; beides enthält alle Daten. DM-Notizen gehören nicht zum Bogen und werden nicht mit exportiert.

## Aufbau

Eine einzelne Datei: `index.html`. Keine Installation, kein Build. Der PDF-Export lädt html2canvas und jsPDF von cdnjs.

## Lizenzhinweis

Diese App enthält Material aus dem System Reference Document 5.2 („SRD 5.2“) von Wizards of the Coast LLC, verfügbar unter https://www.dndbeyond.com/srd. Das SRD 5.2 ist lizenziert unter der Creative Commons Attribution 4.0 International License (https://creativecommons.org/licenses/by/4.0/legalcode). Die Zauberdaten stammen aus dem Projekt 5e-bits/5e-database.
