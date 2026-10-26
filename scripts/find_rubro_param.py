import urllib.request
import http.cookiejar
import re

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
opener.addheaders = [
    ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
]

opener.open('https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx')

# Let's inspect scripts/sample_navegar.html to find how BtnRubro works
with open('scripts/sample_navegar.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Look for BtnRubro
matches = re.findall(r'.{0,100}BtnRubro.{0,100}', text)
for m in matches:
    print("BtnRubro match:", m)

# Look for all button IDs or names
btn_names = re.findall(r'name="(ctl00\$CPH1\$Btn[^"]+)"', text)
print("Button names:", btn_names)
