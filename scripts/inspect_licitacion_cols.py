import urllib.request
import re

url = "https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublico.xhtml?ruc_entidad=20185644830&anio=2026&mes=09&theme=ongei"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req, timeout=15)
html = resp.read().decode('utf-8', errors='ignore')

# Extract table headers
ths = re.findall(r'<th[^>]*>(.*?)</th>', html, re.DOTALL)
clean_ths = [re.sub(r'<[^>]+>', '', t).strip() for t in ths if t.strip()]
print("Headers count:", len(clean_ths))
for i, h in enumerate(clean_ths):
    print(f"Col {i}: {h}")

# Extract table row
trs = re.findall(r'<tr[^>]*data-ri="0"[^>]*>(.*?)</tr>', html, re.DOTALL)
if trs:
    tds = re.findall(r'<td[^>]*>(.*?)</td>', trs[0], re.DOTALL)
    clean_tds = [re.sub(r'<[^>]+>', '', t).strip() for t in tds]
    print("\nRow 0 data:")
    for i, d in enumerate(clean_tds):
        print(f"Col {i}: {d}")
        
    # Check if there are any links or actions in the row (e.g. ficha de proceso)
    links = re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', trs[0], re.DOTALL)
    print("\nLinks in row 0:", links)
