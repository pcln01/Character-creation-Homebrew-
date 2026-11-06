# Siegelrolle — Charaktererschaffung für „Das gebrochene Siegel“

Web-App zum Erstellen und Verwalten von Charakteren für die Homebrew-Kampagne „Das gebrochene Siegel“.

**Online:** https://pcln01.github.io/Character-creation-Homebrew-/

## Funktionen

- Charaktererschaffung in fünf Schritten: Rasse, Klasse, Werte (Point Buy, 27 Punkte), Klassenwahl mit Proficiencies, „Wen du kennst“
- Aufstieg mit Hit Points, Ability Score Improvements, Mitama-Banden und den Klassenwahlen jeder Stufe
- Kampfwerte, Klassen-Ressourcen, Short Rest, Long Rest und Schreinbesuch
- Kampfseite je Klasse zum Live-Mitführen: Beute, Griffe und Jagdbuch-Boni, Kata und Eide, Bürde und Niō-Gestalt, Seelenrituale und Talismane, kanalisierter Gott, das Rad, Pakte und Yōki, Strophen und Widerhalle
- Nutzungen der Rassenfähigkeiten (pro Short/Long Rest) direkt aus den Rassen-Dokumenten
- Yokai Hunter: Jagdbuch und Gegenmittel-Beutel im Inventar, Brauen beim Long Rest
- Inventar mit Gewicht und Traglast
- Export als kleine Datei (.json) oder als PDF; beides lässt sich wieder importieren
- Sammlung für den Spielleiter: importierte Bögen der Spieler ansehen und zu jedem Charakter eigene Notizen schreiben

## Speicherung

Charaktere, die Sammlung und die DM-Notizen werden nur im Browser gespeichert (localStorage). Spieler schicken dem Spielleiter ihren Charakter als Datei (.json) oder PDF; beides enthält alle Daten. DM-Notizen gehören nicht zum Bogen und werden nicht mit exportiert.

## Aufbau

Eine einzelne Datei: `index.html`. Keine Installation, kein Build. Der PDF-Export lädt html2canvas und jsPDF von cdnjs.
