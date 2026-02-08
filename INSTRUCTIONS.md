# 📘 Climate Dashboard - Schritt-für-Schritt Anleitung

Diese Anleitung erklärt detailliert, wie du das Climate Dashboard auf GitHub einrichtest und über GitHub Pages live schaltest.

---

## 📋 Inhaltsverzeichnis

1. [Voraussetzungen](#1-voraussetzungen)
2. [Repository erstellen](#2-repository-erstellen)
3. [Dateien hochladen](#3-dateien-hochladen)
4. [Erstmalig Daten abrufen](#4-erstmalig-daten-abrufen)
5. [GitHub Pages aktivieren](#5-github-pages-aktivieren)
6. [GitHub Actions aktivieren](#6-github-actions-aktivieren)
7. [Dashboard testen](#7-dashboard-testen)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Voraussetzungen

### Benötigte Accounts
- **GitHub-Account**: [github.com](https://github.com) (kostenlos)

### Lokale Tools (optional, für Entwicklung)
- **Git**: [git-scm.com](https://git-scm.com/downloads)
- **Python 3.8+**: [python.org](https://www.python.org/downloads/)
- **VS Code** oder ein anderer Code-Editor

---

## 2. Repository erstellen

### Option A: Über die GitHub-Webseite

1. Gehe zu [github.com](https://github.com) und melde dich an.

2. Klicke oben rechts auf das **+** Symbol und wähle **New repository**.

3. Fülle das Formular aus:
   - **Repository name**: `climate-dashboard` (oder ein Name deiner Wahl)
   - **Description**: `Klimadaten-Dashboard mit automatischer Aktualisierung`
   - **Public**: Wähle "Public" (erforderlich für kostenloses GitHub Pages)
   - **Initialize with README**: Lass dies **deaktiviert**

4. Klicke auf **Create repository**.

### Option B: Mit Git lokal

```bash
# In deinem Projektordner
git init
git remote add origin https://github.com/<dein-username>/climate-dashboard.git
```

---

## 3. Dateien hochladen

### Option A: Über die GitHub-Webseite

1. In deinem neuen Repository, klicke auf **uploading an existing file**.

2. Ziehe alle Projektdateien in das Upload-Fenster:
   - `index.html`
   - `style.css`
   - `app.js`
   - `fetch_data.py`
   - `README.md`
   - `INSTRUCTIONS.md`

3. Erstelle auch die Ordnerstruktur für `.github/workflows/update_data.yml`:
   - Klicke auf **Add file** → **Create new file**
   - Als Dateinamen eingeben: `.github/workflows/update_data.yml`
   - Füge den Inhalt der Datei ein
   - Klicke auf **Commit new file**

### Option B: Mit Git lokal

```bash
# Alle Dateien hinzufügen
git add .

# Commit erstellen
git commit -m "Initial commit: Climate Dashboard"

# Zum Repository pushen
git push -u origin main
```

---

## 4. Erstmalig Daten abrufen

Die JSON-Dateien mit den Klimadaten müssen initial erstellt werden.

### Option A: Lokal ausführen

```bash
# Python-Abhängigkeiten installieren
pip install pandas requests

# Daten abrufen
python fetch_data.py
```

Nach Ausführung findest du im `data/` Ordner:
- `co2_monthly.json`
- `temperature_anomaly.json`
- `sea_ice_extent.json`

Diese Dateien müssen ebenfalls ins Repository hochgeladen werden.

### Option B: GitHub Action manuell auslösen

Nachdem alle Dateien hochgeladen sind, kannst du die GitHub Action manuell starten (siehe Schritt 6).

---

## 5. GitHub Pages aktivieren

1. Gehe zu deinem Repository auf GitHub.

2. Klicke auf **Settings** (Zahnrad-Symbol).

3. Scrolle in der linken Seitenleiste zu **Pages**.

4. Unter **Source**:
   - Wähle **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`

5. Klicke auf **Save**.

6. Warte 1-2 Minuten. Danach erscheint oben der Link zu deinem Dashboard:
   ```
   https://<dein-username>.github.io/climate-dashboard/
   ```

---

## 6. GitHub Actions aktivieren

Die GitHub Action aktualisiert die Klimadaten automatisch jeden Sonntag um 02:00 UTC.

### Überprüfen, ob Actions aktiviert sind

1. Gehe zu **Settings** → **Actions** → **General**.

2. Stelle sicher, dass **Allow all actions and reusable workflows** ausgewählt ist.

3. Unter **Workflow permissions** wähle:
   - **Read and write permissions**
   - Aktiviere **Allow GitHub Actions to create and approve pull requests**

4. Klicke auf **Save**.

### Manuell auslösen (zum Testen)

1. Gehe zu **Actions** Tab in deinem Repository.

2. Klicke links auf **Update Climate Data**.

3. Klicke auf **Run workflow** → **Run workflow** (grüner Button).

4. Warte, bis der Workflow abgeschlossen ist (grünes Häkchen).

---

## 7. Dashboard testen

### Online testen

1. Öffne deine GitHub Pages URL:
   ```
   https://<dein-username>.github.io/climate-dashboard/
   ```

2. Überprüfe:
   - [ ] Alle drei Stat-Kacheln zeigen Werte
   - [ ] Die drei Charts werden korrekt dargestellt
   - [ ] Der "Last Updated" Zeitstempel ist sichtbar
   - [ ] Dark/Light Mode Toggle funktioniert
   - [ ] Charts haben interaktive Tooltips

### Lokal testen

```bash
# Mit Python
cd climate-dashboard
python -m http.server 8000

# Im Browser öffnen
# http://localhost:8000
```

---

## 8. Troubleshooting

### Problem: Charts zeigen "Daten nicht verfügbar"

**Ursache**: Die JSON-Dateien im `data/` Ordner fehlen.

**Lösung**:
1. Führe `python fetch_data.py` lokal aus
2. Lade die generierten Dateien im `data/` Ordner hoch
3. Oder löse die GitHub Action manuell aus

### Problem: GitHub Pages zeigt 404

**Ursache**: Pages ist nicht korrekt konfiguriert.

**Lösung**:
1. Gehe zu Settings → Pages
2. Überprüfe, dass `main` Branch und `/ (root)` ausgewählt sind
3. Warte 5 Minuten und aktualisiere

### Problem: GitHub Action schlägt fehl

**Ursache**: Fehlende Berechtigungen oder API-Fehler.

**Lösung**:
1. Prüfe die Action-Logs unter dem **Actions** Tab
2. Stelle sicher, dass unter Settings → Actions → General:
   - "Read and write permissions" aktiviert ist
3. Bei API-Fehlern: Die Datenquellen könnten temporär nicht erreichbar sein

### Problem: Daten werden nicht aktualisiert

**Ursache**: Keine Änderungen in den Quelldaten.

**Info**: Die Action committed nur, wenn sich die Daten tatsächlich geändert haben. Das ist erwartetes Verhalten.

### Problem: CORS-Fehler im Browser

**Ursache**: Direkt die `index.html` Datei als `file://` geöffnet.

**Lösung**: Nutze einen lokalen Server:
```bash
python -m http.server 8000
```

---

## 🎉 Fertig!

Dein Climate Dashboard ist jetzt online und aktualisiert sich automatisch jeden Sonntag mit den neuesten Klimadaten.

**Nächste Schritte:**
- Teile den Link mit anderen
- Passe das Design nach deinen Wünschen an
- Füge weitere Datenquellen hinzu

Bei Fragen oder Problemen erstelle ein GitHub Issue in deinem Repository.
