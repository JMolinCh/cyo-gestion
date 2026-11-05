"""
Scraper automatizado de MEF - Consulta Amigable (SIAF)
Municipalidad Distrital de Carhuamayo (Ubigeo: 120502, Código SIAF: 301087)
"""

import urllib.request
import http.cookiejar
import re
import json
import os
import sys
import datetime

def parse_number(val_str):
    if not val_str:
        return 0.0
    clean = val_str.replace(',', '').replace('&nbsp;', '').strip()
    try:
        return float(clean)
    except:
        return 0.0

def scrape_carhuamayo_mef(ano=2026):
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    opener.addheaders = [
        ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
        ('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'),
        ('Accept-Language', 'es-ES,es;q=0.9'),
    ]

    # Iniciar sesión y cookies
    opener.open('https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx')

    base_url = f'https://apps5.mineco.gob.pe/transparencia/Navegador/Navegar_7.aspx?_tgt=xls&_uhc=yes&y={ano}&0=&1=M&2=00&3=000&4=301087'

    result = {
        'entidad': 'MUNICIPALIDAD DISTRITAL DE CARHUAMAYO',
        'ubigeo': '120502',
        'codigoSiaf': '301087',
        'ano': ano,
        'totales': {},
        'rubros': [],
        'genericas': [],
        'mensual': [],
    }

    # 1. TOTALES Y DEPARTAMENTO (&5=)
    url_totales = f'{base_url}&5='
    resp = opener.open(url_totales)
    content = resp.read().decode('utf-8', errors='ignore')
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', content, re.DOTALL)
    for r in rows:
        cells = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.DOTALL)]
        cells = [c for c in cells if c and c != '&nbsp;']
        if len(cells) >= 8 and 'JUNIN' in cells[0].upper():
            result['totales'] = {
                'pia': parse_number(cells[1]),
                'pim': parse_number(cells[2]),
                'certificacion': parse_number(cells[3]),
                'compromisoAnual': parse_number(cells[4]),
                'atencionCompromiso': parse_number(cells[5]),
                'devengado': parse_number(cells[6]),
                'girado': parse_number(cells[7]),
                'avancePorcentaje': parse_number(cells[8]) if len(cells) > 8 else 0.0,
            }
            break

    # 2. RUBROS (&15=)
    url_rubros = f'{base_url}&15='
    resp_rubros = opener.open(url_rubros)
    content_rubros = resp_rubros.read().decode('utf-8', errors='ignore')
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', content_rubros, re.DOTALL)
    for r in rows:
        cells = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.DOTALL)]
        cells = [c for c in cells if c and c != '&nbsp;']
        if len(cells) >= 8 and re.match(r'^\d{2}:', cells[0]):
            codigo, nombre = cells[0].split(':', 1)
            fuente = 'Recursos Determinados'
            if codigo == '00':
                fuente = 'Recursos Ordinarios'
            elif codigo == '09':
                fuente = 'Recursos Directamente Recaudados'
            
            result['rubros'].append({
                'id': f'rubro-{codigo.strip()}',
                'codigoRubro': codigo.strip(),
                'rubro': nombre.strip(),
                'fuenteFinanciamiento': fuente,
                'pia': parse_number(cells[1]),
                'pim': parse_number(cells[2]),
                'certificacion': parse_number(cells[3]),
                'compromisoAnual': parse_number(cells[4]),
                'atencionCompromiso': parse_number(cells[5]),
                'devengado': parse_number(cells[6]),
                'girado': parse_number(cells[7]),
                'avancePorcentaje': parse_number(cells[8]) if len(cells) > 8 else 0.0,
            })

    # 3. GENERICAS (&24=)
    url_genericas = f'{base_url}&24='
    resp_gen = opener.open(url_genericas)
    content_gen = resp_gen.read().decode('utf-8', errors='ignore')
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', content_gen, re.DOTALL)
    for r in rows:
        cells = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.DOTALL)]
        cells = [c for c in cells if c and c != '&nbsp;']
        if len(cells) >= 8 and re.match(r'^\d-\d{2}:', cells[0]):
            codigo_full, nombre = cells[0].split(':', 1)
            codigo = codigo_full.split('-')[1] # '21', '22', etc.
            codigo_formato = f'2.{codigo[1]}' if len(codigo) == 2 else codigo
            
            cat = 'Gasto Corriente'
            if '26' in codigo:
                cat = 'Gasto de Capital'
            
            result['genericas'].append({
                'codigo': codigo_formato,
                'codigoOriginal': codigo_full.strip(),
                'nombre': nombre.strip(),
                'categoria': cat,
                'pia': parse_number(cells[1]),
                'pim': parse_number(cells[2]),
                'certificacion': parse_number(cells[3]),
                'compromisoAnual': parse_number(cells[4]),
                'devengado': parse_number(cells[6]),
                'girado': parse_number(cells[7]),
                'avancePorcentaje': parse_number(cells[8]) if len(cells) > 8 else 0.0,
            })

    # 4. EVOLUCIÓN MENSUAL (&23=)
    url_mes = f'{base_url}&23='
    resp_mes = opener.open(url_mes)
    content_mes = resp_mes.read().decode('utf-8', errors='ignore')
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', content_mes, re.DOTALL)
    
    nombres_meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    mes_dict = {}
    
    for r in rows:
        cells = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.DOTALL)]
        cells = [c for c in cells if c and c != '&nbsp;']
        if len(cells) >= 5 and re.match(r"^\d{1,2}:", cells[0]):
            num_mes = int(cells[0].split(':')[0].strip())
            # En la tabla mensual: cells[1]=PIM/Compromiso, cells[3]=Devengado, etc.
            dev = parse_number(cells[3]) if len(cells) > 3 else 0.0
            prog = parse_number(cells[1]) if len(cells) > 1 else 0.0
            mes_dict[num_mes] = {'dev': dev, 'prog': prog}

    acum = 0.0
    for i in range(1, 13):
        m_name = nombres_meses[i - 1]
        m_data = mes_dict.get(i, {'dev': 0.0, 'prog': 0.0})
        acum += m_data['dev']
        result['mensual'].append({
            'mes': m_name,
            'programado': m_data['prog'],
            'ejecutado': m_data['dev'],
            'acumulado': acum,
        })

    meses_es = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    ahora = datetime.datetime.now()
    hora_str = ahora.strftime("%I:%M %p").lstrip('0')
    fecha_texto = f"{ahora.day} de {meses_es[ahora.month - 1]} de {ahora.year} - {hora_str}"
    result['fechaActualizacion'] = fecha_texto
    result['fechaCorte'] = f"{ahora.day} de {meses_es[ahora.month - 1]} de {ahora.year}"
    result['ultimaActualizacion'] = f"Sincronizado en vivo con MEF Consulta Amigable ({fecha_texto})"

    return result

if __name__ == '__main__':
    ano = int(sys.argv[1]) if len(sys.argv) > 1 else 2026
    print(f"Scrapeando Consulta Amigable MEF para Carhuamayo - Año {ano}...")
    datos = scrape_carhuamayo_mef(ano)
    print("¡Extracción exitosa!")
    print(f"PIM Total: S/. {datos['totales'].get('pim', 0):,.2f}")
    print(f"Devengado: S/. {datos['totales'].get('devengado', 0):,.2f}")
    print(f"Avance: {datos['totales'].get('avancePorcentaje', 0)}%")
    print(f"Rubros encontrados: {len(datos['rubros'])}")
    print(f"Genéricas encontradas: {len(datos['genericas'])}")
    
    # Guardar a JSON
    with open('scripts/carhuamayo_mef_live.json', 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
    print("Guardado en scripts/carhuamayo_mef_live.json")
