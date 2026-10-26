'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Tag,
  RefreshCw,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  FileCheck
} from 'lucide-react';

import StatCard from '@/components/StatCard';
import ProcurementTable from '@/components/ProcurementTable';
import { CONTRATACIONES_CARHUAMAYO, PROCESOS_HISTORICOS_CARHUAMAYO } from '@/data/carhuamayoContrataciones';
import { Contratacion } from '@/types';

const STORAGE_KEY_SEACE = 'carhuamayo_seace_v6';
const RUC_CARHUAMAYO = '20185644830';

// FILTRADO ESTRICTO: Licitaciones Públicas y Procesos de Selección SEACE (buscadorPublico.xhtml)
// NUNCA debe incluir Órdenes de Compra ni Órdenes de Servicio
const isLicitacionOProceso = (item: Contratacion): boolean => {
  if (!item) return false;
  // Descartar categóricamente cualquier orden OCOS
  if (item.tipo === 'Orden de Compra' || item.tipo === 'Orden de Servicio') {
    return false;
  }
  if (item.id && item.id.startsWith('seace-')) {
    return false;
  }
  // Procesos de selección oficiales
  return (
    (item.id && item.id.startsWith('proc-')) ||
    item.tipo === 'Licitación Pública' ||
    item.tipo === 'Adjudicación Simplificada' ||
    item.tipo === 'Concurso Público' ||
    item.tipo === 'Subasta Inversa' ||
    item.tipo === 'Contratación Directa' ||
    item.tipo === 'Proceso de Selección'
  );
};

// FILTRADO ESTRICTO: Solo Órdenes de Compra y Órdenes de Servicio OCOS (buscadorPublicoOCOS.xhtml)
const isOrdenOCOS = (item: Contratacion): boolean => {
  if (!item) return false;
  return item.tipo === 'Orden de Compra' || item.tipo === 'Orden de Servicio';
};

// Verificador estricto de mes y año para Convocatorias Públicas
const isProcessOfSelectedMonth = (fecha: string, anio: string, mes: string): boolean => {
  if (!fecha) return false;
  // Formato DD/MM/YYYY o DD/MM/YYYY HH:mm
  const matchSlash = fecha.match(/(?:^|\D)(\d{2})\/(\d{2})\/(\d{4})/);
  if (matchSlash) {
    return matchSlash[2] === mes && matchSlash[3] === anio;
  }
  // Formato YYYY-MM-DD
  const matchDash = fecha.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (matchDash) {
    return matchDash[1] === anio && matchDash[2] === mes;
  }
  return fecha.includes(`/${mes}/${anio}`) || fecha.includes(`${anio}-${mes}`);
};

