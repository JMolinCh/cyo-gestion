'use client';

import React, { useState } from 'react';
import { ObraPublica } from '@/types';
import { 
  MapPin, 
  HardHat, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface ProjectsMapProps {
  obras: ObraPublica[];
}

export default function ProjectsMap({ obras }: ProjectsMapProps) {
  const [selectedObra, setSelectedObra] = useState<ObraPublica>(obras[0]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const filteredObras = obras.filter(
    (obra) => filtroEstado === 'todos' || obra.estado === filtroEstado
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header y Filtro */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muni-600" />
            Mapa Territorial de Inversiones y Obras Públicas
          </h3>
          <p className="text-xs text-slate-500">
            Georreferenciación distrital en Carhuamayo con Código Único de Inversiones (CUI - Invierte.pe)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Estado:</span>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-white border border-slate-300 text-xs rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-muni-500 font-medium"
          >
            <option value="todos">Todas las Obras ({obras.length})</option>
            <option value="En Plazo">En Plazo</option>
            <option value="Con Retraso">Con Retraso</option>
            <option value="Culminada">Culminada</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Visual Map Canvas / Interactive District Map */}
        <div className="lg:col-span-7 bg-slate-900 p-6 relative min-h-[420px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Grid / Topography Background */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#38a8f7 1px, transparent 1px), radial-gradient(#38a8f7 1px, #07284a 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px'
            }}
          />

          {/* District Header Overlay */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white">
              <span className="font-bold text-muni-300">Distrito de Carhuamayo</span>
              <span className="text-slate-400 text-[11px] block">Zona Altoandina · 4,125 m.s.n.m.</span>
            </div>

            <div className="flex flex-col gap-1 text-[10px] text-slate-300 bg-slate-800/80 backdrop-blur p-2 rounded-lg border border-slate-700">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> En Plazo</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Con Retraso</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Culminada</span>
            </div>
          </div>

          {/* District Schematic Center with Map Pins */}
          <div className="relative z-10 my-auto py-12 px-4 flex items-center justify-center">
            {/* Visual District Contour / Island */}
            <div className="relative w-full max-w-md h-64 border-2 border-dashed border-muni-500/40 rounded-3xl bg-muni-950/40 backdrop-blur-sm p-4 flex items-center justify-center shadow-inner">
              <span className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                Valle de Chinchaycocha / Maca
              </span>

              {/* Pins placed relative to sectors */}
              {obras.map((obra) => {
                const isSelected = selectedObra.id === obra.id;
                // Coordenadas calculadas en porcentaje dentro del mapa distrito
                const positions: Record<string, { top: string; left: string }> = {
                  'obra-01': { top: '35%', left: '32%' }, // Barrio Huando
                  'obra-02': { top: '70%', left: '65%' }, // Tambo del Sol
                  'obra-03': { top: '50%', left: '48%' }, // Jr. Comercio / Centro
                  'obra-04': { top: '20%', left: '72%' }, // Capillapata
                  'obra-05': { top: '65%', left: '25%' }, // San Martín
                };

                const pos = positions[obra.id] || { top: '50%', left: '50%' };

                const colorBg =
                  obra.estado === 'Culminada'
                    ? 'bg-blue-500 text-white'
                    : obra.estado === 'En Plazo'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white';

                return (
                  <button
                    key={obra.id}
                    onClick={() => setSelectedObra(obra)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none ${
                      isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110 opacity-90'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg font-bold text-xs ring-4 ${
                          isSelected ? 'ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'ring-black/30'
                        } ${colorBg}`}
                      >
                        <HardHat className="w-3.5 h-3.5" />
                      </div>
                      <span className="mt-1 text-[10px] font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded shadow whitespace-nowrap border border-slate-700">
                        {obra.sector}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Footer Notice */}
          <div className="relative z-10 text-[11px] text-slate-400 flex justify-between items-center pt-2 border-t border-slate-800">
            <span>Coordenadas GPS: 10°55′S 76°03′W</span>
            <span className="text-muni-400">Haz clic en un punto para ver el expediente CUI</span>
          </div>
        </div>

        {/* Detalle del Proyecto Seleccionado (5 columnas) */}
        <div className="lg:col-span-5 p-5 bg-white flex flex-col justify-between">
          <div>
            {/* Header del CUI */}
            <div className="flex justify-between items-start gap-2 mb-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-300">
                CUI: {selectedObra.cui}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                  selectedObra.estado === 'Culminada'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedObra.estado === 'En Plazo'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedObra.estado === 'Culminada' ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : selectedObra.estado === 'En Plazo' ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {selectedObra.estado}
              </span>
            </div>

            <h4 className="font-bold text-slate-900 text-sm leading-snug mb-3">
              {selectedObra.nombre}
            </h4>

            {/* Barras de Progreso Físico vs Financiero */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                  <span>Avance Físico de Obra</span>
                  <span className="font-bold text-emerald-700">{selectedObra.avanceFisico}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedObra.avanceFisico}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                  <span>Avance Financiero (Devengado)</span>
                  <span className="font-bold text-muni-700">{selectedObra.avanceFinanciero}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-muni-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedObra.avanceFinanciero}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Ficha de Información Clave */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Presupuesto Actualizado:</span>
                <span className="font-bold text-slate-800">
                  S/. {selectedObra.costoActualizado.toLocaleString('es-PE')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Monto Devengado:</span>
                <span className="font-semibold text-slate-700">
                  S/. {selectedObra.devengadoAcumulado.toLocaleString('es-PE')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Sector / Ubicación:</span>
                <span className="font-semibold text-slate-800">{selectedObra.sector}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Contratista Ejecutor:</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]" title={selectedObra.contratista}>
                  {selectedObra.contratista}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Plazo / Entrega:</span>
                <span className="font-medium text-slate-700">
                  {selectedObra.fechaInicio} al {selectedObra.fechaFinPrevista}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Población Beneficiaria:</span>
                <span className="font-semibold text-slate-800">
                  {selectedObra.beneficiariosAprox.toLocaleString()} habitantes
                </span>
              </div>
            </div>
          </div>

          {/* Enlaces de Auditoría */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
            <a
              href={`https://ofi5.mef.gob.pe/invierte/inversion/consultaInversion/${selectedObra.cui}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-muni-600 hover:text-muni-800 inline-flex items-center gap-1"
            >
              Ficha en Banco de Inversiones (MEF) <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://infobras.contraloria.gob.pe/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              Infobras Contraloría <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
