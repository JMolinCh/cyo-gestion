'use client';

import React from 'react';
import { INDICADORES_MODERNIZACION, EXPEDIENTES_RECIENTES } from '@/data/carhuamayoModernizacion';
import { 
  Sparkles, 
  FileCheck, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DigitalServicesCard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Indicadores de Modernización (5 columnas) */}
      <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Modernización & Transformación Digital
              </h3>
              <p className="text-xs text-slate-500">
                Políticas de Gestión Pública e Integridad (SGP - PCM)
              </p>
            </div>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Meta 2026
            </span>
          </div>

          <div className="space-y-4">
            {INDICADORES_MODERNIZACION.slice(0, 4).map((ind, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{ind.titulo}</span>
                  <span className="font-extrabold text-muni-700">{ind.valor}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-muni-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(ind.porcentaje, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {ind.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Mesa de Partes Virtual disponible 24/7</span>
          <a
            href="/modernizacion"
            className="font-bold text-muni-600 hover:text-muni-800"
          >
            Ver catálogo TUPA →
          </a>
        </div>
      </div>

      {/* Expedientes y Mesa de Partes en Vivo (7 columnas) */}
      <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-muni-600" />
                Mesa de Partes Digital · Trámites en Tiempo Real
              </h3>
              <p className="text-xs text-slate-500">
                Seguimiento de plazos según Ley N° 27444 (Procedimiento Administrativo General)
              </p>
            </div>
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {EXPEDIENTES_RECIENTES.length} expedientes en trámite
            </span>
          </div>

          <div className="space-y-2.5">
            {EXPEDIENTES_RECIENTES.map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-lg border border-slate-200/70 hover:border-muni-300 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">
                      {exp.numeroExpediente}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                        exp.canal === 'Mesa de Partes Digital'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {exp.canal}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {exp.fechaIngreso}
                    </span>
                  </div>

                  <p className="font-medium text-slate-700 line-clamp-1">
                    {exp.asunto}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Área: <strong className="text-slate-600">{exp.areaResponsable}</strong></span>
                    <span>·</span>
                    <span>Trámite: <em>{exp.tipoTramite}</em></span>
                  </div>
                </div>

                <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1 flex-shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      exp.estado === 'Atendido'
                        ? 'bg-emerald-100 text-emerald-800'
                        : exp.estado === 'En Calificación'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {exp.estado === 'Atendido' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {exp.estado}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    Día {exp.diasTranscurridos} de {exp.plazoLegalDias} días hábiles
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Consulta tu expediente con el Código de Trámite</span>
          <a
            href="/modernizacion"
            className="font-bold text-muni-600 hover:text-muni-800"
          >
            Módulo Completo de Trámites →
          </a>
        </div>
      </div>
    </div>
  );
}
