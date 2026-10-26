'use client';

import React, { useState, useMemo } from 'react';
import { Contratacion } from '@/types';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Building2, 
  Tag, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface ProcurementTableProps {
  contrataciones: Contratacion[];
  mostrarSoloRecientes?: boolean;
  soloOrdenes?: boolean;
}

export default function ProcurementTable({
  contrataciones,
  mostrarSoloRecientes = false,
  soloOrdenes = true,
}: ProcurementTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [soloMenor8UIT, setSoloMenor8UIT] = useState(false);
  const [soloProveedoresLocales, setSoloProveedoresLocales] = useState(false);

  // Filtrado reactivo en tiempo real
  const filteredData = useMemo(() => {
    return contrataciones.filter((item) => {
      // Excluir estrictamente licitaciones y procesos si soloOrdenes es true
      if (soloOrdenes) {
        const esOrden = item.tipo === 'Orden de Compra' || item.tipo === 'Orden de Servicio';
        if (!esOrden) return false;
      }

      // Búsqueda de texto libre
      const matchesSearch =
        searchTerm === '' ||
        item.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.proveedorRuc.includes(searchTerm) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.areaUsuaria.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por tipo
      const matchesTipo =
        tipoFiltro === 'todos' || item.tipo.toLowerCase().includes(tipoFiltro.toLowerCase());

      // Filtro menor a 8 UIT
      const matches8UIT = !soloMenor8UIT || item.menorA8UIT;

      // Filtro local
      const matchesLocal = !soloProveedoresLocales || item.esProveedorLocal;

      return matchesSearch && matchesTipo && matches8UIT && matchesLocal;
    });
  }, [contrataciones, searchTerm, tipoFiltro, soloMenor8UIT, soloProveedoresLocales, soloOrdenes]);

  // Si se pide solo recientes, recortar a las primeras 5
  const displayData = mostrarSoloRecientes ? filteredData.slice(0, 5) : filteredData;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Controles de Búsqueda y Filtros */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Input de Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por N° de Orden OCOS, Proveedor, RUC o concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-500 focus:border-transparent transition"
            />
          </div>

          {/* Selector de Tipo */}
          <div className="flex gap-2">
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="bg-white border border-slate-300 text-xs sm:text-sm rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-muni-500 font-medium"
            >
              <option value="todos">Todas las Órdenes (Compra y Servicio)</option>
              <option value="Orden de Compra">Órdenes de Compra (O/C)</option>
              <option value="Orden de Servicio">Órdenes de Servicio (O/S)</option>
            </select>
          </div>
        </div>

        {/* Checkbox filters */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={soloMenor8UIT}
              onChange={(e) => setSoloMenor8UIT(e.target.checked)}
              className="rounded border-slate-300 text-muni-600 focus:ring-muni-500 h-3.5 w-3.5"
            />
            <span className="font-medium">Solo compras menores a 8 UIT / 9 UIT</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={soloProveedoresLocales}
              onChange={(e) => setSoloProveedoresLocales(e.target.checked)}
              className="rounded border-slate-300 text-muni-600 focus:ring-muni-500 h-3.5 w-3.5"
            />
            <span className="font-medium">Solo proveedores de Carhuamayo / Junín</span>
          </label>

          <span className="ml-auto text-slate-500 font-semibold text-[11px]">
            {filteredData.length} órdenes encontradas
          </span>
        </div>
      </div>

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">N° Orden / Tipo</th>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Proveedor / RUC</th>
              <th className="py-3 px-4 min-w-[280px]">Descripción del Servicio / Bien</th>
              <th className="py-3 px-4">Área Solicitante</th>
              <th className="py-3 px-4 text-right">Monto (S/)</th>
              <th className="py-3 px-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No se encontraron órdenes de compra o servicio con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              displayData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Documento y Tipo */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      {item.numeroDocumento}
                      {item.enlaceSeace && (
                        <a
                          href={item.enlaceSeace}
                          target="_blank"
                          rel="noreferrer"
                          title="Ver en SEACE"
                          className="text-muni-600 hover:text-muni-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-semibold text-slate-500">
                        {item.tipo}
                      </span>
                      {item.menorA8UIT && (
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                          &lt; 8 UIT
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Fecha */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-medium">
                    {item.fechaEmision}
                  </td>

                  {/* Proveedor */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 leading-tight">
                      {item.proveedorNombre}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-slate-500 font-mono text-[11px]">
                      <span>RUC: {item.proveedorRuc}</span>
                      {item.esProveedorLocal && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold font-sans">
                          Local
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Descripción */}
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                    <p className="line-clamp-2" title={item.descripcion}>
                      {item.descripcion}
                    </p>
                    {item.expedienteSiaf && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Exp. SIAF: {item.expedienteSiaf}
                      </span>
                    )}
                  </td>

                  {/* Área Usuaria */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium text-[11px]">
                    {item.areaUsuaria}
                  </td>

                  {/* Monto */}
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                    S/. {item.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.estado === 'Pagado'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.estado === 'Devengado'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.estado === 'Pagado' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mostrarSoloRecientes && filteredData.length > 5 && (
        <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
          <a
            href="/abastecimiento"
            className="text-xs font-semibold text-muni-700 hover:text-muni-900 inline-flex items-center gap-1"
          >
            Ver catálogo completo de {filteredData.length} órdenes OCOS →
          </a>
        </div>
      )}
    </div>
  );
}