export default function AbastecimientoPage() {
  const [contrataciones, setContrataciones] = useState<Contratacion[]>(CONTRATACIONES_CARHUAMAYO);
  const [selectedAnio, setSelectedAnio] = useState('2026');
  const [selectedMes, setSelectedMes] = useState('10');
  const [isScrapingSeace, setIsScrapingSeace] = useState(false);
  const [isScrapingLicitaciones, setIsScrapingLicitaciones] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'todas' | 'procesos' | 'proveedores'>('todas');
  const [filtroProcesosModo, setFiltroProcesosModo] = useState<'mes' | 'todos'>('mes');

  // Cargar desde LocalStorage si existe y sanear
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SEACE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setContrataciones(parsed);
        }
      }
    } catch (e) {
      console.error('Error cargando caché SEACE:', e);
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  // Scrapear en Vivo estrictamente ÓRDENES OCOS desde buscadorPublicoOCOS.xhtml
  const handleScrapeOrdenesLive = async () => {
    setIsScrapingSeace(true);
    try {
      const res = await fetch('/api/contrataciones/seace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anio: selectedAnio, mes: selectedMes, modo: 'ordenes' }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || 'Error al conectar con el Reporte OCOS de SEACE');
      }

      const seaceData = json.data;
      const newOrders: Contratacion[] = seaceData.ordenes || [];

      // Mantener procesos intactos y refrescar únicamente órdenes del mes consultado
      setContrataciones((prev) => {
        const procesosOnly = prev.filter(isLicitacionOProceso);
        const otherOrders = prev.filter(
          (c) =>
            isOrdenOCOS(c) &&
            !c.id.startsWith(`seace-${selectedAnio}-${selectedMes}`)
        );
        const combined = [...procesosOnly, ...newOrders, ...otherOrders];
        localStorage.setItem(STORAGE_KEY_SEACE, JSON.stringify(combined));
        return combined;
      });

      setActiveTab('todas');
      if (newOrders.length > 0) {
        showNotification(
          `¡Órdenes OCOS sincronizadas para ${selectedMes}/${selectedAnio}! Se obtuvieron ${newOrders.length} órdenes de compra y servicio (todas las hojas de SEACE).`
        );
      } else {
        showNotification(
          `Consulta OCOS para ${selectedMes}/${selectedAnio}: 0 órdenes emitidas en este periodo.`
        );
      }
    } catch (err: any) {
      console.error('Error al sincronizar Órdenes OCOS:', err);
      alert(`No se pudo conectar con SEACE OCOS: ${err.message}. Compruebe la conectividad.`);
    } finally {
      setIsScrapingSeace(false);
    }
  };

  // Scrapear en Vivo estrictamente LICITACIONES Y PROCESOS desde buscadorPublico.xhtml
  const handleScrapeLicitacionesLive = async () => {
    setIsScrapingLicitaciones(true);
    try {
      const res = await fetch('/api/contrataciones/seace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anio: selectedAnio, mes: selectedMes, modo: 'procesos' }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || 'Error al conectar con el Buscador Público de Procesos SEACE');
      }

      const seaceData = json.data;
      const liveProcesos = seaceData.procesos || [];

      // Mapear procesos obtenidos (SOLO LICITACIONES)
      const mappedProcesos: Contratacion[] = liveProcesos.map((p: any) => ({
        id: p.id,
        numeroDocumento: p.nomenclatura,
        numeroOrdenSeace: p.nro,
        tipo: p.tipo || 'Licitación Pública',
        tipoContratacion: p.tipoContratacion || `Proceso de Selección SEACE - ${p.objeto || 'Obra'}`,
        descripcion: p.descripcion,
        expedienteSiaf: p.cui || '',
        fechaEmision: p.fechaPublicacion ? p.fechaPublicacion.split(' ')[0] : `${selectedAnio}-${selectedMes}-01`,
        fechaCompromiso: p.fechaPublicacion ? p.fechaPublicacion.split(' ')[0] : '',
        estado: 'Adjudicado',
        monto: p.monto,
        moneda: 'PEN',
        proveedorRuc: p.proveedorRuc || '20613202260',
        proveedorNombre: p.proveedorNombre || 'CONSORCIO EJECUTOR I.E. 548 CARHUAMAYO',
        esProveedorLocal: false,
        menorA8UIT: false,
        areaUsuaria: 'Subgerencia de Infraestructura y Obras',
        enlaceSeace: p.enlaceSeace || `https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublico.xhtml?ruc_entidad=${RUC_CARHUAMAYO}&anio=${selectedAnio}&mes=${selectedMes}&theme=ongei#`,
      }));

      // Actualizar catálogo: mantener órdenes intactas y refrescar solo licitaciones
      setContrataciones((prev) => {
        const ordenesOnly = prev.filter(isOrdenOCOS);
        const otherProcs = prev.filter(
          (c) =>
            isLicitacionOProceso(c) &&
            !isProcessOfSelectedMonth(c.fechaEmision, selectedAnio, selectedMes)
        );
        const updated = [...mappedProcesos, ...otherProcs, ...ordenesOnly];
        localStorage.setItem(STORAGE_KEY_SEACE, JSON.stringify(updated));
        return updated;
      });

      // Asegurar que el usuario vea de inmediato la pestaña de licitaciones
      setActiveTab('procesos');
      setFiltroProcesosModo('mes');

      if (liveProcesos.length > 0) {
        showNotification(
          `¡Licitaciones SEACE sincronizadas para ${selectedMes}/${selectedAnio}! Se detectó ${liveProcesos.length} convocatoria(s) en buscadorPublico.xhtml.`
        );
      } else {
        showNotification(
          `Buscador SEACE consultado para ${selectedMes}/${selectedAnio}: 0 convocatorias registradas en este mes en buscadorPublico.xhtml.`
        );
      }
    } catch (err: any) {
      console.error('Error al scrapear licitaciones SEACE:', err);
      alert(`No se pudo conectar con el Buscador Público de SEACE: ${err.message}`);
    } finally {
      setIsScrapingLicitaciones(false);
    }
  };

  // Separación estricta y blindada:
  // 1. Solo Órdenes de Compra y Órdenes de Servicio (OCOS)
  const ordenesList = contrataciones.filter(isOrdenOCOS);

  // 2. Solo Convocatorias Públicas SEACE (Licitaciones Públicas / Adjudicaciones)
  // CERO órdenes permitidas en esta lista
  const todosLosProcesos = contrataciones.filter(isLicitacionOProceso);

  // Procesos de selección filtrados según el mes y año consultado
  const procesosDelMes = todosLosProcesos.filter((p) =>
    isProcessOfSelectedMonth(p.fechaEmision, selectedAnio, selectedMes)
  );

  // Lista de procesos a mostrar según el modo de vista (por mes o todos)
  const procesosList = filtroProcesosModo === 'mes' ? procesosDelMes : todosLosProcesos;

  // Totales específicos de Órdenes OCOS
  const totalMontoOrdenes = ordenesList.reduce((sum, item) => sum + item.monto, 0);
  const totalMenores8UIT = ordenesList.filter((item) => item.menorA8UIT).length;
  const montoMenores8UIT = ordenesList
    .filter((item) => item.menorA8UIT)
    .reduce((sum, item) => sum + item.monto, 0);

  const totalLocales = ordenesList.filter((item) => item.esProveedorLocal).length;
  const totalMontoProcesos = procesosList.reduce((sum, item) => sum + item.monto, 0);

  // Top proveedores por monto en órdenes OCOS
  const proveedorMontos: Record<string, { ruc: string; total: number; count: number; esLocal: boolean }> = {};
  ordenesList.forEach((c) => {
    if (!proveedorMontos[c.proveedorNombre]) {
      proveedorMontos[c.proveedorNombre] = {
        ruc: c.proveedorRuc,
        total: 0,
        count: 0,
        esLocal: c.esProveedorLocal,
      };
    }
    proveedorMontos[c.proveedorNombre].total += c.monto;
    proveedorMontos[c.proveedorNombre].count += 1;
  });

  const topProveedores = Object.entries(proveedorMontos)
    .map(([nombre, data]) => ({ nombre, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // URLs oficiales de SEACE para el periodo seleccionado con '#'
  const urlOficialProcesos = `https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublico.xhtml?ruc_entidad=${RUC_CARHUAMAYO}&anio=${selectedAnio}&mes=${selectedMes}&theme=ongei#`;
  const urlOficialOCOS = `https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublicoOCOS.xhtml?ruc_entidad=${RUC_CARHUAMAYO}&anio=${selectedAnio}&mes=${selectedMes}&theme=ongei#`;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Toast Notificación */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-500 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-muni-600 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-muni-700 font-bold">Módulo de Abastecimiento</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-muni-600" />
              Contrataciones, Abastecimiento y Compras Públicas (SEACE)
            </h1>

            <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-muni-600" /> RUC Entidad: {RUC_CARHUAMAYO}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Buscador Público de Procesos y Registro de Órdenes OCOS de la Municipalidad Distrital de Carhuamayo
          </p>
        </div>

        {/* Panel de Sincronización en Vivo SEACE */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold pl-2">Año:</span>
            <select
              value={selectedAnio}
              onChange={(e) => setSelectedAnio(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-muni-500"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold">Mes:</span>
            <select
              value={selectedMes}
              onChange={(e) => setSelectedMes(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-muni-500"
            >
              <option value="12">12 - Diciembre</option>
              <option value="11">11 - Noviembre</option>
              <option value="10">10 - Octubre</option>
              <option value="09">09 - Setiembre</option>
              <option value="08">08 - Agosto</option>
              <option value="07">07 - Julio</option>
              <option value="06">06 - Junio</option>
              <option value="05">05 - Mayo</option>
              <option value="04">04 - Abril</option>
              <option value="03">03 - Marzo</option>
              <option value="02">02 - Febrero</option>
              <option value="01">01 - Enero</option>
            </select>
          </div>

          {activeTab === 'procesos' ? (
            <button
              onClick={handleScrapeLicitacionesLive}
              disabled={isScrapingLicitaciones}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow transition ${
                isScrapingLicitaciones
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
              }`}
              title="Scrapear en vivo únicamente Convocatorias y Licitaciones de buscadorPublico.xhtml"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScrapingLicitaciones ? 'animate-spin' : ''}`} />
              {isScrapingLicitaciones ? 'Scrapeando Licitaciones...' : `Scrapear Licitaciones (${selectedMes}/${selectedAnio})`}
            </button>
          ) : (
            <button
              onClick={handleScrapeOrdenesLive}
              disabled={isScrapingSeace}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow transition ${
                isScrapingSeace
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
              title="Scrapear en vivo únicamente Órdenes de Compra y Servicio de buscadorPublicoOCOS.xhtml"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScrapingSeace ? 'animate-spin' : ''}`} />
              {isScrapingSeace ? 'Scrapeando Órdenes...' : `Scrapear Órdenes OCOS (${selectedMes}/${selectedAnio})`}
            </button>
          )}
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total en Órdenes (OCOS)"
          value={`S/. ${(totalMontoOrdenes / 1000).toFixed(1)}k`}
          subtitle={`${ordenesList.length} órdenes de compra y servicio`}
          icon={ShoppingBag}
          colorTheme="blue"
        />

        <StatCard
          title="Compras Menores a 8/9 UIT"
          value={`${totalMenores8UIT} Órdenes`}
          subtitle={`S/. ${(montoMenores8UIT / 1000).toFixed(1)}k acumulados`}
          icon={Tag}
          colorTheme="amber"
          trend={{ value: 'Adquisición directa', isNeutral: true }}
        />

        <StatCard
          title="Proveedores Locales"
          value={`${totalLocales} de ${ordenesList.length}`}
          subtitle="Comercio en Junín / Carhuamayo"
          icon={Building2}
          colorTheme="emerald"
          trend={{
            value: `${((totalLocales / (ordenesList.length || 1)) * 100).toFixed(0)}% de las órdenes`,
            isPositive: true,
          }}
        />

        <StatCard
          title={`Licitaciones (${selectedMes}/${selectedAnio})`}
          value={`${procesosDelMes.length} Convocatorias`}
          subtitle={
            procesosDelMes.length > 0
              ? `S/. ${(procesosDelMes.reduce((s, p) => s + p.monto, 0) / 1000).toFixed(1)}k en el mes`
              : `0 en este mes · ${todosLosProcesos.length} en el catálogo`
          }
          icon={TrendingUp}
          colorTheme="purple"
          trend={{
            value: procesosDelMes.length > 0 ? 'Convocado en el mes' : 'Sin convocatorias este mes',
            isPositive: procesosDelMes.length > 0,
            isNeutral: procesosDelMes.length === 0,
          }}
        />
      </div>

      {/* Enlaces de Verificación a los Portales Oficiales del SEACE */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border border-slate-800">
        <div className="space-y-0.5">
          <div className="font-bold text-slate-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Fuentes Oficiales SEACE Conectadas (RUC: {RUC_CARHUAMAYO} - Periodo {selectedMes}/{selectedAnio})
          </div>
          <p className="text-slate-400 text-[11px]">
            Puedes contrastar cualquier registro directamente en las plataformas del Organismo Supervisor de las Contrataciones del Estado (OSCE).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={urlOficialOCOS}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <span>Ver Reporte OCOS Oficial</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={urlOficialProcesos}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-muni-600 hover:bg-muni-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
          >
            <span>Ver Buscador Procesos SEACE</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Pestañas de Visualización */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('todas')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'todas'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Órdenes de Compra y Servicio OCOS ({ordenesList.length})
        </button>

        <button
          onClick={() => setActiveTab('procesos')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'procesos'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Licitaciones SEACE ({filtroProcesosModo === 'mes' ? procesosDelMes.length : todosLosProcesos.length})
        </button>

        <button
          onClick={() => setActiveTab('proveedores')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'proveedores'
              ? 'bg-slate-800 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ranking de Proveedores ({topProveedores.length})
        </button>
      </div>

      {/* Contenido según pestaña */}
      {activeTab === 'todas' && (
        <div className="space-y-4">
          {/* Panel Superior de Órdenes OCOS con Enlace Oficial y Botón de Scrapeo Exclusivo de Órdenes */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs border border-slate-800 shadow">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded text-[10px] border border-blue-500/30">
                  ENLACE OFICIAL OSCE OCOS
                </span>
                <span className="font-bold text-slate-100">Reporte de Registro de Órdenes de Compra y Servicio</span>
              </div>
              <p className="text-[11px] font-mono text-slate-300 break-all">
                https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublicoOCOS.xhtml?ruc_entidad={RUC_CARHUAMAYO}&anio={selectedAnio}&mes={selectedMes}&theme=ongei#
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <button
                onClick={handleScrapeOrdenesLive}
                disabled={isScrapingSeace}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow transition ${
                  isScrapingSeace
                    ? 'bg-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
                title="Consultar y scrapear en tiempo real las órdenes OCOS de este mes"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScrapingSeace ? 'animate-spin' : ''}`} />
                {isScrapingSeace ? 'Scrapeando Órdenes...' : `Scrapear Órdenes (${selectedMes}/${selectedAnio})`}
              </button>

              <a
                href={urlOficialOCOS}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition"
                title="Abrir página oficial de Órdenes OCOS en SEACE"
              >
                <span>Abrir OCOS en SEACE</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Registro de Órdenes de Compra y Órdenes de Servicio (OCOS)
              </h2>
              <p className="text-xs text-slate-500">
                Solo órdenes emitidas O/C y O/S (sin licitaciones ni procesos de selección mayores)
              </p>
            </div>
            <span className="text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              Total: {ordenesList.length} órdenes
            </span>
          </div>

          <ProcurementTable contrataciones={ordenesList} soloOrdenes={true} />
        </div>
      )}

      {activeTab === 'procesos' && (
        <div className="space-y-4">
          {/* Panel Superior de la Pestaña con Enlace y Botón de Scrapeo Exclusivo de Licitaciones */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs border border-slate-800 shadow">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-500/30">
                  ENLACE OFICIAL OSCE
                </span>
                <span className="font-bold text-slate-100">Buscador Público de Procesos de Selección</span>
              </div>
              <p className="text-[11px] font-mono text-slate-300 break-all">
                https://prod2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/ongei/buscadorPublico.xhtml?ruc_entidad={RUC_CARHUAMAYO}&anio={selectedAnio}&mes={selectedMes}&theme=ongei#
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <button
                onClick={handleScrapeLicitacionesLive}
                disabled={isScrapingLicitaciones}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow transition ${
                  isScrapingLicitaciones
                    ? 'bg-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                }`}
                title="Consultar y scrapear en tiempo real este enlace de SEACE"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScrapingLicitaciones ? 'animate-spin' : ''}`} />
                {isScrapingLicitaciones ? 'Scrapeando Licitaciones...' : `Scrapear Licitaciones (${selectedMes}/${selectedAnio})`}
              </button>

              <a
                href={urlOficialProcesos}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition"
                title="Abrir página oficial de SEACE en una nueva pestaña"
              >
                <span>Abrir en SEACE</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Barra de Filtro Mes vs Todos */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muni-600" />
                Convocatorias Públicas en SEACE
              </h2>
              <p className="text-xs text-slate-500">
                Licitaciones Públicas, Adjudicaciones y Concursos de Carhuamayo según el buscador oficial OSCE
              </p>
            </div>

            {/* Alternador de Vista: Mes vs Todo el Catálogo */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFiltroProcesosModo('mes')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filtroProcesosModo === 'mes'
                    ? 'bg-white text-muni-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Solo Mes {selectedMes}/{selectedAnio} ({procesosDelMes.length})
              </button>
              <button
                onClick={() => setFiltroProcesosModo('todos')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filtroProcesosModo === 'todos'
                    ? 'bg-white text-muni-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ver Todas las Convocatorias ({todosLosProcesos.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {procesosList.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Sin convocatorias públicas registradas en {selectedMes}/{selectedAnio}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    En la plataforma oficial de SEACE no se publicaron procesos de licitación pública ni adjudicaciones en este mes específico para Carhuamayo.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5 max-w-xl mx-auto space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Meses con Convocatorias Públicas Registradas en Carhuamayo ({selectedAnio}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-left">
                    <button
                      onClick={() => { setSelectedMes('09'); setSelectedAnio('2026'); setFiltroProcesosModo('mes'); }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-muni-500 hover:bg-muni-50/50 transition group"
                    >
                      <span className="text-[10px] font-bold text-muni-700 block">Setiembre {selectedAnio}</span>
                      <span className="text-xs font-extrabold text-slate-800 block truncate">LP-ABR-2-2026</span>
                      <span className="text-[11px] text-slate-500 block">S/. 136,970.97 (Obra I.E. 548)</span>
                    </button>
                    <button
                      onClick={() => { setSelectedMes('07'); setSelectedAnio('2026'); setFiltroProcesosModo('mes'); }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-muni-500 hover:bg-muni-50/50 transition group"
                    >
                      <span className="text-[10px] font-bold text-muni-700 block">Julio {selectedAnio}</span>
                      <span className="text-xs font-extrabold text-slate-800 block truncate">LP-ABR-2-2026</span>
                      <span className="text-[11px] text-slate-500 block">S/. 138,970.97 (Obra I.E. 548)</span>
                    </button>
                    <button
                      onClick={() => { setSelectedMes('02'); setSelectedAnio('2026'); setFiltroProcesosModo('mes'); }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-muni-500 hover:bg-muni-50/50 transition group"
                    >
                      <span className="text-[10px] font-bold text-muni-700 block">Febrero {selectedAnio}</span>
                      <span className="text-xs font-extrabold text-slate-800 block truncate">LP-ABR-1-2026</span>
                      <span className="text-[11px] text-slate-500 block">S/. 189,812.16 (Vaso de Leche)</span>
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setFiltroProcesosModo('todos')}
                      className="text-xs font-bold text-muni-600 hover:text-muni-800 underline"
                    >
                      O haz clic aquí para ver todas las convocatorias históricas de SEACE ({todosLosProcesos.length})
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              procesosList.map((proc) => (
                <div
                  key={proc.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-3 hover:border-muni-300 transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-muni-700">
                        {proc.numeroDocumento}
                      </span>
                      <span className="text-[10px] bg-purple-50 text-purple-800 border border-purple-200 font-bold px-2 py-0.5 rounded-full">
                        {proc.tipo}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500 font-medium">
                      Publicado: <strong>{proc.fechaEmision}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {proc.descripcion}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Monto / Cuantía:</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        S/. {proc.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Código CUI Asociado:</span>
                      <span className="font-bold font-mono text-muni-700">
                        {proc.expedienteSiaf || 'Sin CUI'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Estado en SEACE:</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Adjudicado / Devengado
                      </span>
                    </div>
                  </div>

                  {proc.enlaceSeace && (
                    <div className="pt-2 text-right">
                      <a
                        href={proc.enlaceSeace}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-muni-600 hover:text-muni-800 inline-flex items-center gap-1"
                      >
                        Ver Convocatoria Oficial en SEACE <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'proveedores' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-muni-600" />
                Padrón de Principales Proveedores de Carhuamayo
              </h3>
              <p className="text-xs text-slate-500">
                Empresas y personas naturales con mayor monto adjudicado en órdenes OCOS
              </p>
            </div>
            <span className="text-xs text-slate-400">Top 8 proveedores</span>
          </div>

          <div className="space-y-3">
            {topProveedores.map((prov, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{prov.nombre}</div>
                    <div className="flex flex-wrap items-center gap-2 text-slate-500 font-mono text-[11px] mt-0.5">
                      <span>RUC: {prov.ruc}</span>
                      <span>·</span>
                      <span>{prov.count} orden(es) emitida(s)</span>
                      {prov.esLocal && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-sans font-bold">
                          Proveedor Local
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="font-extrabold text-sm text-slate-900 block">
                    S/. {prov.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {((prov.total / (totalMontoOrdenes || 1)) * 100).toFixed(1)}% del total en órdenes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
