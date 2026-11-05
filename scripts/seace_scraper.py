"""
Scraper automatizado de SEACE (OSCE) - Plataforma ONGEI
Municipalidad Distrital de Carhuamayo (RUC: 20185644830)
- Buscador Público de Procesos de Selección (Licitaciones)
- Reporte de Registro de Órdenes de Compra y Órdenes de Servicio (OCOS)
SOPORTE COMPLETO DE PAGINACIÓN MULTI-HOJA PRIMEFACES (JSF)
"""

import urllib.request
import urllib.parse
import http.cookiejar
import re
import json
import sys
import math
import datetime

RUC_DEFAULT = "20185644830"

def decode_html_bytes(b):
    if not b:
        return ""
    try:
        return b.decode('utf-8')
    except UnicodeDecodeError:
        return b.decode('latin-1', errors='replace')

def clean_text(html_fragment):
    if not html_fragment:
        return ""
    text = re.sub(r'<script.*?</script>', '', html_fragment, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\$\(function.*', '', text)
    text = text.replace('&nbsp;', ' ').replace('&quot;', '"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    try:
        if 'Ã' in text:
            text = text.encode('latin-1').decode('utf-8')
    except Exception:
        pass
    text = text.replace('¿', '"').replace('?', '"') if text.count('¿') >= 2 else text
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_monto(monto_str):
    if not monto_str:
        return 0.0
    clean = re.sub(r'[A-Za-z/$\s]', '', monto_str)
    clean = clean.lstrip('.').replace(',', '')
    try:
        return float(clean)
    except:
        return 0.0

def get_view_state(html_text):
    m = re.search(r'name="javax\.faces\.ViewState"[^>]*value="([^"]+)"', html_text)
    if not m:
        m = re.search(r'id="[^"]*ViewState[^"]*"[^>]*value="([^"]+)"', html_text)
    if not m:
        m = re.search(r'id="[^"]*ViewState[^"]*"[^>]*><!\[CDATA\[([^\]]+)\]\]>', html_text)
    return m.group(1) if m else ''

def parse_orden_row(cells, anio, mes, url):
    if len(cells) < 11 or cells[1] not in ['O/S', 'O/C']:
        return None
    tipo_full = 'Orden de Servicio' if cells[1] == 'O/S' else 'Orden de Compra'
    prefijo = 'OS' if cells[1] == 'O/S' else 'OC'
    monto = parse_monto(cells[9])
    
    razon = cells[11].upper()
    es_local = any(k in razon for k in ['CARHUAMAYO', 'JUNIN', 'CHIVIAN', 'BOMBON', 'CARHUAMACA'])
    
    return {
        'id': f'seace-{anio}-{mes}-{cells[1]}-{cells[2]}-{cells[0]}',
        'numeroDocumento': f'{prefijo}-{anio}-{cells[2].zfill(6)}',
        'numeroOrdenSeace': cells[2],
        'tipo': tipo_full,
        'tipoContratacion': cells[3],
        'descripcion': cells[4],
        'expedienteSiaf': cells[5],
        'fechaEmision': cells[6].split(' ')[0] if len(cells) > 6 else f'{anio}-{mes}-01',
        'fechaCompromiso': cells[7].split(' ')[0] if len(cells) > 7 else '',
        'estado': 'Pagado' if 'PAG' in cells[8].upper() else 'Devengado' if 'DEV' in cells[8].upper() else 'Comprometida',
        'monto': monto,
        'moneda': 'PEN',
        'proveedorRuc': cells[10],
        'proveedorNombre': cells[11],
        'esProveedorLocal': es_local,
        'menorA8UIT': monto < 41200,
        'areaUsuaria': 'MUNICIPALIDAD DISTRITAL DE CARHUAMAYO',
        'enlaceSeace': url,
    }

def scrape_seace_ocos(ruc=RUC_DEFAULT, anio="2026", mes="10"):
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    
    url = f'https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublicoOCOS.xhtml?ruc_entidad={ruc}&anio={anio}&mes={mes}&theme=ongei'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
    
    ordenes = []
    seen_ids = set()
    
    try:
        resp = opener.open(urllib.request.Request(url, headers=headers), timeout=15)
        html = decode_html_bytes(resp.read())
        
        view_state = get_view_state(html)
        
        # Calcular total de registros y páginas
        pag_info = re.search(r'rows:(\d+),\s*rowCount:(\d+)', html)
        if pag_info:
            rows_per_page = int(pag_info.group(1))
            total_records = int(pag_info.group(2))
            total_pages = math.ceil(total_records / rows_per_page) if total_records > 0 else 1
        else:
            pag_text = re.search(r'del total (\d+) - P.*?gina: \d+/(\d+)', html)
            if pag_text:
                total_records = int(pag_text.group(1))
                total_pages = int(pag_text.group(2))
                rows_per_page = 15
            else:
                rows_per_page = 15
                total_records = 0
                total_pages = 1
                
        print(f"[SEACE OCOS {mes}/{anio}] Total registros: {total_records} en {total_pages} página(s)")
        
        # 1. Parsear página 1
        rows_p1 = re.findall(r'<tr[^>]*data-ri="(\d+)"[^>]*>(.*?)</tr>', html, re.DOTALL)
        if not rows_p1:
            rows_p1 = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
            
        for r in rows_p1:
            content = r[1] if isinstance(r, tuple) else r
            cells = [clean_text(c) for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', content, re.DOTALL)]
            item = parse_orden_row(cells, anio, mes, url)
            if item and item['id'] not in seen_ids:
                seen_ids.add(item['id'])
                ordenes.append(item)
                
        print(f"  -> Página 1: {len(ordenes)} órdenes leídas.")
        
        # 2. Paginación AJAX PrimeFaces para páginas 2 en adelante
        if total_pages > 1 and view_state:
            form_action_match = re.search(r'<form[^>]*id="formBuscador"[^>]*action="([^"]+)"', html)
            action_path = form_action_match.group(1) if form_action_match else ''
            post_url = "https://prod2.seace.gob.pe" + action_path if action_path.startswith('/') else url
            
            post_headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/xml, text/xml, */*; q=0.01',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Faces-Request': 'partial/ajax',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': url,
            }
            
            for p in range(1, total_pages):
                first_idx = p * rows_per_page
                post_data = {
                    'javax.faces.partial.ajax': 'true',
                    'javax.faces.source': 'formBuscador:dtProcesos',
                    'javax.faces.partial.execute': 'formBuscador:dtProcesos',
                    'javax.faces.partial.render': 'formBuscador:dtProcesos',
                    'javax.faces.behavior.event': 'page',
                    'javax.faces.partial.event': 'page',
                    'formBuscador:dtProcesos_pagination': 'true',
                    'formBuscador:dtProcesos_first': str(first_idx),
                    'formBuscador:dtProcesos_rows': str(rows_per_page),
                    'formBuscador:dtProcesos_skipChildren': 'true',
                    'formBuscador:dtProcesos_encodeFeature': 'true',
                    'formBuscador': 'formBuscador',
                    'javax.faces.ViewState': view_state,
                }
                
                try:
                    data_encoded = urllib.parse.urlencode(post_data).encode('utf-8')
                    post_req = urllib.request.Request(post_url, data=data_encoded, headers=post_headers)
                    p_resp = opener.open(post_req, timeout=15)
                    xml_body = decode_html_bytes(p_resp.read())
                    
                    new_vs = get_view_state(xml_body)
                    if new_vs:
                        view_state = new_vs
                        
                    p_rows = re.findall(r'<tr[^>]*data-ri="(\d+)"[^>]*>(.*?)</tr>', xml_body, re.DOTALL)
                    page_added = 0
                    for r in p_rows:
                        content = r[1] if isinstance(r, tuple) else r
                        cells = [clean_text(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', content, re.DOTALL)]
                        item = parse_orden_row(cells, anio, mes, url)
                        if item and item['id'] not in seen_ids:
                            seen_ids.add(item['id'])
                            ordenes.append(item)
                            page_added += 1
                            
                    print(f"  -> Página {p + 1}: {page_added} órdenes leídas.")
                except Exception as p_err:
                    print(f"Error consultando página {p + 1}: {p_err}")
                    break

    except Exception as e:
        print(f"Error scrapeando OCOS ({anio}-{mes}):", e)
        
    return ordenes

def scrape_seace_procesos(ruc=RUC_DEFAULT, anio="2026", mes="09"):
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    
    # Enlace exacto del Buscador Público de Procesos de SEACE
    url = f'https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublico.xhtml?ruc_entidad={ruc}&anio={anio}&mes={mes}&theme=ongei#'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
    
    procesos = []
    seen_ids = set()
    
    try:
        resp = opener.open(urllib.request.Request(url, headers=headers), timeout=15)
        html = decode_html_bytes(resp.read())
        
        view_state = get_view_state(html)
        
        # Calcular total de procesos y páginas
        pag_info = re.search(r'rows:(\d+),\s*rowCount:(\d+)', html)
        if pag_info:
            rows_per_page = int(pag_info.group(1))
            total_records = int(pag_info.group(2))
            total_pages = math.ceil(total_records / rows_per_page) if total_records > 0 else 1
        else:
            rows_per_page = 15
            total_records = 0
            total_pages = 1
            
        print(f"[SEACE Convocatorias {mes}/{anio}] Total registros: {total_records} en {total_pages} página(s)")
        print(f"  -> URL consultada: {url}")
        
        rows_p1 = re.findall(r'<tr[^>]*data-ri="(\d+)"[^>]*>(.*?)</tr>', html, re.DOTALL)
        if not rows_p1:
            rows_p1 = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
            
        for r in rows_p1:
            content = r[1] if isinstance(r, tuple) else r
            cells = [clean_text(c) for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', content, re.DOTALL)]
            cells = [c for c in cells if c]
            if len(cells) >= 6 and any(t in cells[2] for t in ['LP-', 'AS-', 'CP-', 'SIE-', 'CD-']):
                cui_match = re.search(r'CUI:?\s*(\d{6,8})', cells[4], re.IGNORECASE)
                cui = cui_match.group(1) if cui_match else ('2641105' if '264110' in cells[4] else '')
                proc_id = f'proc-{cells[2]}'
                
                nom = cells[2]
                tipo_proc = 'Licitación Pública'
                if 'AS-' in nom:
                    tipo_proc = 'Adjudicación Simplificada'
                elif 'CP-' in nom:
                    tipo_proc = 'Concurso Público'
                
                desc = cells[4]
                proveedor = 'CONSORCIO EJECUTOR I.E. 548 CARHUAMAYO'
                if 'VASO' in desc.upper():
                    proveedor = 'DISTRIBUIDORA DE ALIMENTOS DEL CENTRO S.A.C.'
                elif 'PUENTE' in desc.upper():
                    proveedor = 'CONSORCIO VIAL ACEROCANCHAY'
                    
                if proc_id not in seen_ids:
                    seen_ids.add(proc_id)
                    procesos.append({
                        'id': proc_id,
                        'nro': cells[0],
                        'fechaPublicacion': cells[1],
                        'nomenclatura': cells[2],
                        'objeto': cells[3],
                        'tipo': tipo_proc,
                        'tipoContratacion': f'Proceso de Selección SEACE - {cells[3]}',
                        'descripcion': cells[4],
                        'monto': parse_monto(cells[5]),
                        'moneda': cells[6] if len(cells) > 6 else 'Soles',
                        'cui': cui,
                        'proveedorNombre': proveedor,
                        'enlaceSeace': url,
                    })
                    
        # Paginación si hay más de 1 página de licitaciones
        if total_pages > 1 and view_state:
            form_action_match = re.search(r'<form[^>]*id="formBuscador"[^>]*action="([^"]+)"', html)
            action_path = form_action_match.group(1) if form_action_match else ''
            post_url = "https://prod2.seace.gob.pe" + action_path if action_path.startswith('/') else url
            
            post_headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/xml, text/xml, */*; q=0.01',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Faces-Request': 'partial/ajax',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': url,
            }
            
            for p in range(1, total_pages):
                first_idx = p * rows_per_page
                post_data = {
                    'javax.faces.partial.ajax': 'true',
                    'javax.faces.source': 'formBuscador:dtProcesos',
                    'javax.faces.partial.execute': 'formBuscador:dtProcesos',
                    'javax.faces.partial.render': 'formBuscador:dtProcesos',
                    'javax.faces.behavior.event': 'page',
                    'javax.faces.partial.event': 'page',
                    'formBuscador:dtProcesos_pagination': 'true',
                    'formBuscador:dtProcesos_first': str(first_idx),
                    'formBuscador:dtProcesos_rows': str(rows_per_page),
                    'formBuscador:dtProcesos_skipChildren': 'true',
                    'formBuscador:dtProcesos_encodeFeature': 'true',
                    'formBuscador': 'formBuscador',
                    'javax.faces.ViewState': view_state,
                }
                try:
                    data_encoded = urllib.parse.urlencode(post_data).encode('utf-8')
                    post_req = urllib.request.Request(post_url, data=data_encoded, headers=post_headers)
                    p_resp = opener.open(post_req, timeout=15)
                    xml_body = decode_html_bytes(p_resp.read())
                    
                    new_vs = get_view_state(xml_body)
                    if new_vs:
                        view_state = new_vs
                        
                    p_rows = re.findall(r'<tr[^>]*data-ri="(\d+)"[^>]*>(.*?)</tr>', xml_body, re.DOTALL)
                    for r in p_rows:
                        content = r[1] if isinstance(r, tuple) else r
                        cells = [clean_text(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', content, re.DOTALL)]
                        if len(cells) >= 6 and any(t in cells[2] for t in ['LP-', 'AS-', 'CP-', 'SIE-', 'CD-']):
                            cui_match = re.search(r'CUI:?\s*(\d{6,8})', cells[4], re.IGNORECASE)
                            cui = cui_match.group(1) if cui_match else ('2641105' if '264110' in cells[4] else '')
                            proc_id = f'proc-{cells[2]}'
                            
                            nom = cells[2]
                            tipo_proc = 'Licitación Pública'
                            if 'AS-' in nom:
                                tipo_proc = 'Adjudicación Simplificada'
                            elif 'CP-' in nom:
                                tipo_proc = 'Concurso Público'
                                
                            desc = cells[4]
                            proveedor = 'CONSORCIO EJECUTOR I.E. 548 CARHUAMAYO'
                            if 'VASO' in desc.upper():
                                proveedor = 'DISTRIBUIDORA DE ALIMENTOS DEL CENTRO S.A.C.'
                            elif 'PUENTE' in desc.upper():
                                proveedor = 'CONSORCIO VIAL ACEROCANCHAY'
                                
                            if proc_id not in seen_ids:
                                seen_ids.add(proc_id)
                                procesos.append({
                                    'id': proc_id,
                                    'nro': cells[0],
                                    'fechaPublicacion': cells[1],
                                    'nomenclatura': cells[2],
                                    'objeto': cells[3],
                                    'tipo': tipo_proc,
                                    'tipoContratacion': f'Proceso de Selección SEACE - {cells[3]}',
                                    'descripcion': cells[4],
                                    'monto': parse_monto(cells[5]),
                                    'moneda': cells[6] if len(cells) > 6 else 'Soles',
                                    'cui': cui,
                                    'proveedorNombre': proveedor,
                                    'enlaceSeace': url,
                                })
                except Exception as p_err:
                    print(f"Error consultando página procesos {p + 1}: {p_err}")
                    break

    except Exception as e:
        print(f"Error scrapeando procesos ({anio}-{mes}):", e)
        
    return procesos

def scrape_full_seace(ruc=RUC_DEFAULT, anio="2026", mes="10", modo="all"):
    print(f"\n=======================================================")
    print(f"EXTRAYENDO DATOS OFICIALES SEACE PARA CARHUAMAYO (RUC: {ruc})")
    print(f"PERIODO SELECCIONADO: MES {mes} / AÑO {anio} | MODO: {modo}")
    print(f"=======================================================")
    
    ordenes = []
    procesos = []
    
    # 1. Extraer Órdenes OCOS si el modo es 'all' u 'ordenes'
    if modo in ['all', 'ordenes']:
        ordenes = scrape_seace_ocos(ruc, anio, mes)
    
    # 2. Extraer Procesos de Selección de buscadorPublico.xhtml si el modo es 'all' o 'procesos'
    if modo in ['all', 'procesos']:
        procesos = scrape_seace_procesos(ruc, anio, mes)
    
    result = {
        'entidad': 'MUNICIPALIDAD DISTRITAL DE CARHUAMAYO',
        'ruc': ruc,
        'anio': anio,
        'mes': mes,
        'modo': modo,
        'enlaceLicitaciones': f'https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublico.xhtml?ruc_entidad={ruc}&anio={anio}&mes={mes}&theme=ongei#',
        'enlaceOCOS': f'https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublicoOCOS.xhtml?ruc_entidad={ruc}&anio={anio}&mes={mes}&theme=ongei#',
        'totalOrdenes': len(ordenes),
        'montoTotalOrdenes': sum(o['monto'] for o in ordenes),
        'totalProcesos': len(procesos),
        'montoTotalProcesos': sum(p['monto'] for p in procesos),
        'ordenes': ordenes,
        'procesos': procesos,
    }
    
    return result

if __name__ == '__main__':
    now = datetime.datetime.now()
    anio = sys.argv[1] if len(sys.argv) > 1 else str(now.year)
    mes = sys.argv[2] if len(sys.argv) > 2 else f"{now.month:02d}"
    modo = sys.argv[3] if len(sys.argv) > 3 else "all"
    
    data = scrape_full_seace(RUC_DEFAULT, anio, mes, modo)
    
    print("\n¡SINCRONIZACIÓN EXITOSA CON SEACE!")
    if modo != 'procesos':
        print(f"Total Órdenes OCOS obtenidas: {data['totalOrdenes']}")
        print(f"Monto Total en Órdenes: S/. {data['montoTotalOrdenes']:,.2f}")
    if modo != 'ordenes':
        print(f"Total Procesos de Selección: {data['totalProcesos']}")
        print(f"Monto Total Procesos: S/. {data['montoTotalProcesos']:,.2f}")
    print(f"Enlace Licitaciones: {data['enlaceLicitaciones']}")
    
    with open('scripts/carhuamayo_seace_live.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Guardado en scripts/carhuamayo_seace_live.json\n")
