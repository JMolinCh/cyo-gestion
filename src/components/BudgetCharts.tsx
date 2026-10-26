'use client';

import React, { useState } from 'react';
import { PresupuestoRubro, PresupuestoMensual } from '@/types';
import { EJECUCION_MENSUAL_2026, RUBROS_PRESUPUESTO } from '@/data/carhuamayoPresupuesto';
import { BarChart3, PieChart as PieIcon, Info } from 'lucide-react';

const COLORS = ['#026ec9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const formatSoles = (value: number) => {
  if (value >= 1000000) {
    return `S/. ${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `S/. ${(value / 1000).toFixed(0)}k`;
  }
  return `S/. ${value.toLocaleString('es-PE')}`;
};

interface BudgetChartsProps {
  rubros?: PresupuestoRubro[];
  mensual?: PresupuestoMensual[];
  pimTotal?: number;
}

export default function BudgetCharts({
  rubros = RUBROS_PRESUPUESTO,
  mensual = EJECUCION_MENSUAL_2026,
  pimTotal,
}: BudgetChartsProps) {
  const [hoveredMes, setHoveredMes] = useState<PresupuestoMensual | null>(null);
  const [hoveredRubro, setHoveredRubro] = useState<PresupuestoRubro | null>(null);

  const effectivePimTotal = pimTotal || rubros.reduce((acc, r) => acc + r.pim, 0);
  const effectiveDevTotal = rubros.reduce((acc, r) => acc + r.devengado, 0);

  // Calcular valor máximo para escalar las barras mensuales
  const maxMensual = Math.max(
    ...mensual.map((m) => Math.max(m.programado || 0, m.ejecutado || 0)),
    100000
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ========================================================================= */}
      {/* GRÁFICO 1: EVOLUCIÓN MENSUAL DE EJECUCIÓN (BARRAS INTERACTIVAS NATIVAS) */}
      {/* ========================================================================= */}
      <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-muni-600" />
                Evolución Mensual del Gasto (2026)
              </h3>
              <p className="text-xs text-slate-500">
                Comparativa entre Gasto Programado vs Devengado (SIAF - Consulta Amigable)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-3 h-3 rounded bg-slate-300 inline-block"></span> Programado
              </span>
              <span className="flex items-center gap-1 text-muni-700">
                <span className="w-3 h-3 rounded bg-muni-600 inline-block"></span> Devengado
              </span>
            </div>
          </div>

          {/* Gráfico de Barras Responsivo Instantáneo */}
          <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 px-1 relative">
            {/* Líneas guía horizontales */}
            <div className="absolute inset-x-0 top-6 border-b border-dashed border-slate-200 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-100 pointer-events-none" />

            {mensual.map((item, idx) => {
              const hProg = Math.max(Math.round(((item.programado || 0) / maxMensual) * 100), 2);
              const hEjec = Math.max(Math.round(((item.ejecutado || 0) / maxMensual) * 100), item.ejecutado > 0 ? 4 : 0);
              const isHovered = hoveredMes?.mes === item.mes;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredMes(item)}
                  onMouseLeave={() => setHoveredMes(null)}
                >
                  {/* Tooltip flotante en hover */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 z-30 bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none border border-slate-700 animate-in fade-in">
                      <div className="font-bold text-amber-300 mb-0.5">{item.mes} 2026</div>
                      <div>Devengado: <strong className="text-emerald-400">S/. {item.ejecutado.toLocaleString('es-PE')}</strong></div>
                      <div>Programado: S/. {item.programado.toLocaleString('es-PE')}</div>
                      {item.acumulado > 0 && (
                        <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-800 mt-1">
                          Acumulado: S/. {item.acumulado.toLocaleString('es-PE')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pareja de barras */}
                  <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                    {/* Barra Programada */}
                    <div
                      style={{ height: `${hProg}%` }}
                      className={`w-2.5 sm:w-3.5 rounded-t bg-slate-200 transition-all duration-300 ${
                        isHovered ? 'bg-slate-300' : ''
                      }`}
                      title={`Programado: S/. ${item.programado.toLocaleString('es-PE')}`}
                    />
                    {/* Barra Ejecutada */}
                    <div
                      style={{ height: `${hEjec}%` }}
                      className={`w-2.5 sm:w-3.5 rounded-t transition-all duration-300 ${
                        item.ejecutado > 0
                          ? isHovered
                            ? 'bg-muni-500 scale-y-105'
                            : 'bg-muni-600'
                          : 'bg-transparent'
                      }`}
                      title={`Devengado: S/. ${item.ejecutado.toLocaleString('es-PE')}`}
                    />
                  </div>

                  {/* Etiqueta del Mes */}
                  <span
                    className={`mt-2 text-[10px] font-semibold transition ${
                      isHovered ? 'text-muni-700 font-bold scale-110' : 'text-slate-500'
                    }`}
                  >
                    {item.mes}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen al pie del gráfico mensual */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-500">
          <span>Pico de ejecución: <strong>Marzo (S/. 1.57M)</strong> y <strong>Junio (S/. 1.32M)</strong></span>
          <span className="font-semibold text-muni-800">
            Total Devengado: S/. {effectiveDevTotal.toLocaleString('es-PE')}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GRÁFICO 2: FUENTES DE FINANCIAMIENTO / PIM (DONA Y BARRAS PROPORCIONALES) */}
      {/* ========================================================================= */}
      <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div>
          <div className="pb-3 mb-3 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-emerald-600" />
                Fuentes de Financiamiento (PIM)
              </h3>
              <p className="text-xs text-slate-500">
                Distribución de fondos asignados a Carhuamayo
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              PIM S/. {(effectivePimTotal / 1000000).toFixed(2)}M
            </span>
          </div>

          {/* Barras de distribución visual */}
          <div className="space-y-3 pt-1">
            {rubros.map((item, idx) => {
              const color = COLORS[idx % COLORS.length];
              const pctPim = effectivePimTotal > 0 ? ((item.pim / effectivePimTotal) * 100).toFixed(1) : '0';
              const isHovered = hoveredRubro?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-2 rounded-lg transition ${
                    isHovered ? 'bg-slate-50 ring-1 ring-slate-200' : ''
                  }`}
                  onMouseEnter={() => setHoveredRubro(item)}
                  onMouseLeave={() => setHoveredRubro(null)}
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-semibold text-slate-800 truncate" title={item.rubro}>
                        [{item.codigoRubro}] {item.rubro}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0 font-bold text-slate-800">
                      S/. {(item.pim / 1000000).toFixed(2)}M{' '}
                      <span className="text-[10px] text-slate-400 font-normal">({pctPim}%)</span>
                    </div>
                  </div>

                  {/* Barra de progreso de ejecución para este rubro */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(item.avancePorcentaje || 0, 100)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Devengado: S/. {(item.devengado / 1000000).toFixed(2)}M</span>
                    <span className="font-semibold text-slate-700">{item.avancePorcentaje}% ejecutado</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Fuente principal: <strong>Recursos Ordinarios (48.2%)</strong></span>
          <span className="text-emerald-700 font-semibold">Canon: 25.3%</span>
        </div>
      </div>
    </div>
  );
}
