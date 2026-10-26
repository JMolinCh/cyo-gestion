'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HardHat,
  ArrowLeft,
  DollarSign,
  ExternalLink,
  Users,
  Building,
  Search,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FolderGit2,
  Check,
  ShieldCheck,
  Clock
} from 'lucide-react';

import StatCard from '@/components/StatCard';
import { PROYECTOS_INVIERTE_CARHUAMAYO } from '@/data/carhuamayoInvierte';
import { ProyectoInvierte } from '@/types';

export default function ObrasPage() {
  // Filtros Banco de Inversiones
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'ACTIVO' | 'CERRADO'>('TODOS');
  const [filtroFuncion, setFiltroFuncion] = useState<string>('TODOS');
  const [filtroSituacion, setFiltroSituacion] = useState<string>('TODOS');
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(20);

  // Modal para ver Ficha Técnica detallada
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<ProyectoInvierte | null>(null);

  // --- Estadísticas globales Invierte.pe (45 proyectos) ---
  const totalProyectos = PROYECTOS_INVIERTE_CARHUAMAYO.length;
  const totalActivos = PROYECTOS_INVIERTE_CARHUAMAYO.filter((p) => p.estado === 'ACTIVO').length;
  const totalCerrados = PROYECTOS_INVIERTE_CARHUAMAYO.filter((p) => p.estado === 'CERRADO').length;

  const totalMontoViable = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, curr) => acc + (curr.montoViable || 0), 0);
  const totalCostoActualizado = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, curr) => acc + (curr.costoActualizado || 0), 0);
  const totalDevengadoAcumulado = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, curr) => acc + (curr.devengadoAcumulado || 0), 0);
  const porcentajeEjecucion = totalCostoActualizado > 0 ? (totalDevengadoAcumulado / totalCostoActualizado) * 100 : 0;

  // Lista de funciones únicas para el selector
  const funcionesDisponibles = useMemo(() => {
    return Array.from(new Set(PROYECTOS_INVIERTE_CARHUAMAYO.map((p) => p.funcion).filter(Boolean))).sort();
  }, []);

  // Proyectos filtrados
  const proyectosFiltrados = useMemo(() => {
    return PROYECTOS_INVIERTE_CARHUAMAYO.filter((p) => {
      const matchSearch =
        searchTerm === '' ||
        p.cui.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.codigoIdea && p.codigoIdea.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.funcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.programa.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
      const matchFuncion = filtroFuncion === 'TODOS' || p.funcion === filtroFuncion;
      const matchSituacion = filtroSituacion === 'TODOS' || p.situacion === filtroSituacion;

      return matchSearch && matchEstado && matchFuncion && matchSituacion;
    });
  }, [searchTerm, filtroEstado, filtroFuncion, filtroSituacion]);

  // Paginación
  const totalPaginas = Math.ceil(proyectosFiltrados.length / elementosPorPagina) || 1;
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const proyectosPaginados = proyectosFiltrados.slice(indiceInicio, indiceInicio + elementosPorPagina);

  const irAPagina = (nuevaPag: number) => {
    if (nuevaPag >= 1 && nuevaPag <= totalPaginas) {
      setPaginaActual(nuevaPag);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Institucional */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-muni-600 inline-flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-muni-700 font-bold">Módulo de Obras Públicas e Inversiones</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <HardHat className="w-7 h-7 text-muni-600" />
            Banco de Inversiones y Obras Públicas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Cartera oficial de proyectos de inversión pública en el Sistema Invierte.pe (MEF) de la{' '}
            <strong>Municipalidad Distrital de Carhuamayo</strong>.
          </p>
        </div>

        {/* Enlace Oficial MEF */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://ofi5.mef.gob.pe/inviertePub/ConsultaPublica/ConsultaAvanzada"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-muni-700 hover:bg-muni-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition"
            title="Ir a Consulta Avanzada de Inversiones MEF"
          >
            <FolderGit2 className="w-4 h-4 text-muni-200" />
            <span>Invierte.pe Consulta Avanzada (MEF)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Banner de Identificación Entidad MEF */}
      <div className="bg-gradient-to-r from-slate-900 via-muni-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Building className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Entidad Ejecutora Oficial
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/30">
                GL - Municipalidad Distrital
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              Municipalidad Distrital de Carhuamayo (Provincia de Junín, Junín)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Cartera Total</span>
            <strong className="text-white text-sm">{totalProyectos} Inversiones</strong>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Proyectos Activos</span>
            <strong className="text-emerald-400 text-sm">{totalActivos} en Gestión</strong>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Cerrados</span>
            <strong className="text-slate-400 text-sm">{totalCerrados} Culminados</strong>
          </div>
        </div>
      </div>

      {/* KPIs de Inversión Pública (Invierte.pe) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cartera Total Actualizada"
          value={`S/. ${(totalCostoActualizado / 1000000).toFixed(2)}M`}
          subtitle={`S/. ${(totalMontoViable / 1000000).toFixed(2)}M monto viable inicial`}
          icon={DollarSign}
          colorTheme="blue"
        />

        <StatCard
          title="Devengado Acumulado"
          value={`S/. ${(totalDevengadoAcumulado / 1000000).toFixed(2)}M`}
          subtitle={`${porcentajeEjecucion.toFixed(1)}% ejecutado acumulado`}
          icon={TrendingUp}
          colorTheme="purple"
          trend={{ value: 'Pagos certificados', isNeutral: true }}
        />

        <StatCard
          title="Proyectos Activos"
          value={`${totalActivos} de ${totalProyectos}`}
          subtitle={`${totalCerrados} inversiones culminadas`}
          icon={HardHat}
          colorTheme="emerald"
          trend={{ value: 'En ciclo de inversión', isPositive: true }}
        />

        <StatCard
          title="Población Impactada"
          value="10,050 hab."
          subtitle="Distrito Carhuamayo y anexos"
          icon={Users}
          colorTheme="amber"
          trend={{ value: '12 sectores', isPositive: true }}
        />
      </div>

      {/* ========================================================= */}
      {/* TABLA PRINCIPAL: BANCO DE INVERSIONES - INVIERTE.PE (MEF) */}
      {/* ========================================================= */}
      <div className="space-y-4">
        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por CUI, Código de Idea o denominación del proyecto..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPaginaActual(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Controles de Selección de Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            {/* Filtro por Estado */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Estado de Inversión:</label>
              <select
                value={filtroEstado}
                onChange={(e) => {
                  setFiltroEstado(e.target.value as any);
                  setPaginaActual(1);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="TODOS">Todos ({totalProyectos})</option>
                <option value="ACTIVO">Solo Activos ({totalActivos})</option>
                <option value="CERRADO">Solo Cerrados ({totalCerrados})</option>
              </select>
            </div>

            {/* Filtro por Función */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Función Presupuestal:</label>
              <select
                value={filtroFuncion}
                onChange={(e) => {
                  setFiltroFuncion(e.target.value);
                  setPaginaActual(1);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium truncate"
              >
                <option value="TODOS">Todas las Funciones ({funcionesDisponibles.length})</option>
                {funcionesDisponibles.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Situación */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Situación de Viabilidad:</label>
              <select
                value={filtroSituacion}
                onChange={(e) => {
                  setFiltroSituacion(e.target.value);
                  setPaginaActual(1);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="TODOS">Todas las Situaciones</option>
                <option value="VIABLE">VIABLE</option>
                <option value="APROBADO">APROBADO</option>
              </select>
            </div>

            {/* Elementos por página */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Registros por página:</label>
              <select
                value={elementosPorPagina}
                onChange={(e) => {
                  setElementosPorPagina(Number(e.target.value));
                  setPaginaActual(1);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value={10}>10 por página</option>
                <option value={20}>20 por página (MEF Estándar)</option>
                <option value={45}>Ver los 45 proyectos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla Oficial de Inversiones Invierte.pe */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-muni-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Listado de Proyectos en el Banco de Inversiones (Invierte.pe)
              </h3>
              <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {proyectosFiltrados.length} encontrados
              </span>
            </div>

            <div className="text-xs text-slate-500">
              Mostrando {proyectosFiltrados.length === 0 ? 0 : indiceInicio + 1} -{' '}
              {Math.min(indiceInicio + elementosPorPagina, proyectosFiltrados.length)} de{' '}
              {proyectosFiltrados.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/90 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">#</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Código Único (CUI)</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Código Idea</th>
                  <th className="py-2.5 px-3 min-w-[280px]">Nombre de la Inversión</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Estado</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Situación</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Fecha Viab.</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Nivel</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Función</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Costo Act. (S/.)</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Devengado (S/.)</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Avance Físico</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Ficha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {proyectosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-8 text-center text-slate-400">
                      No se encontraron inversiones registradas con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  proyectosPaginados.map((p) => {
                    const avance = p.avanceFisico || 0;
                    return (
                      <tr
                        key={p.cui}
                        className="hover:bg-blue-50/40 transition group cursor-pointer"
                        onClick={() => setProyectoSeleccionado(p)}
                      >
                        <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-400">
                          {p.numero}
                        </td>

                        {/* CUI con enlace SSI */}
                        <td className="py-2 px-3 whitespace-nowrap">
                          <a
                            href={p.enlaceSsi}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono font-bold text-muni-700 hover:text-muni-900 bg-muni-50 hover:bg-muni-100 px-2 py-0.5 rounded border border-muni-200 inline-flex items-center gap-1 transition"
                            title="Ver Ficha Técnica Oficial en SSI MEF"
                          >
                            <span>{p.cui}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        </td>

                        {/* Código Idea */}
                        <td className="py-2 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {p.codigoIdea ? (
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {p.codigoIdea}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* Nombre */}
                        <td className="py-2 px-3">
                          <div className="font-semibold text-slate-900 group-hover:text-muni-700 transition leading-snug line-clamp-2">
                            {p.nombre}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {p.programa} {p.subprograma && `• ${p.subprograma}`}
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                              p.estado === 'ACTIVO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {p.estado === 'ACTIVO' && <Check className="w-2.5 h-2.5" />}
                            {p.estado}
                          </span>
                        </td>

                        {/* Situación */}
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              p.situacion === 'VIABLE'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {p.situacion}
                          </span>
                        </td>

                        {/* Fecha Viabilidad */}
                        <td className="py-2 px-3 text-center text-slate-600 whitespace-nowrap font-mono text-[11px]">
                          {p.fechaViabilidad || '-'}
                        </td>

                        {/* Nivel de Gobierno */}
                        <td className="py-2 px-3 text-center text-slate-600 font-mono text-[11px] whitespace-nowrap">
                          {p.nivelGobierno}
                        </td>

                        {/* Función */}
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                            {p.funcion}
                          </span>
                        </td>

                        {/* Costo Actualizado */}
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                          S/. {p.costoActualizado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Devengado Acumulado */}
                        <td className="py-2 px-3 text-right font-mono text-muni-700 whitespace-nowrap">
                          S/. {(p.devengadoAcumulado || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Avance Físico con semáforo */}
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  avance >= 80 ? 'bg-emerald-600' : avance >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, avance)}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] font-bold text-slate-700">
                              {avance}%
                            </span>
                          </div>
                        </td>

                        {/* Botón Ver Ficha */}
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProyectoSeleccionado(p);
                            }}
                            className="text-xs font-bold text-muni-600 hover:text-muni-800 p-1 rounded hover:bg-muni-50 transition"
                            title="Ver Ficha Técnica y Detalle de Obras"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación Inferior tipo Invierte.pe */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <div className="text-slate-500">
              Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong> (Total {proyectosFiltrados.length} registros)
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => irAPagina(1)}
                disabled={paginaActual === 1}
                className="px-2 py-1 border border-slate-300 rounded bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                « Inicio
              </button>
              <button
                onClick={() => irAPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="p-1 border border-slate-300 rounded bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 py-1 font-bold text-slate-800">
                {paginaActual} / {totalPaginas}
              </div>

              <button
                onClick={() => irAPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="p-1 border border-slate-300 rounded bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => irAPagina(totalPaginas)}
                disabled={paginaActual === totalPaginas}
                className="px-2 py-1 border border-slate-300 rounded bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                Fin »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL / DRAWER: FICHA TÉCNICA DETALLADA DE LA INVERSIÓN   */}
      {/* ========================================================= */}
      {proyectoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="bg-muni-500 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded">
                    CUI: {proyectoSeleccionado.cui}
                  </span>
                  {proyectoSeleccionado.codigoIdea && (
                    <span className="bg-slate-800 text-slate-300 font-mono text-xs px-2 py-0.5 rounded border border-slate-700">
                      Idea: {proyectoSeleccionado.codigoIdea}
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      proyectoSeleccionado.estado === 'ACTIVO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {proyectoSeleccionado.estado}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    {proyectoSeleccionado.situacion}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  {proyectoSeleccionado.nombre}
                </h3>
              </div>

              <button
                onClick={() => setProyectoSeleccionado(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Modal Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Tarjetas de Montos y Avances */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Monto Viable</span>
                  <strong className="text-sm font-bold text-slate-800 font-mono">
                    S/. {proyectoSeleccionado.montoViable.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Costo Actualizado</span>
                  <strong className="text-sm font-bold text-muni-700 font-mono">
                    S/. {proyectoSeleccionado.costoActualizado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Devengado Acumulado</span>
                  <strong className="text-sm font-bold text-purple-700 font-mono">
                    S/. {(proyectoSeleccionado.devengadoAcumulado || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Avance Físico</span>
                  <strong className="text-sm font-bold text-emerald-700 font-mono">
                    {proyectoSeleccionado.avanceFisico || 0}%
                  </strong>
                </div>
              </div>

              {/* Información Institucional y Responsables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <Building className="w-3.5 h-3.5 text-muni-600" />
                    Responsabilidad Funcional y Formulación
                  </h4>
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-400">Función:</span> <strong>{proyectoSeleccionado.funcion}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Programa:</span> <strong>{proyectoSeleccionado.programa}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Subprograma:</span> <strong>{proyectoSeleccionado.subprograma || '-'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Tipo de Formato:</span> <strong>{proyectoSeleccionado.tipoFormato}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Último Estudio:</span> <strong>{proyectoSeleccionado.ultimoEstudio || '-'}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Unidades Responsables (MEF)
                  </h4>
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-400">Entidad:</span> <strong>{proyectoSeleccionado.entidad}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Unidad Ejecutora (UEI):</span> <strong>{proyectoSeleccionado.uei || 'MDC'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Responsable UEI:</span> <strong>{proyectoSeleccionado.responsableUei || '-'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Unidad OPMI:</span> <strong>{proyectoSeleccionado.opmi || '-'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Responsable OPMI:</span> <strong>{proyectoSeleccionado.responsableOpmi || '-'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción de la Alternativa / Metas de Obra */}
              {proyectoSeleccionado.descripcionAlternativa && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-muni-600" />
                    Descripción Técnica de la Alternativa y Metas Físicas
                  </h4>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {proyectoSeleccionado.descripcionAlternativa}
                  </p>
                </div>
              )}

              {/* Reporte Situacional Oficial Registrado en MEF */}
              {proyectoSeleccionado.situacionInversion && (
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-1.5">
                  <h4 className="font-bold text-amber-900 uppercase text-[11px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    Último Reporte Situacional Registrado en MEF
                  </h4>
                  <p className="text-slate-800 whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-amber-200/80 font-mono text-[11px]">
                    {proyectoSeleccionado.situacionInversion}
                  </p>
                  {proyectoSeleccionado.problemasRestricciones && (
                    <div className="mt-2 text-[11px] text-slate-600">
                      <strong>Problemas o Restricciones:</strong> {proyectoSeleccionado.problemasRestricciones}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Modal con Enlaces Oficiales */}
            <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={proyectoSeleccionado.enlaceSsi}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-muni-600 hover:bg-muni-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  <span>Ficha Técnica SSI MEF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={proyectoSeleccionado.enlaceInvierte}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  <span>Consulta Banco Inversiones</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={() => setProyectoSeleccionado(null)}
                className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
