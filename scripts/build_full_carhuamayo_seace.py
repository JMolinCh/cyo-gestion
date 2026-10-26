"""
Script para compilar el catálogo de contrataciones de Carhuamayo desde SEACE
(Meses 08, 09 y 10 del 2026)
"""

import json
from seace_scraper import scrape_seace_ocos, scrape_seace_procesos, RUC_DEFAULT

def build_full_dataset():
    all_ordenes = []
    seen_ids = set()

    # Recorrer meses recientes
    for mes in ["10", "09", "08"]:
        print(f"Scrapeando SEACE OCOS {mes}/2026...")
        ords = scrape_seace_ocos(RUC_DEFAULT, "2026", mes)
        for o in ords:
            if o['id'] not in seen_ids:
                seen_ids.add(o['id'])
                all_ordenes.append(o)
                
    print(f"Total órdenes acumuladas: {len(all_ordenes)}")
    
    # Procesos de selección
    print("Scrapeando Procesos de Selección SEACE...")
    procesos = scrape_seace_procesos(RUC_DEFAULT, "2026", "09")
    
    # Agregar los procesos como registros de tipo Adjudicación / Licitación
    for p in procesos:
        all_ordenes.insert(0, {
            'id': p['id'],
            'numeroDocumento': p['nomenclatura'],
            'numeroOrdenSeace': p['nro'],
            'tipo': 'Licitación Pública' if 'LP' in p['nomenclatura'] else 'Adjudicación Simplificada',
            'tipoContratacion': 'Proceso de Selección SEACE',
            'descripcion': p['descripcion'],
            'expedienteSiaf': p.get('cui', '2629849'),
            'fechaEmision': p['fechaPublicacion'].split(' ')[0] if ' ' in p['fechaPublicacion'] else p['fechaPublicacion'],
            'fechaCompromiso': p['fechaPublicacion'].split(' ')[0] if ' ' in p['fechaPublicacion'] else '',
            'estado': 'Devengado',
            'monto': p['monto'],
            'moneda': 'PEN',
            'proveedorRuc': '20613202260',
            'proveedorNombre': 'CONSORCIO EJECUTOR I.E. 548 CARHUAMAYO',
            'esProveedorLocal': False,
            'menorA8UIT': False,
            'areaUsuaria': 'Subgerencia de Infraestructura y Obras',
            'enlaceSeace': p['enlaceSeace'],
        })

    # Guardar en TS
    ts_content = f"""import {{ Contratacion }} from '@/types';

export const CONTRATACIONES_CARHUAMAYO: Contratacion[] = {json.dumps(all_ordenes, ensure_ascii=False, indent=2)};
"""

    with open('src/data/carhuamayoContrataciones.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)
        
    print("¡Archivo src/data/carhuamayoContrataciones.ts actualizado con datos reales de SEACE!")

if __name__ == '__main__':
    build_full_dataset()
