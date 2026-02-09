# Climate Change Dashboard

Ein modernes, responsives Dashboard zur Visualisierung von Klimadaten. Das Dashboard bezieht Daten aus lokalen JSON-Dateien und wird automatisch wöchentlich über GitHub Actions aktualisiert.

## 🌍 Live Demo

Nach der Einrichtung ist das Dashboard unter folgender URL erreichbar:
```
[https://github.com/knorr22/climate-dashboard/](https://knorr22.github.io/climate-dashboard/)
```

## 📊 Datenquellen

- **CO₂-Konzentration**: NOAA Global Monitoring Laboratory (Mauna Loa, Hawaii)
- **Temperaturanomalie**: NASA Goddard Institute for Space Studies (GISS)
- **Arktisches Meereis**: National Snow and Ice Data Center (NSIDC)

## 🚀 Features

- ✅ Keeling-Kurve mit Jahresvergleich
- ✅ Globale Temperaturanomalie (Balkenchart)
- ✅ Arktische Meereisausdehnung (Saisonvergleich)
- ✅ Automatische wöchentliche Datenaktualisierung
- ✅ Dark/Light Mode
- ✅ Responsive Design (Mobile-first)
- ✅ Interaktive Charts mit Tooltips

## 🛠️ Lokale Entwicklung

### Voraussetzungen

- Python 3.8+ (für Daten-Aktualisierung)
- Ein moderner Webbrowser
- Git

### Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/<dein-username>/climate-dashboard.git
   cd climate-dashboard
   ```

2. **Python-Abhängigkeiten installieren**
   ```bash
   pip install pandas requests
   ```

3. **Daten erstmalig abrufen**
   ```bash
   python fetch_data.py
   ```

4. **Lokalen Server starten**
   ```bash
   # Mit Python
   python -m http.server 8000
   
   # Oder mit npx serve
   npx serve .
   ```

5. **Dashboard öffnen**
   ```
   http://localhost:8000
   ```

## 📁 Projektstruktur

```
climate-dashboard/
├── .github/
│   └── workflows/
│       └── update_data.yml    # GitHub Action für auto-update
├── data/
│   ├── co2_monthly.json       # CO2-Daten (generiert)
│   ├── temperature_anomaly.json  # Temperaturdaten (generiert)
│   └── sea_ice_extent.json    # Meereis-Daten (generiert)
├── index.html                 # Hauptseite
├── style.css                  # Custom Styles
├── app.js                     # Dashboard-Logik
├── fetch_data.py              # Daten-Fetcher Script
├── INSTRUCTIONS.md            # Setup-Anleitung
└── README.md                  # Diese Datei
```

## 🔧 Technologie-Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Charts**: ApexCharts
- **Daten-Pipeline**: Python (pandas, requests)
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages

## 📄 Lizenz

MIT License - Frei zur Nutzung und Modifikation.

## 🤝 Beitragen

Pull Requests sind willkommen! Für größere Änderungen bitte erst ein Issue erstellen.
