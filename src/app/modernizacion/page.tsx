'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  Building2, 
  Scale, 
  FileCheck, 
  ShieldCheck, 
  Sparkles,
  Search,
  Maximize2,
  FileCode,
  BookOpen,
  Landmark,
  Scroll,
  Layers,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

interface NormaLink {
  id: string;
  tipo: string;
  codigoTipo: string;
  titulo: string;
  descripcion: string;
  url: string;
  categoria: 'Concejo' | 'Alcaldia' | 'Gerencia';
  icono: any;
  colorTheme: {
    bg: string;
    border: string;
    badge: string;
    text: string;
    button: string;
  };
}

const NORMAS_CARHUAMAYO: NormaLink[] = [
  {
    id: 'ordenanza-municipal',
    tipo: 'Ordenanza Municipal',
    codigoTipo: 'Tipo 111',
    titulo: 'Ordenanzas Municipales',
    descripcion:
      'Normas de carácter general de mayor jerarquía en la estructura normativa municipal. Regulan la organización interna, tributos, tasas y licencias de Carhuamayo.',
    url: 'https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/111-ordenanza-municipal',
    categoria: 'Concejo',
    icono: Scroll,
    colorTheme: {
      bg: 'bg-emerald-50/60 hover:bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      text: 'text-emerald-900',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
  },
  {
    id: 'acuerdo-concejo',
    tipo: 'Acuerdo de Concejo',
    codigoTipo: 'Tipo 108',
    titulo: 'Acuerdos de Concejo',
    descripcion:
      'Decisiones adoptadas por el Concejo Municipal de Carhuamayo sobre asuntos específicos de interés público, vecinal o institucional en sesión oficial.',
    url: 'https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/108-acuerdo-de-concejo',
    categoria: 'Concejo',
    icono: Landmark,
    colorTheme: {
      bg: 'bg-blue-50/60 hover:bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      text: 'text-blue-900',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  },
  {
    id: 'decreto-alcaldia',
    tipo: 'Decreto de Alcaldía',
    codigoTipo: 'Tipo 96',
    titulo: 'Decretos de Alcaldía',
    descripcion:
      'Normas reglamentarias y de aplicación dictadas por el despacho de Alcaldía para la ejecución y cumplimiento de las ordenanzas municipales.',
    url: 'https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/96-decreto-de-alcaldia',
    categoria: 'Alcaldia',
    icono: Scale,
    colorTheme: {
      bg: 'bg-indigo-50/60 hover:bg-indigo-50',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      text: 'text-indigo-900',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
  },
  {
    id: 'resolucion-alcaldia',
    tipo: 'Resolución de Alcaldía',
    codigoTipo: 'Tipo 89',
    titulo: 'Resoluciones de Alcaldía',
    descripcion:
      'Actos administrativos y de gestión municipal aprobados por el Alcalde Distrital para resolver asuntos específicos de administración pública.',
    url: 'https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/89-resolucion-de-alcaldia',
    categoria: 'Alcaldia',
    icono: FileCheck,
    colorTheme: {
      bg: 'bg-amber-50/60 hover:bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      text: 'text-amber-900',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
  },
  {
    id: 'resolucion-gerencia-municipal',
    tipo: 'Resolución de Gerencia Municipal',
    codigoTipo: 'Tipo 159',
    titulo: 'Resoluciones de Gerencia Municipal',
    descripcion:
      'Disposiciones administrativas expedidas por la Gerencia Municipal como máxima autoridad técnica y administrativa del gobierno local.',
    url: 'https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/159-resolucion-de-gerencia-municipal',
    categoria: 'Gerencia',
    icono: Building2,
    colorTheme: {
      bg: 'bg-purple-50/60 hover:bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
      text: 'text-purple-900',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  },
  {
    id: 'resolucion-gerencial',
    tipo: 'Resolución Gerencial',
    codigoTipo: 'Tipo 127',
    titulo: 'Resoluciones Gerenciales',
    descripcion:
      'Actos administrativos emitidos por las diferentes gerencias de línea y órganos de apoyo en el ámbito de sus competencias funcionales.',
    url: 'https://www.gob.pe/institucion/municarhuamayo/normas-legales/tipos/127-resolucion-gerencial',
    categoria: 'Gerencia',
    icono: FileText,
    colorTheme: {
      bg: 'bg-slate-50/80 hover:bg-slate-100',
      border: 'border-slate-300',
      badge: 'bg-slate-200 text-slate-800 border-slate-300',
      text: 'text-slate-900',
      button: 'bg-slate-800 hover:bg-slate-900 text-white',
    },
  },
];

const GOOGLE_DRIVE_DOC = {
  titulo: 'Estructura Orgánica Institucional (PDF Oficial)',
  subtitulo: 'Organigrama y Estructura Organizacional de la Municipalidad Distrital de Carhuamayo',
  urlView: 'https://drive.google.com/file/d/1kQqNGz4dO2RisyWPleIf_gjgOw3dBk3v/view',
  urlPreview: 'https://drive.google.com/file/d/1kQqNGz4dO2RisyWPleIf_gjgOw3dBk3v/preview',
};

export default function ModernizacionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<'todas' | 'Concejo' | 'Alcaldia' | 'Gerencia'>('todas');
  const [mostrarVisorPdf, setMostrarVisorPdf] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const normasFiltradas = NORMAS_CARHUAMAYO.filter((n) => {
    const matchCat = filtroCategoria === 'todas' || n.categoria === filtroCategoria;
    const matchSearch =
      searchTerm === '' ||
      n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.codigoTipo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-muni-600 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-muni-700 font-bold">Módulo de Modernización</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-muni-600" />
            Marco Normativo y Estructura Orgánica
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Repositorio oficial de normas legales, resoluciones administrativas y estructura organizacional de la Municipalidad Distrital de Carhuamayo publicadas en la plataforma del Estado peruano (Gob.pe).
          </p>
        </div>

        <a
          href="https://www.gob.pe/institucion/municarhuamayo/normas-legales"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition active:scale-95 flex-shrink-0"
        >
          <span>Buscador General Gob.pe</span>
          <ExternalLink className="w-4 h-4 text-rose-200" />
        </a>
      </div>

      {/* SECCIÓN 1: Estructura Orgánica (Google Drive PDF) */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-muni-950 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 flex-shrink-0">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-red-500/30 mb-1">
                <BookOpen className="w-3 h-3" />
                DOCUMENTO OFICIAL DE GESTIÓN (ROF)
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {GOOGLE_DRIVE_DOC.titulo}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {GOOGLE_DRIVE_DOC.subtitulo}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setMostrarVisorPdf(!mostrarVisorPdf)}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/15 transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{mostrarVisorPdf ? 'Ocultar Visor' : 'Ver en Pantalla'}</span>
            </button>

            <a
              href={GOOGLE_DRIVE_DOC.urlView}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
            >
              <span>Abrir en Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Visor interactivo integrado de Google Drive */}
        {mostrarVisorPdf && (
          <div className="w-full rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-inner">
            <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span className="font-mono text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ESTRUCTURA ORGANICA.pdf (Vista previa interactiva)
              </span>
              <a
                href={GOOGLE_DRIVE_DOC.urlView}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline text-[11px]"
              >
                Abrir en pestaña nueva ↗
              </a>
            </div>
            <iframe
              src={GOOGLE_DRIVE_DOC.urlPreview}
              title="Estructura Orgánica de la Municipalidad Distrital de Carhuamayo"
              className="w-full h-[520px] sm:h-[620px] bg-slate-900"
              allow="autoplay"
            />
          </div>
        )}
      </section>

      {/* SECCIÓN 2: Normas Legales en Gob.pe */}
      <section className="space-y-4">
        {/* Cabecera y Filtros de Búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-muni-600" />
              Normas Legales de la Municipalidad Distrital de Carhuamayo
            </h3>
            <p className="text-xs text-slate-500">
              Accede a las publicaciones vigentes clasificadas según su jerarquía legal en el portal oficial del Estado peruano (Gob.pe).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar norma o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-500 font-medium"
              />
            </div>

            {/* Selector de categoría */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFiltroCategoria('todas')}
                className={`px-3 py-1 rounded-md transition ${
                  filtroCategoria === 'todas'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas ({NORMAS_CARHUAMAYO.length})
              </button>
              <button
                onClick={() => setFiltroCategoria('Concejo')}
                className={`px-3 py-1 rounded-md transition ${
                  filtroCategoria === 'Concejo'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Concejo
              </button>
              <button
                onClick={() => setFiltroCategoria('Alcaldia')}
                className={`px-3 py-1 rounded-md transition ${
                  filtroCategoria === 'Alcaldia'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Alcaldía
              </button>
              <button
                onClick={() => setFiltroCategoria('Gerencia')}
                className={`px-3 py-1 rounded-md transition ${
                  filtroCategoria === 'Gerencia'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gerencia
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Tarjetas de Normas Legales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {normasFiltradas.map((norma) => {
            const Icono = norma.icono;
            const theme = norma.colorTheme;
            return (
              <div
                key={norma.id}
                className={`rounded-2xl border ${theme.border} ${theme.bg} p-5 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                      <Icono className="w-5 h-5 text-slate-800" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${theme.badge}`}>
                        {norma.codigoTipo}
                      </span>
                      <button
                        onClick={() => handleCopy(norma.id, norma.url)}
                        title="Copiar enlace oficial"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition"
                      >
                        {copiedId === norma.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900 leading-snug">
                      {norma.titulo}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {norma.descripcion}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    Portal Gob.pe
                  </span>

                  <a
                    href={norma.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition active:scale-95 ${theme.button}`}
                  >
                    <span>Consultar Normas</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Banner Informativo Cívico */}
      <section className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muni-100 text-muni-700 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-800">
              Principio de Publicidad y Transparencia Normativa
            </p>
            <p className="text-slate-500 mt-0.5">
              Todas las normas legales emitidas por la Municipalidad Distrital de Carhuamayo son de libre consulta ciudadana conforme a la Ley Orgánica de Municipalidades (Ley N° 27972).
            </p>
          </div>
        </div>

        <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-mono font-semibold text-slate-700 whitespace-nowrap">
          RUC: 20185644830
        </span>
      </section>
    </div>
  );
}
