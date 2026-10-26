import urllib.request
import http.cookiejar
import re

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
opener.addheaders = [
    ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
]

opener.open('https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx')

base = 'https://apps5.mineco.gob.pe/transparencia/Navegador/Navegar_7.aspx?_tgt=xls&_uhc=yes&y=2026&0=&1=M&2=00&3=000&4=301087'

# Let's search inside scripts/sample_navegar.html for what query parameter names exist!
with open('scripts/sample_navegar.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find all occurrences of .aspx?
aspx_urls = re.findall(r'[a-zA-Z0-9_\.]+\.aspx\?[^"\'<>]+', text)
print("Found aspx URLs in page:")
for u in set(aspx_urls):
    print(" ", u)
