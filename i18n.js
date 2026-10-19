(function() {
  var D = {
    "\u0625\u0639\u0627\u062F\u0629 \u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0630\u0647\u0628": "Gold-Replay",
    "\u062A\u062F\u0631\u064A\u0628 \u0627\u0644\u0630\u0647\u0628": "Gold-Training",
    "\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0645\u0643\u062A\u0628\u0629 \u0627\u0644\u0631\u0633\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u064A": "Chart-Bibliothek konnte nicht geladen werden",
    "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062A\u0637\u0628\u064A\u0642": "App-Fehler",
    "\u0642\u0646\u0627\u0629 \u0633\u0639\u0631\u064A\u0629 \u0645\u0646\u062A\u0638\u0645\u0629 \u0648\u062E\u0631\u0648\u062C \u0645\u0646\u0647\u0627": "Saubere Preiskanal-Struktur und Ausbruch",
    "\u0627\u062A\u062C\u0627\u0647 \u0642\u0648\u064A \u0648\u0643\u0633\u0631 \u0642\u0645\u0629/\u0642\u0627\u0639 \u062C\u062F\u064A\u062F": "Starker Trend und Bruch eines neuen Hochs/Tiefs",
    "\u0643\u0633\u0631 \u0645\u0639\u0627\u0643\u0633 \u0628\u0639\u062F \u0627\u062A\u062C\u0627\u0647 \u0637\u0648\u064A\u0644": "Gegenbruch nach langem Trend",
    "\u0630\u064A\u0644 \u0637\u0648\u064A\u0644 \u062E\u0644\u0641 \u0642\u0645\u0629/\u0642\u0627\u0639 \u0645\u0647\u0645": "Langer Docht \xFCber/unter wichtigem Hoch/Tief",
    "\u0634\u0645\u0639\u0629 \u0639\u0646\u064A\u0641\u0629 \u0645\u0641\u0627\u062C\u0626\u0629": "Pl\xF6tzliche heftige Kerze",
    "\u0633\u0648\u0642 \u0639\u0631\u0636\u064A \u0636\u064A\u0642": "Enge Seitw\xE4rtsphase",
    "\u062D\u062F\u062F \u0627\u0644\u0627\u062A\u062C\u0627\u0647 \u0648\u0627\u0644\u062E\u0637\u0629 \u0642\u0628\u0644 \u0627\u0644\u0643\u0634\u0641": "Richtung und Plan vor dem Aufdecken festlegen",
    "\u0648\u0642\u0641 \u0627\u0644\u062E\u0633\u0627\u0631\u0629 \u0641\u064A \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u062E\u0637\u0623": "Stop-Loss auf der falschen Seite",
    "\u062A\u0645 \u0636\u0628\u0637 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u0646 \u0627\u0644\u0645\u0631\u0628\u0639": "Quiz aus der Box \xFCbernommen",
    "\u062A\u0645\u062A \u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062C\u0644\u0633\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629": "Vorherige Sitzung fortgesetzt",
    "\u0646\u0641\u0651\u0630\u060C \u0623\u0648 \u0627\u062E\u062A\u0631 \u0627\u0644\u0627\u062A\u062C\u0627\u0647\u060C \u062B\u0645": "Ausf\xFChren, oder Richtung w\xE4hlen, dann",
    "\u064A\u062A\u0645 \u062D\u0641\u0638 \u0645\u0648\u0636\u0639\u0643 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B": "Deine Position wird automatisch gespeichert",
    "\u0627\u0644\u0631\u0628\u062D/\u0627\u0644\u062E\u0633\u0627\u0631\u0629 \u0627\u0644\u0645\u0641\u062A\u0648\u062D\u0629": "Offener G/V",
    "\u0642\u0645\u0645/\u0642\u064A\u0639\u0627\u0646 \u0642\u0648\u064A\u0629 \u0648\u0636\u0639\u064A\u0641\u0629": "Starke/schwache Hochs/Tiefs",
    "\u0644\u062D\u062C\u0645 \u0644\u0648\u062A \u0645\u0631\u0628\u0639 \u0627\u0644\u0645\u0631\u0643\u0632": "f\xFCr die Lotgr\xF6\xDFe der Positionsbox",
    "\u0627\u0644\u0647\u062F\u0641 \u0641\u064A \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u062E\u0637\u0623": "Ziel auf der falschen Seite",
    "\u0644\u0644\u0634\u0631\u0627\u0621\u061B \u0627\u0639\u0643\u0633\u0647\u0627 \u0644\u0644\u0628\u064A\u0639": "f\xFCr Kauf; f\xFCr Verkauf umkehren",
    "\u0644\u0627 \u062A\u0648\u062C\u062F \u0635\u0641\u0642\u0629 \u0645\u0641\u062A\u0648\u062D\u0629": "Keine offene Position",
    "\u0644\u0645\u0627\u0630\u0627 \u062F\u062E\u0644\u062A \u0627\u0644\u0635\u0641\u0642\u0629\u061F": "Warum bist du eingestiegen?",
    "\u0627\u062E\u062A\u0631 \u0627\u0644\u0627\u062A\u062C\u0627\u0647 \u0623\u0648\u0644\u0627\u064B": "Zuerst Richtung w\xE4hlen",
    "\u0627\u0631\u0633\u0645 \u0645\u0631\u0628\u0639 \u0634\u0631\u0627\u0621/\u0628\u064A\u0639": "Zeichne eine Long/Short-Box",
    "\u0627\u0644\u0635\u0642\u0647 \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629": "in den Chat einf\xFCgen",
    "\u0647\u0627\u062F\u0626\u060C \u0645\u062A\u0648\u062A\u0631\u060C \u0637\u0645\u0627\u0639": "ruhig, nerv\xF6s, gierig",
    "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A": "Quizze gesamt",
    "\u0623\u063A\u0644\u0642 \u0627\u0644\u0635\u0641\u0642\u0629 \u0623\u0648\u0644\u0627\u064B": "Schlie\xDFe zuerst die Position",
    "\u0623\u0648\u0631\u062F\u0631 \u0628\u0644\u0648\u0643 \u0631\u0626\u064A\u0633\u064A": "Swing-Orderblock",
    "\u0623\u0648\u0631\u062F\u0631 \u0628\u0644\u0648\u0643 \u062F\u0627\u062E\u0644\u064A": "Interner Orderblock",
    "\u0645\u0642\u064A\u0627\u0633 \u0646\u0633\u0628\u0629 \u0645\u0626\u0648\u064A\u0629": "Prozent-Skala",
    "\u0645\u0633\u062D \u0643\u0644 \u0627\u0644\u0631\u0633\u0648\u0645\u0627\u062A\u061F": "Alle Zeichnungen l\xF6schen?",
    "\u0645\u0633\u062D \u0643\u0644 \u0627\u0644\u0631\u0633\u0648\u0645\u0627\u062A": "Alle Zeichnungen l\xF6schen",
    "\u0644\u062F\u064A\u0643 \u0635\u0641\u0642\u0629 \u0645\u0641\u062A\u0648\u062D\u0629": "Du hast eine offene Position",
    "\u062A\u0645 \u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0635\u0641\u0642\u0629": "Trade ausgef\xFChrt",
    "\u0627\u0628\u062F\u0623 \u0645\u0646 \u0627\u0644\u062A\u0627\u0631\u064A\u062E": "Ab Datum starten",
    "\u0627\u0644\u0639\u0627\u0626\u062F/\u0627\u0644\u0645\u062E\u0627\u0637\u0631\u0629": "Chance/Risiko",
    "\u0645\u0642\u064A\u0627\u0633 \u0644\u0648\u063A\u0627\u0631\u064A\u062A\u0645\u064A": "Logarithmische Skala",
    "\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A": "Ende der Daten",
    "\u0627\u0644\u0634\u0645\u0639\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629": "N\xE4chste Kerze",
    "\u0623\u062F\u062E\u0644 \u062D\u062C\u0645 \u0627\u0644\u0644\u0648\u062A": "Lotgr\xF6\xDFe eingeben",
    "\u0641\u064A \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u062E\u0637\u0623": "auf der falschen Seite",
    "\u0645\u0627 \u0632\u0627\u0644\u062A \u0645\u0641\u062A\u0648\u062D\u0629": "noch offen",
    "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644": "Ladefehler",
    "\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631": "Quiz beenden",
    "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A": "Keine Daten",
    "\u0628\u062F\u0627\u064A\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A": "Beginn der Daten",
    "\u062D\u0630\u0641 \u0643\u0644 \u0627\u0644\u0633\u062C\u0644\u061F": "Gesamtes Journal l\xF6schen?",
    "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062A\u062D\u062F\u064A\u062F": "Auswahl aufheben",
    "\u062A\u062D\u062F\u064A\u0627\u062A \u0645\u062E\u062A\u0627\u0631\u0629": "Ausgew\xE4hlte Challenges",
    "\u0623\u063A\u0644\u0642\u062A \u0627\u0644\u0635\u0641\u0642\u0629": "Position geschlossen",
    "\u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0635\u0641\u0642\u0629": "Trade ausf\xFChren",
    "\u0648\u0636\u0639 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631": "Quiz-Modus",
    "\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u0645\u062F\u0631\u0628": "An Coach senden",
    "\u0627\u062E\u062A\u0631 \u0627\u0644\u0627\u062A\u062C\u0627\u0647": "Richtung w\xE4hlen",
    "\u062A\u0645\u062F\u064A\u062F \u0644\u0644\u064A\u0645\u064A\u0646": "Nach rechts verl\xE4ngern",
    "\u062A\u0627\u0631\u064A\u062E \u0639\u0634\u0648\u0627\u0626\u064A": "Zufallsdatum",
    "\u062A\u0645 \u0627\u0644\u0627\u0633\u062A\u064A\u0631\u0627\u062F": "Importiert",
    "\u0631\u0635\u064A\u062F \u0627\u0644\u0628\u062F\u0627\u064A\u0629": "Startguthaben",
    "\u0645\u0644\u0641 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D": "Ung\xFCltige Datei",
    "\u0627\u0644\u0627\u062A\u062C\u0627\u0647 \u0635\u062D\u064A\u062D": "Richtung richtig",
    "\u0627\u0644\u0633\u0628\u0628/\u0627\u0644\u0634\u0639\u0648\u0631": "Grund/Gef\xFChl",
    "\u0645\u0642\u064A\u0627\u0633 \u062A\u0644\u0642\u0627\u0626\u064A": "Auto-Skala",
    "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0635\u0641\u0642\u0629": "Position schlie\xDFen",
    "\u062A\u0634\u063A\u064A\u0644/\u0625\u064A\u0642\u0627\u0641": "Play/Pause",
    "\u0648\u0642\u0641 \u0627\u0644\u062E\u0633\u0627\u0631\u0629": "Stop-Loss",
    "\u062F\u0642\u0629 \u0627\u0644\u0627\u062A\u062C\u0627\u0647": "Richtungs-Trefferquote",
    "\u0627\u0644\u0627\u062A\u062C\u0627\u0647 \u062E\u0637\u0623": "Richtung falsch",
    "\u062A\u0648\u0642\u064A\u062A \u0628\u0631\u0644\u064A\u0646": "Berliner Zeit",
    "\u0633\u062C\u0644 \u0627\u0644\u0635\u0641\u0642\u0627\u062A": "Trade-Journal",
    "\u0648\u0635\u0644\u062A \u0627\u0644\u0647\u062F\u0641": "Ziel erreicht",
    "\u062D\u0630\u0641 \u0628\u0627\u0644\u0646\u0642\u0631": "Per Tippen l\xF6schen",
    "\u0647\u064A\u0643\u0644 \u0631\u0626\u064A\u0633\u064A": "Swing-Struktur",
    "\u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A": "Statistik",
    "\u0646\u0633\u062E \u0644\u0644\u0645\u062F\u0631\u0628": "F\xFCr Coach kopieren",
    "\u0642\u0646\u0627\u0629 \u0633\u0639\u0631\u064A\u0629": "Preiskanal",
    "\u0647\u064A\u0643\u0644 \u062F\u0627\u062E\u0644\u064A": "Interne Struktur",
    "\u0627\u0643\u0634\u0641 \u0648\u0642\u064A\u0651\u0645": "Aufdecken & bewerten",
    "\u0646\u0633\u0628\u0629 \u0627\u0644\u0631\u0628\u062D": "Trefferquote",
    "\u0627\u0636\u063A\u0637 \u0627\u0643\u0634\u0641": "tippe auf Aufdecken",
    "\u0645\u0631\u0643\u0632 \u0634\u0631\u0627\u0621": "Long-Position",
    "\u0627\u0646\u0633\u062E \u0627\u0644\u0646\u0635": "Text kopieren",
    "\u062D\u0630\u0641 \u0627\u0644\u0633\u062C\u0644": "Journal l\xF6schen",
    "\u0636\u0631\u0628 \u0627\u0644\u0648\u0642\u0641": "Stop getroffen",
    "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A": "Gesamt",
    "\u062A\u0642\u062F\u0645 \u064A\u0648\u0645": "Einen Tag vor",
    "\u062A\u0645 \u0627\u0644\u0646\u0633\u062E": "Kopiert",
    "\u0631\u062C\u0648\u0639 \u064A\u0648\u0645": "Einen Tag zur\xFCck",
    "\u0645\u0631\u0643\u0632 \u0628\u064A\u0639": "Short-Position",
    "\u0644\u0645 \u062A\u062A\u0641\u0639\u0644": "nicht ausgel\xF6st",
    "\u0627\u0644\u0645\u062E\u0627\u0637\u0631\u0629": "Risiko",
    "\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A": "Daten",
    "\u0645\u063A\u0646\u0627\u0637\u064A\u0633": "Magnet",
    "\u0627\u0644\u0635\u0641\u0642\u0627\u062A": "Trades",
    "\u0627\u0633\u062A\u064A\u0631\u0627\u062F": "Import",
    "\u0627\u0644\u0625\u063A\u0644\u0627\u0642": "Schluss",
    "\u062E\u0637 \u0623\u0641\u0642\u064A": "Horizontale Linie",
    "\u0627\u0644\u0627\u062A\u062C\u0627\u0647": "Richtung",
    "\u062E\u0637 \u062A\u0631\u0646\u062F": "Trendlinie",
    "\u0627\u0644\u062D\u0631\u0643\u0629": "Bewegung",
    "\u0642\u0644\u0645 \u062D\u0631": "Freihand-Stift",
    "\u0627\u0644\u062C\u0644\u0633\u0629": "Sitzung",
    "\u0627\u062E\u062A\u0628\u0627\u0631": "Quiz",
    "\u0627\u0644\u0646\u0642\u0627\u0637": "Punkte",
    "\u062A\u062D\u062F\u064A\u0627\u062A": "Challenges",
    "\u0627\u0644\u0633\u0631\u0639\u0629": "Tempo",
    "\u0645\u0634\u0627\u0631\u0643\u0629": "Teilen",
    "\u0627\u0644\u0635\u0641\u0642\u0629": "Trade",
    "\u0627\u0644\u0631\u0635\u064A\u062F": "Guthaben",
    "\u062A\u0644\u0642\u0627\u0626\u064A": "Auto",
    "\u0645\u062E\u0627\u0637\u0631\u0629": "Risiko",
    "\u0641\u062C\u0648\u0627\u062A": "L\xFCcken",
    "\u062A\u0635\u062F\u064A\u0631": "Export",
    "\u062F\u0642\u064A\u0642\u0629": "Minuten",
    "\u0645\u0646\u0627\u0637\u0642": "Zonen",
    "\u062A\u0634\u063A\u064A\u0644": "Play",
    "\u0633\u0627\u0639\u0627\u062A": "Stunden",
    "\u0645\u062A\u0648\u0633\u0637": "Mittel",
    "\u062A\u0641\u0639\u064A\u0644": "Aktivieren",
    "\u0627\u0644\u0647\u062F\u0641": "Ziel",
    "\u062A\u0631\u0627\u062C\u0639": "R\xFCckg\xE4ngig",
    "\u0625\u064A\u0642\u0627\u0641": "Pause",
    "\u062A\u0646\u0632\u064A\u0644": "Download",
    "\u0634\u0639\u0648\u0631\u064A": "Mein Gef\xFChl",
    "\u0645\u0646\u0641\u0630\u0629": "ausgef\xFChrt",
    "\u0627\u0644\u0648\u0642\u0641": "Stop",
    "\u0623\u0646\u062C\u0632\u062A": "Erledigt",
    "\u062A\u0639\u062F\u064A\u0644": "Bearbeiten",
    "\u0627\u0644\u0644\u0648\u062A": "Lot",
    "\u0628\u0631\u0644\u064A\u0646": "Berlin",
    "\u0645\u0633\u0627\u0641\u0629": "Leertaste",
    "\u0635\u0641\u0642\u0629": "Trade",
    "\u0631\u062C\u0648\u0639": "Zur\xFCck",
    "\u0642\u0646\u0627\u0629": "Kanal",
    "\u0627\u0643\u0634\u0641": "Aufdecken",
    "\u0635\u0627\u0639\u062F": "Steigend",
    "\u0633\u0627\u0639\u0629": "Stunde",
    "\u0634\u0645\u0639\u0629": "Kerze",
    "\u0623\u0632\u0631\u0642": "Blau",
    "\u0646\u0641\u0651\u0630": "Ausf\xFChren",
    "\u062F\u062E\u0648\u0644": "Einstieg",
    "\u064A\u0648\u0645\u064A": "T\xE4glich",
    "\u0635\u062D\u064A\u062D": "richtig",
    "\u0647\u0627\u0628\u0637": "Fallend",
    "\u0623\u0635\u0641\u0631": "Gelb",
    "\u064A\u062F\u0648\u064A": "Manuell",
    "\u0623\u0628\u064A\u0636": "Wei\xDF",
    "\u0623\u062E\u0636\u0631": "Gr\xFCn",
    "\u0645\u0624\u0634\u0631": "Indikator",
    "\u0634\u0631\u0627\u0621": "Kaufen",
    "\u0623\u0641\u0642\u064A": "Horizontal",
    "\u062E\u0631\u0648\u062C": "Ausstieg",
    "\u062A\u0631\u0646\u062F": "Trend",
    "\u0623\u062D\u0645\u0631": "Rot",
    "\u0628\u064A\u0639": "Verkaufen",
    "\u0645\u0633\u062D": "Leeren",
    "\u0644\u0648\u062A": "Lot",
    "\u062D\u0630\u0641": "L\xF6schen",
    "\u062E\u0637\u0623": "Fehler",
    "\u064A\u0648\u0645": "Tag",
    "\u0642\u0644\u0645": "Stift",
    "\u062B\u0645": "dann",
    "\u0633\u0647\u0644": "Leicht",
    "\u0635\u0639\u0628": "Schwer",
    "15\u062F": "15m",
    "4\u0633": "4h",
    "1\u0633": "1h",
    "\u0627\u062E\u062A\u0628\u0627\u0631:": "Quiz:",
    "\u0645\u0624\u0634\u0631 SMC": "SMC-Indikator",
    "\u0627\u0644\u0646\u0645\u0637 \u0648\u0627\u0644\u0644\u0648\u0646": "Stil & Farbe",
    "\u0627\u0644\u062A\u0639\u0628\u0626\u0629": "F\xFCllung",
    "\u0627\u0644\u062E\u0637": "Linie",
    "\u0627\u0644\u0634\u0641\u0627\u0641\u064A\u0629": "Deckkraft",
    "\u0627\u0644\u0633\u0645\u0627\u0643\u0629": "St\xE4rke",
    "\u0627\u0644\u0646\u0645\u0637": "Stil",
    "\u0645\u062A\u0635\u0644": "Durchgezogen",
    "\u0645\u062A\u0642\u0637\u0639": "Gestrichelt",
    "\u0645\u0646\u0642\u0637": "Gepunktet",
    "\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0642\u0646\u0627\u0629": "Kanal-Hintergrund",
    "\u0628\u064A\u0639 \u0641\u0648\u0631\u064A \u0628\u0633\u0639\u0631 \u0627\u0644\u0633\u0648\u0642": "Sofort zum Marktpreis verkaufen",
    "\u0634\u0631\u0627\u0621 \u0641\u0648\u0631\u064A \u0628\u0633\u0639\u0631 \u0627\u0644\u0633\u0648\u0642": "Sofort zum Marktpreis kaufen",
    "\u062D\u062C\u0645 \u0627\u0644\u0644\u0648\u062A": "Lotgr\xF6\xDFe",
    "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0643\u0644": "Alle schlie\xDFen",
    "\u0625\u063A\u0644\u0627\u0642": "Schlie\xDFen",
    "\u0627\u0644\u0623\u0633\u0647\u0645": "Equity",
    "\u0639\u0627\u0626\u0645": "Offen",
    "\u0627\u0644\u0645\u062F\u0629": "Dauer",
    "\u0627\u0644\u0633\u062C\u0644": "Verlauf",
    "\u0634\u0639\u0648\u0631\u064A": "Gef\xFChl",
    "\u0648\u0627\u062B\u0642": "Sicher",
    "\u0645\u062A\u0631\u062F\u062F": "Unsicher",
    "\u062A\u0634\u063A\u064A\u0644 \u0639\u0643\u0633\u064A": "R\xFCckw\xE4rts abspielen",
    "\u0639\u0643\u0633\u064A": "R\xFCckw\xE4rts",
    "\u0645\u0624\u0634\u0631 \u0627\u0644\u0645\u0627\u0643\u062F": "MACD-Indikator",
    "\u0633\u0631\u064A\u0639": "Schnell",
    "\u0628\u0637\u064A\u0621": "Langsam",
    "\u0625\u0634\u0627\u0631\u0629": "Signal"
  };
  var KEYS = Object.keys(D).sort(function(a, b) {
    return b.length - a.length;
  });
  var RE = new RegExp("(?<![\\u0600-\\u06FF])(" + KEYS.map(function(k) {
    return k.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
  }).join("|") + ")(?![\\u0600-\\u06FF])", "g");
  var q = (location.search.match(/[?&]lang=(ar|de)/) || [])[1];
  if (q) try {
    localStorage.setItem("gr_lang", q);
  } catch (e) {
  }
  var L = null;
  try {
    L = localStorage.getItem("gr_lang");
  } catch (e) {
  }
  function tr(s) {
    if (L !== "de" || !s || !/[\u0600-\u06FF]/.test(s)) return s;
    return s.replace(RE, function(m) {
      return D[m];
    }).replace(/؟/g, "?").replace(/،/g, ",").replace(/؛/g, ";");
  }
  function walk(n) {
    if (n.nodeType === 3) {
      var v = n.nodeValue, t = tr(v);
      if (t !== v) n.nodeValue = t;
      return;
    }
    if (n.nodeType !== 1) return;
    if (n.tagName === "SCRIPT" || n.tagName === "STYLE") return;
    ["title", "placeholder", "aria-label"].forEach(function(a) {
      var v2 = n.getAttribute(a);
      if (v2) {
        var t2 = tr(v2);
        if (t2 !== v2) n.setAttribute(a, t2);
      }
    });
    for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
  }
  function apply() {
    var de = L === "de";
    document.documentElement.lang = de ? "de" : "ar";
    document.documentElement.dir = de ? "ltr" : "rtl";
    if (!de) return;
    document.title = tr(document.title);
    walk(document.body);
    new MutationObserver(function(ms) {
      ms.forEach(function(m) {
        if (m.type === "characterData") walk(m.target);
        else if (m.type === "attributes") walk(m.target);
        else m.addedNodes.forEach(walk);
      });
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["title", "placeholder"] });
    var A = window.alert, C = window.confirm, P = window.prompt;
    window.alert = function(m) {
      return A.call(window, tr(String(m)));
    };
    window.confirm = function(m) {
      return C.call(window, tr(String(m)));
    };
    window.prompt = function(m, d) {
      return P.call(window, tr(String(m)), d);
    };
  }
  window.I18N = { tr, get lang() {
    return L;
  }, de: function() {
    return L === "de";
  } };
  function chooser() {
    var o = document.createElement("div");
    o.id = "langPick";
    o.innerHTML = '<div class="lp-card"><div class="lp-logo">\u{1F7E1} XAUUSD</div><div class="lp-t">\u0627\u062E\u062A\u0631 \u0627\u0644\u0644\u063A\u0629 \xB7 Sprache w\xE4hlen</div><button data-l="ar" dir="rtl">\u0639\u0631\u0628\u064A</button><button data-l="de" dir="ltr">Deutsch</button></div>';
    document.body.appendChild(o);
    o.querySelectorAll("button").forEach(function(b) {
      b.onclick = function() {
        L = b.getAttribute("data-l");
        try {
          localStorage.setItem("gr_lang", L);
        } catch (e) {
        }
        o.remove();
        apply();
        if (window.__onLang) window.__onLang(L);
      };
    });
  }
  document.documentElement.dir = L === "de" ? "ltr" : "rtl";
  if (L) apply();
  else chooser();
})();
