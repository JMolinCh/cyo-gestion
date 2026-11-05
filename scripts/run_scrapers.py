"""
Script maestro de sincronización diaria MEF y SEACE
Municipalidad Distrital de Carhuamayo
Ejecuta la extracción de Consulta Amigable (MEF) y el buscador de contrataciones (SEACE)
"""

import sys
import os
import json
import datetime

# Asegurar compatibilidad de codificación en Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Importar los módulos scrapers
from mef_scraper import scrape_carhuamayo_mef
from seace_scraper import scrape_full_seace, RUC_DEFAULT

def main():
    now = datetime.datetime.now()
    anio = now.year
    mes_actual = f"{now.month:02d}"
    print(f"================================================================")
    print(f"SINCRONIZACION DIARIA CARHUAMAYO - {now.strftime('%d/%m/%Y %H:%M:%S')}")
    print(f"================================================================")

    # 1. EJECUTAR MEF CONSULTA AMIGABLE
    print("\n[1/2] Conectando con MEF - Consulta Amigable...")
    try:
        mef_data = scrape_carhuamayo_mef(anio)
        mef_path = os.path.join(os.path.dirname(__file__), 'carhuamayo_mef_live.json')
        with open(mef_path, 'w', encoding='utf-8') as f:
            json.dump(mef_data, f, ensure_ascii=False, indent=2)
        print(f"[OK] MEF exitoso: PIM S/ {mef_data['totales'].get('pim', 0):,.2f} | Devengado S/ {mef_data['totales'].get('devengado', 0):,.2f} ({mef_data['totales'].get('avancePorcentaje', 0)}%)")
    except Exception as e:
        print(f"[ERROR] Error al sincronizar MEF: {e}")

    # 2. EJECUTAR SEACE CONTRATACIONES
    print("\n[2/2] Conectando con SEACE - OSCE...")
    try:
        # Intentar con el mes en curso
        seace_data = scrape_full_seace(RUC_DEFAULT, str(anio), mes_actual, "all")
        # Si aún no hay órdenes en el mes actual (común a inicios de mes), consultar el mes previo
        if seace_data.get('totalOrdenes', 0) == 0 and now.month > 1:
            mes_prev = f"{now.month - 1:02d}"
            print(f"  -> Mes {mes_actual} sin ordenes aun. Consultando mes cerrado ({mes_prev}/{anio})...")
            seace_data = scrape_full_seace(RUC_DEFAULT, str(anio), mes_prev, "all")

        seace_path = os.path.join(os.path.dirname(__file__), 'carhuamayo_seace_live.json')
        with open(seace_path, 'w', encoding='utf-8') as f:
            json.dump(seace_data, f, ensure_ascii=False, indent=2)
        print(f"[OK] SEACE exitoso: {seace_data.get('totalOrdenes', 0)} ordenes (S/ {seace_data.get('montoTotalOrdenes', 0):,.2f}) y {seace_data.get('totalProcesos', 0)} procesos")
    except Exception as e:
        print(f"[ERROR] Error al sincronizar SEACE: {e}")

    print("\n================================================================")
    print("Sincronizacion completada exitosamente.")
    print("================================================================\n")

if __name__ == '__main__':
    main()
