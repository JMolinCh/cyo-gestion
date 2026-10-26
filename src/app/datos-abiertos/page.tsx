'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Database, 
  ArrowLeft, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  Code2, 
  ShieldCheck, 
  ExternalLink,
  BookOpen,
  Share2
} from 'lucide-react';

import { PRESUPUESTO_GENERAL_INFO, RUBROS_PRESUPUESTO, GENERICAS_GASTO, EJECUCION_MENSUAL_2026 } from '@/data/carhuamayoPresupuesto';
import { CONTRATACIONES_CARHUAMAYO } from '@/data/carhuamayoContrataciones';
import { OBRAS_CARHUAMAYO } from '@/data/carhuamayoObras';
import { EXPEDIENTES_RECIENTES } from '@/data/carhuamayoModernizacion';

export default function DatosAbiertosPage() {
  const downloadJSON = (data: any, filename: string) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${filename}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadCSV = (headers: string[], rows: any[][], filename: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadPresupuestoCSV = () => {
    const headers = ['CodigoRubro', 'Rubro', 'FuenteFinanciamiento', 'PIA', 'PIM', 'Devengado', 'Girado', 'AvancePorcentaje'];
    const rows = RUBROS_PRESUPUESTO.map((r) => [
      `"${r.codigoRubro}"`,
      `"${r.rubro}"`,
      `"${r.fuenteFinanciamiento}"`,
      r.pia,
      r.pim,
      r.devengado,
      r.girado,
      r.avancePorcentaje,
    ]);
    downloadCSV(headers, rows, 'carhuamayo_presupuesto_2026');
  };

  const downloadContratacionesCSV = () => {
    const headers = ['NumeroDocumento', 'Tipo', 'FechaEmision', 'RUC', 'Proveedor', 'EsLocal', 'Descripcion', 'Monto', 'Estado', 'AreaUsuaria', 'Menor8UIT'];
    const rows = CONTRATACIONES_CARHUAMAYO.map((c) => [
      `"${c.numeroDocumento}"`,
      `"${c.tipo}"`,
      `"${c.fechaEmision}"`,
      `"${c.proveedorRuc}"`,
      `"${c.proveedorNombre.replace(/"/g, '""')}"`,
      c.esProveedorLocal ? 'SI' : 'NO',
      `"${c.descripcion.replace(/"/g, '""')}"`,
      c.monto,
      `"${c.estado}"`,
      `"${c.areaUsuaria}"`,
      c.menorA8UIT ? 'SI' : 'NO',
    ]);
    downloadCSV(headers, rows, 'carhuamayo_contrataciones_2026');
  };

  const downloadObrasCSV = () => {
    const headers = ['CUI', 'Proyecto', 'Sector', 'CostoActualizado', 'Devengado', 'AvanceFisico', 'AvanceFinanciero', 'Estado', 'Contratista', 'Supervisor', 'Beneficiarios'];
    const rows = OBRAS_CARHUAMAYO.map((o) => [
      `"${o.cui}"`,
      `"${o.nombre.replace(/"/g, '""')}"`,
      `"${o.sector}"`,
      o.costoActualizado,
      o.devengadoAcumulado,
      o.avanceFisico,
      o.avanceFinanciero,
      `"${o.estado}"`,
      `"${o.contratista.replace(/"/g, '""')}"`,
      `"${o.supervisor.replace(/"/g, '""')}"`,
      o.beneficiariosAprox,
    ]);
    downloadCSV(headers, rows, 'carhuamayo_obras_publicas_2026');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-muni-600 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-muni-700 font-bold">Datos Abiertos</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-muni-600" />
            Centro de Datos Abiertos de Carhuamayo (Open Data)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Microdatos públicos en formatos abiertos (CSV, JSON) para periodistas, investigadores y ciudadanos
          </p>
        </div>

        <a
          href="https://www.datosabiertos.gob.pe/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow transition"
        >
          <span>Plataforma Nacional de Datos Abiertos</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Tarjeta de Principios de Datos Abiertos */}
      <div className="bg-gradient-to-r from-muni-950 via-muni-900 to-slate-900 text-white p-6 rounded-2xl border border-muni-800 shadow-md space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Principios de Datos Abiertos del Estado Peruano
        </div>
        <h2 className="text-base font-bold text-white">
          Acceso Libre, Reutilizable y sin Restricciones
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          En cumplimiento del Decreto Legislativo N° 1412 (Ley de Gobierno Digital) y la Política Nacional de Transformación Digital, la Municipalidad Distrital de Carhuamayo publica sus microdatos en formatos abiertos para incentivar la investigación, la contraloría ciudadana y el desarrollo de aplicaciones cívicas.
        </p>
      </div>

      {/* Catálogo de Conjuntos de Datos (Datasets) */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-muni-600" />
          Conjuntos de Datos Disponibles para Descarga
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Dataset 1: Presupuesto */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between hover:border-muni-300 transition">
            <div className="space-y-2">
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                SIAF · MEF 2026
              </span>
              <h3 className="font-bold text-slate-800 text-sm">
                Ejecución Presupuestal y Fuentes
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Contiene el PIA, PIM, Certificación, Devengado y Girado por rubro y genéricas del distrito de Carhuamayo.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Formato: CSV, JSON · Frecuencia: Mensual
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={downloadPresupuestoCSV}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-muni-50 hover:bg-muni-100 text-muni-700 py-2 rounded-lg text-xs font-bold border border-muni-200 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-muni-600" />
                Descargar CSV
              </button>

              <button
                onClick={() => downloadJSON(RUBROS_PRESUPUESTO, 'carhuamayo_presupuesto_2026')}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition"
              >
                <FileCode className="w-3.5 h-3.5 text-slate-600" />
                JSON
              </button>
            </div>
          </div>

          {/* Dataset 2: Contrataciones */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between hover:border-muni-300 transition">
            <div className="space-y-2">
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                SEACE · Compras &lt; 8 UIT
              </span>
              <h3 className="font-bold text-slate-800 text-sm">
                Órdenes de Compra y Servicio
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Detalle íntegro de proveedores, RUC, montos, áreas solicitantes y descripciones de gasto público.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Formato: CSV, JSON · Frecuencia: En tiempo real
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={downloadContratacionesCSV}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 py-2 rounded-lg text-xs font-bold border border-amber-200 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                Descargar CSV
              </button>

              <button
                onClick={() => downloadJSON(CONTRATACIONES_CARHUAMAYO, 'carhuamayo_contrataciones_2026')}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition"
              >
                <FileCode className="w-3.5 h-3.5 text-slate-600" />
                JSON
              </button>
            </div>
          </div>

          {/* Dataset 3: Obras Públicas */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between hover:border-muni-300 transition">
            <div className="space-y-2">
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Invierte.pe · Infobras
              </span>
              <h3 className="font-bold text-slate-800 text-sm">
                Obras Públicas Georreferenciadas
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Proyectos con Código Único de Inversiones (CUI), contratistas, avances físicos, financieros y geolocalización.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Formato: CSV, JSON · Frecuencia: Quincenal
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={downloadObrasCSV}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-2 rounded-lg text-xs font-bold border border-emerald-200 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Descargar CSV
              </button>

              <button
                onClick={() => downloadJSON(OBRAS_CARHUAMAYO, 'carhuamayo_obras_2026')}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition"
              >
                <FileCode className="w-3.5 h-3.5 text-slate-600" />
                JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ejemplos de Consumo vía API REST */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-muni-600" />
              Acceso Programático vía API REST
            </h3>
            <p className="text-xs text-slate-500">
              Endpoints públicos para integrar en tus sistemas, análisis en Python o tableros PowerBI
            </p>
          </div>
          <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
            HTTP GET
          </span>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto space-y-2">
            <p className="text-slate-400"># Obtener contrataciones en tiempo real (JSON)</p>
            <p className="text-emerald-400">curl -X GET &quot;https://gestion-carhuamayo.gob.pe/api/contrataciones&quot;</p>
            <p className="text-slate-400 pt-2"># Obtener ejecución presupuestal SIAF</p>
            <p className="text-emerald-400">curl -X GET &quot;https://gestion-carhuamayo.gob.pe/api/presupuesto&quot;</p>
            <p className="text-slate-400 pt-2"># En Python:</p>
            <p className="text-blue-300">import requests</p>
            <p className="text-blue-300">data = requests.get(&apos;https://gestion-carhuamayo.gob.pe/api/obras&apos;).json()</p>
          </div>
        </div>
      </div>
    </div>
  );
}
