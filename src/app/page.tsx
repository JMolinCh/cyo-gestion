'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  ShoppingBag, 
  HardHat, 
  Scale, 
  DollarSign, 
  CheckCircle2, 
  ArrowUpRight, 
  Activity, 
  ExternalLink, 
  ShieldCheck, 
  Building, 
  Layers, 
  Search,
  BookOpen,
  FileText,
  Landmark,
  Scroll,
  TrendingUp,
  FolderGit2,
  FileCheck,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';

import StatCard from '@/components/StatCard';
import BudgetCharts from '@/components/BudgetCharts';
import ProcurementTable from '@/components/ProcurementTable';

import { PRESUPUESTO_GENERAL_INFO, RUBROS_PRESUPUESTO } from '@/data/carhuamayoPresupuesto';
import { CONTRATACIONES_CARHUAMAYO } from '@/data/carhuamayoContrataciones';
import { PROYECTOS_INVIERTE_CARHUAMAYO } from '@/data/carhuamayoInvierte';
import { Contratacion } from '@/types';

export default function HomePage() {
  const [contrataciones, setContrataciones] = useState<Contratacion[]>(CONTRATACIONES_CARHUAMAYO);

  // Totales de contrataciones y órdenes
  const totalContratado = contrataciones.reduce((acc, curr) => acc + curr.monto, 0);

  // Totales de cartera de inversiones (Invierte.pe)
  const totalObrasCosto = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, p) => acc + (p.costoActualizado || 0), 0);
  const totalObrasDevengado = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, p) => acc + (p.devengadoAcumulado || 0), 0);
  const totalObrasViable = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, p) => acc + (p.montoViable || 0), 0);
  const porcentajeEjecucionObras = totalObrasCosto > 0 ? (totalObrasDevengado / totalObrasCosto) * 100 : 0;

  // Proyectos destacados estratégicos (Top 4)
  const proyectosDestacados = PROYECTOS_INVIERTE_CARHUAMAYO.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Grid de KPIs Macro del Distrito */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-muni-600" />
            Indicadores Clave de Gestión (Año Fiscal 2026)
          </h2>
          <span className="text-[11px] text-slate-400">
            Corte al {PRESUPUESTO_GENERAL_INFO.ultimaActualizacion}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Presupuesto Modificado (PIM)"
            value={`S/. ${(PRESUPUESTO_GENERAL_INFO.pimTotal / 1000000).toFixed(2)}M`}
            subtitle={`PIA Apertura: S/. ${(PRESUPUESTO_GENERAL_INFO.piaTotal / 1000000).toFixed(2)}M`}
            icon={DollarSign}
            colorTheme="blue"
            trend={{
              value: `+${(((PRESUPUESTO_GENERAL_INFO.pimTotal - PRESUPUESTO_GENERAL_INFO.piaTotal) / PRESUPUESTO_GENERAL_INFO.piaTotal) * 100).toFixed(1)}% vs PIA`,
              isPositive: true,
            }}
          />

          <StatCard
            title="Ejecución de Gasto (MEF)"
            value={`${PRESUPUESTO_GENERAL_INFO.porcentajeEjecucion}%`}
            subtitle={`S/. ${(PRESUPUESTO_GENERAL_INFO.devengadoTotal / 1000000).toFixed(2)}M devengados`}
            icon={BarChart3}
            colorTheme="emerald"
            trend={{ value: 'Certificado: S/. 8.65M', isPositive: true }}
          />

          <StatCard
            title="Contrataciones & Órdenes"
            value={`S/. ${(totalContratado / 1000000).toFixed(2)}M`}
            subtitle={`${contrataciones.length} procesos y órdenes registradas`}
            icon={ShoppingBag}
            colorTheme="amber"
            trend={{ value: 'SEACE + Órdenes < 8 UIT', isPositive: true }}
          />

          <StatCard
            title="Banco de Inversiones (Invierte.pe)"
            value={`${PROYECTOS_INVIERTE_CARHUAMAYO.length} Proyectos`}
            subtitle={`S/. ${(totalObrasCosto / 1000000).toFixed(1)}M costo de cartera`}
            icon={HardHat}
            colorTheme="purple"
            trend={{ value: `${porcentajeEjecucionObras.toFixed(1)}% acumulado ejecutado`, isPositive: true }}
          />
        </div>
      </section>

      {/* SECCIÓN 1: Presupuesto y Finanzas MEF */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muni-600" />
              1. Ejecución Presupuestal e Ingresos en Tiempo Real (MEF - Consulta Amigable SIAF)
            </h2>
            <p className="text-xs text-slate-500">
              Desglose analítico mensual de gastos, ingresos tributarios y fuentes de financiamiento.
            </p>
          </div>

          <Link
            href="/presupuesto"
            className="text-xs font-bold text-muni-600 hover:text-muni-800 flex items-center gap-1 group"
          >
            Ver análisis presupuestal detallado 
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Balance Resumen Gasto vs Ingreso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs text-xs">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
            <div className="p-2.5 rounded-lg bg-blue-600 text-white font-bold">
              Gasto
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-semibold">Ejecución del Presupuesto (PIM)</span>
              <span className="font-extrabold text-slate-900 text-sm">
                S/. {PRESUPUESTO_GENERAL_INFO.pimTotal.toLocaleString('es-PE')}
              </span>
              <span className="text-[10px] text-blue-700 block font-medium">
                Devengado: S/. {PRESUPUESTO_GENERAL_INFO.devengadoTotal.toLocaleString('es-PE')} ({PRESUPUESTO_GENERAL_INFO.porcentajeEjecucion}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
            <div className="p-2.5 rounded-lg bg-emerald-600 text-white font-bold">
              Ingreso
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-semibold">Recaudación y Captación (PIM)</span>
              <span className="font-extrabold text-slate-900 text-sm">
                S/. 10,757,983
              </span>
              <span className="text-[10px] text-emerald-700 block font-medium">
                Recaudado: S/. 1,357,015 (FONCOMUN, Canon, RDR e Impuestos)
              </span>
            </div>
          </div>
        </div>

        <BudgetCharts />
      </section>

      {/* SECCIÓN 2: Abastecimiento y Contrataciones SEACE */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-muni-600" />
              2. Abastecimiento, Licitaciones y Órdenes OCOS (SEACE - OSCE)
            </h2>
            <p className="text-xs text-slate-500">
              Registro oficial de licitaciones públicas y órdenes de compra y servicio emitidas a proveedores.
            </p>
          </div>

          <Link
            href="/abastecimiento"
            className="text-xs font-bold text-muni-600 hover:text-muni-800 flex items-center gap-1 group"
          >
            Ver catálogo completo de contrataciones
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <ProcurementTable
          contrataciones={contrataciones.filter(
            (c) => c.tipo === 'Orden de Compra' || c.tipo === 'Orden de Servicio'
          )}
          mostrarSoloRecientes={true}
          soloOrdenes={true}
        />
      </section>

      {/* SECCIÓN 3: Obras Públicas - Banco de Inversiones Invierte.pe */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <HardHat className="w-5 h-5 text-muni-600" />
              3. Cartera de Inversiones Públicas (Banco de Inversiones - Invierte.pe MEF)
            </h2>
            <p className="text-xs text-slate-500">
              Seguimiento oficial de 45 proyectos de infraestructura, saneamiento, vialidad y educación con Código Único de Inversión (CUI).
            </p>
          </div>

          <Link
            href="/obras"
            className="text-xs font-bold text-muni-600 hover:text-muni-800 flex items-center gap-1 group"
          >
            Ver cartera completa de 45 proyectos
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Resumen Ejecutivo de Cartera Invierte.pe */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-100 pb-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-semibold">Total Proyectos</span>
              <span className="font-extrabold text-slate-900 text-base">45 Inversiones</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">43 Activos · 2 Cerrados</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-semibold">Monto Viable Aprobado</span>
              <span className="font-extrabold text-slate-900 text-base">S/. {(totalObrasViable / 1e6).toFixed(2)}M</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Evaluación técnica inicial</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-semibold">Costo Actualizado</span>
              <span className="font-extrabold text-blue-900 text-base">S/. {(totalObrasCosto / 1e6).toFixed(2)}M</span>
              <span className="text-[10px] text-blue-600 font-bold block mt-0.5">Marco de inversión total</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-semibold">Devengado Acumulado</span>
              <span className="font-extrabold text-emerald-700 text-base">S/. {(totalObrasDevengado / 1e6).toFixed(2)}M</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{porcentajeEjecucionObras.toFixed(1)}% ejecutado</span>
            </div>
          </div>

          {/* Distribución por Función de Obra */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-muni-600" />
                Distribución Sectorial de las Obras de Carhuamayo
              </span>
              <span className="text-slate-400 text-[11px]">Banco de Inversiones MEF</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-center">
                <span className="block font-black text-amber-900 text-sm">24 Obras</span>
                <span className="text-[10px] text-amber-700 font-semibold">Transporte y Vías</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl text-center">
                <span className="block font-black text-blue-900 text-sm">10 Obras</span>
                <span className="text-[10px] text-blue-700 font-semibold">Educación</span>
              </div>
              <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl text-center">
                <span className="block font-black text-teal-900 text-sm">4 Obras</span>
                <span className="text-[10px] text-teal-700 font-semibold">Saneamiento y Agua</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
                <span className="block font-black text-emerald-900 text-sm">3 Obras</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Agropecuaria</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
                <span className="block font-black text-rose-900 text-sm">4 Obras</span>
                <span className="text-[10px] text-rose-700 font-semibold">Salud, Cultura & Otros</span>
              </div>
            </div>
          </div>

          {/* Tabla Resumen de Proyectos Estratégicos */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Proyectos Estratégicos Destacados
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <th className="py-2.5 px-3">CUI</th>
                    <th className="py-2.5 px-3 min-w-[220px]">Nombre de la Inversión</th>
                    <th className="py-2.5 px-3">Función</th>
                    <th className="py-2.5 px-3 text-right">Costo Actualizado</th>
                    <th className="py-2.5 px-3 text-right">Devengado</th>
                    <th className="py-2.5 px-3 text-center">Avance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {proyectosDestacados.map((p) => (
                    <tr key={p.cui} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-muni-700">
                        {p.cui}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 line-clamp-1 max-w-md">
                        {p.nombre}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                        {p.funcion}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        S/. {p.costoActualizado.toLocaleString('es-PE')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-emerald-700">
                        S/. {(p.devengadoAcumulado || 0).toLocaleString('es-PE')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {p.avanceFisico ? `${p.avanceFisico.toFixed(1)}%` : 'En Ejecución'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: Marco Normativo, Resoluciones & Estructura Orgánica */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Scale className="w-5 h-5 text-muni-600" />
              4. Marco Normativo Institucional y Estructura Orgánica (Gob.pe / Google Drive)
            </h2>
            <p className="text-xs text-slate-500">
              Acceso oficial al Reglamento de Organización y Funciones (ROF) y resoluciones administrativas emitidas por el gobierno distrital.
            </p>
          </div>

          <Link
            href="/modernizacion"
            className="text-xs font-bold text-muni-600 hover:text-muni-800 flex items-center gap-1 group"
          >
            Ver repositorio normativo completo
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Tarjeta Destacada de Estructura Orgánica + Accesos a Normas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Tarjeta Estructura Orgánica (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-muni-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-red-500/30">
                <BookOpen className="w-3 h-3" />
                DOCUMENTO OFICIAL (ROF)
              </div>
              <h3 className="text-lg font-black text-white leading-snug">
                Estructura Orgánica Institucional (PDF Oficial)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Organigrama y estructura organizacional oficial de la Municipalidad Distrital de Carhuamayo, aprobada y vigente.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 font-mono">Google Drive Oficial</span>
              <a
                href="https://drive.google.com/file/d/1kQqNGz4dO2RisyWPleIf_gjgOw3dBk3v/view"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow"
              >
                <span>Ver Estructura Orgánica</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Mini-cuadrícula de Normas Legales en Gob.pe (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-muni-600" />
                Normas Publicadas en Plataforma Gob.pe
              </h4>
              <span className="text-[11px] text-slate-400">6 Categorías</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <a
                href="https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/111-ordenanza-municipal"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 transition group"
              >
                <span className="text-[10px] font-bold text-emerald-800 block">Tipo 111</span>
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                  Ordenanzas
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
              </a>

              <a
                href="https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/108-acuerdo-de-concejo"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 transition group"
              >
                <span className="text-[10px] font-bold text-blue-800 block">Tipo 108</span>
                <span className="font-bold text-slate-900 group-hover:text-blue-700 flex items-center gap-1">
                  Acuerdos Concejo
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
              </a>

              <a
                href="https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/96-decreto-de-alcaldia"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 transition group"
              >
                <span className="text-[10px] font-bold text-indigo-800 block">Tipo 96</span>
                <span className="font-bold text-slate-900 group-hover:text-indigo-700 flex items-center gap-1">
                  Decretos Alcaldía
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
              </a>

              <a
                href="https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/89-resolucion-de-alcaldia"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 transition group"
              >
                <span className="text-[10px] font-bold text-amber-800 block">Tipo 89</span>
                <span className="font-bold text-slate-900 group-hover:text-amber-700 flex items-center gap-1">
                  Res. Alcaldía
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
              </a>

              <a
                href="https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/159-resolucion-de-gerencia-municipal"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 transition group"
              >
                <span className="text-[10px] font-bold text-purple-800 block">Tipo 159</span>
                <span className="font-bold text-slate-900 group-hover:text-purple-700 flex items-center gap-1">
                  Res. Gerencia M.
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
              </a>

              <a
                href="https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/127-resolucion-gerencial"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 transition group"
              >
                <span className="text-[10px] font-bold text-slate-700 block">Tipo 127</span>
                <span className="font-bold text-slate-900 group-hover:text-slate-700 flex items-center gap-1">
                  Res. Gerenciales
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de Compromiso Ciudadano */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-muni-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-md">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Gobierno Abierto y Rendición de Cuentas Permanente
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Todos los datos presentados en esta plataforma son de dominio público y provienen de las bases del Ministerio de Economía y Finanzas (MEF), Organismo Supervisor de las Contrataciones del Estado (OSCE) y la Municipalidad Distrital de Carhuamayo.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="https://apps5.mineco.gob.pe/transparencia/mensual/"
            target="_blank"
            rel="noreferrer"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5"
          >
            Ver MEF Consulta Amigable <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>
        </div>
      </section>
    </div>
  );
}
