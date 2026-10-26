import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, ShieldCheck, FileText, Globe, Landmark, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Identidad */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-400/40 shadow flex-shrink-0 bg-slate-950">
                <Image
                  src="/images/logo_carhuamayo.png"
                  alt="Escudo Carhuamayo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-white text-sm block leading-tight">
                  MDC Carhuamayo
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Junín · Meseta de Bombón
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma cívica y pública de transparencia activa para el Distrito de Carhuamayo, Provincia de Junín, Perú. 
              Acceso libre y en tiempo real a los recursos públicos.
            </p>
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Portal conforme a Ley N° 27806 de Transparencia
            </div>
          </div>

          {/* Columna 2: Enlaces a Fuentes Oficiales del Estado */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-muni-400" /> Fuentes Oficiales del Estado
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://apps5.mineco.gob.pe/transparencia/mensual/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1 text-slate-400"
                >
                  MEF - Consulta Amigable (SIAF) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gob.pe/osce" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1 text-slate-400"
                >
                  OSCE - Plataforma SEACE <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://infobras.contraloria.gob.pe/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1 text-slate-400"
                >
                  Contraloría - INFOBRAS <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.datosabiertos.gob.pe/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1 text-slate-400"
                >
                  Plataforma Nacional de Datos Abiertos <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.transparencia.gob.pe/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1 text-slate-400"
                >
                  Portal de Transparencia Estándar (PTE) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Módulos del Portal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-muni-400" /> Secciones del Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/presupuesto" className="hover:text-white transition text-slate-400">Ejecución Presupuestal 2026</Link></li>
              <li><Link href="/abastecimiento" className="hover:text-white transition text-slate-400">Órdenes de Compra & Servicio &lt; 8 UIT</Link></li>
              <li><Link href="/abastecimiento" className="hover:text-white transition text-slate-400">Procesos de Selección SEACE</Link></li>
              <li><Link href="/obras" className="hover:text-white transition text-slate-400">Georreferenciación de Obras (CUI)</Link></li>
              <li><Link href="/modernizacion" className="hover:text-white transition text-slate-400">Normas Legales y Estructura Orgánica</Link></li>
            </ul>
          </div>

          {/* Columna 4: Información Territorial */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-muni-400" /> Información Territorial
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
              <p><strong className="text-slate-200">Distrito:</strong> Carhuamayo</p>
              <p><strong className="text-slate-200">Provincia:</strong> Junín</p>
              <p><strong className="text-slate-200">Región:</strong> Junín (Perú)</p>
              <p><strong className="text-slate-200">Altitud:</strong> 4,125 m.s.n.m.</p>
              <p><strong className="text-slate-200">Atractivo:</strong> Cuna y Capital de la Maca / Meseta de Bombón</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© Jhann W. Chavez Molina</p>
          <p className="flex items-center gap-1">
            Desarrollado para el fortalecimiento de la transparencia y la participación ciudadana.
          </p>
        </div>
      </div>
    </footer>
  );
}
