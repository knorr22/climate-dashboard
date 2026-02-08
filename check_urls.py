import requests

urls = [
    'https://masie_web.apps.nsidc.org/pub/DATASETS/NOAA/G02135/north/daily/data/N_seaice_extent_daily_v3.0.csv',
    'https://noaadata.apps.nsidc.org/NOAA/G02135/north/daily/data/N_seaice_extent_daily_v3.0.csv',
    'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.csv'
]

for url in urls:
    try:
        r = requests.head(url, timeout=5)
        print(f"{url}: {r.status_code}")
    except Exception as e:
        print(f"{url}: {e}")
