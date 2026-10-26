'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Clock,
  MapPin,
  Layers,
  Maximize2,
  ExternalLink,
  Check,
  AlertTriangle,
  FileText,
  BarChart2,
  Home,
  Menu,
  ChevronDown,
  Info,
  Building,
  DollarSign
} from 'lucide-react';
import { OBRAS_INFOBRAS_CARHUAMAYO, ObraInfobrasMapa } from '@/data/carhuamayoInfobrasMapa';

export default function InfobrasMap() {
  const [obras] = useState<ObraInfobrasMapa[]>(OBRAS_INFOBRAS_CARHUAMAYO);

  // Filtros de búsqueda
  const [searchTexto, setSearchTexto] = useState('municipalidad distrital de carhuamayo');
  const [searchCodigo, setSearchCodigo] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('');
  const [estadosActivos, setEstadosActivos] = useState<Record<string, boolean>>({
    'SIN EJECUCIÓN': true,
    'PARALIZADAS': true,
    'EN EJECUCIÓN': true,
    'FINALIZADAS': true,
  });

  // Modal / panel de obra seleccionada
  const [obraSeleccionada, setObraSeleccionada] = useState<ObraInfobrasMapa | null>(null);
  const [modoVisor, setModoVisor] = useState<'mapa_interactivo' | 'portal_oficial'>('mapa_interactivo');

  // Coordenadas dinámicas del cursor (WGS 84)
  const [coordenadasCursor, setCoordenadasCursor] = useState({
    lat: -10.91551,
    lng: -76.04176,
  });

  // Referencias para Leaflet
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  // Estadísticas rápidas Infobras
  const conteoPorEstado = useMemo(() => {
    return {
      'SIN EJECUCIÓN': obras.filter((o) => o.estado === 'SIN EJECUCIÓN').length,
      'PARALIZADAS': obras.filter((o) => o.estado === 'PARALIZADAS').length,
      'EN EJECUCIÓN': obras.filter((o) => o.estado === 'EN EJECUCIÓN').length,
      'FINALIZADAS': obras.filter((o) => o.estado === 'FINALIZADAS').length,
    };
  }, [obras]);

  // Filtrado de obras
  const obrasFiltradas = useMemo(() => {
    return obras.filter((obra) => {
      // Filtro por estado activo en leyenda
      if (!estadosActivos[obra.estado]) return false;

      // Filtro por texto si se modificó
      if (searchTexto && searchTexto !== 'municipalidad distrital de carhuamayo') {
        const query = searchTexto.toLowerCase();
        const matchNombre = obra.nombre.toLowerCase().includes(query);
        const matchCui = obra.cui.includes(query);
        const matchSector = obra.sector.toLowerCase().includes(query);
        if (!matchNombre && !matchCui && !matchSector) return false;
      }

      // Filtro por código Infobras exacto
      if (searchCodigo) {
        if (!obra.codigo.toString().includes(searchCodigo)) return false;
      }

      return true;
    });
  }, [obras, estadosActivos, searchTexto, searchCodigo]);

  // Carga e inicialización de Leaflet
  useEffect(() => {
    if (modoVisor !== 'mapa_interactivo' || !mapContainerRef.current) return;

    let isMounted = true;

    const loadLeaflet = async () => {
      // 1. Cargar CSS si no existe
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // 2. Cargar JS si no existe
      if (!(window as any).L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      const L = (window as any).L;
      if (!L || !isMounted || !mapContainerRef.current) return;

      // Si ya hay un mapa instanciado, limpiarlo
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      // Inicializar mapa centrado en Carhuamayo
      const map = L.map(mapContainerRef.current, {
        center: [-10.9185, -76.0428],
        zoom: 15,
        zoomControl: false,
      });

      leafletMapRef.current = map;

      // Control de zoom en esquina inferior derecha como en Infobras
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Capa de mosaicos CartoDB Voyager (idéntica a la vista clara de Infobras)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://infobras.contraloria.gob.pe/">Infobras Contraloría</a> &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      // Seguimiento de coordenadas del mouse
      map.on('mousemove', (e: any) => {
        setCoordenadasCursor({
          lat: Number(e.latlng.lat.toFixed(5)),
          lng: Number(e.latlng.lng.toFixed(5)),
        });
      });

      // Capa de marcadores
      const markersLayer = L.layerGroup().addTo(map);
      markersGroupRef.current = markersLayer;

      // Renderizar marcadores
      actualizarMarcadores(map, markersLayer, L, obrasFiltradas);
    };

    loadLeaflet();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [modoVisor]);

  // Actualizar marcadores cuando cambian los filtros
  useEffect(() => {
    const L = (window as any).L;
    if (leafletMapRef.current && markersGroupRef.current && L) {
      actualizarMarcadores(leafletMapRef.current, markersGroupRef.current, L, obrasFiltradas);
    }
  }, [obrasFiltradas]);

  // Función para dibujar los marcadores circulares tipo Infobras
  const actualizarMarcadores = (map: any, group: any, L: any, lista: ObraInfobrasMapa[]) => {
    group.clearLayers();

    lista.forEach((obra) => {
      // Color según estado Infobras
      const fillColor =
        obra.estado === 'EN EJECUCIÓN'
          ? '#10b981' // Verde
          : obra.estado === 'FINALIZADAS'
          ? '#3b82f6' // Azul
          : obra.estado === 'PARALIZADAS'
          ? '#ef4444' // Rojo
          : '#f59e0b'; // Amarillo

      // Marcador SVG personalizado idéntico a Infobras
      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="
            width: 18px; 
            height: 18px; 
            background-color: ${fillColor}; 
            border: 2.5px solid #ffffff; 
            border-radius: 50%; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            transition: transform 0.2s ease;
          "></div>
          ${
            obra.codigo === 546268
              ? `<span style="position: absolute; top: -18px; left: -14px; background: rgba(15,23,42,0.85); color: #fff; font-size: 10px; font-weight: bold; font-family: monospace; padding: 1px 4px; border-radius: 4px; border: 1px solid #64748b; white-space: nowrap;">546268</span>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'infobras-marker',
        html: iconHtml,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([obra.lat, obra.lng], { icon: customIcon });

      // Popup informativo estilo Infobras
      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; max-width: 280px; padding: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: bold; color: #fff; background: ${fillColor}; padding: 2px 6px; border-radius: 4px;">
              ${obra.estado}
            </span>
            <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #475569;">
              # ${obra.codigo}
            </span>
          </div>

          <div style="font-weight: 700; color: #0f172a; line-height: 1.25; margin-bottom: 6px;">
            ${obra.nombre}
          </div>

          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            <strong>Sector:</strong> ${obra.sector}<br/>
            ${obra.cui ? `<strong>CUI:</strong> <span style="font-family: monospace; font-weight: bold; color: #0284c7;">${obra.cui}</span><br/>` : ''}
            ${obra.monto > 0 ? `<strong>Monto:</strong> S/. ${obra.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}<br/>` : ''}
            <strong>Avance Físico:</strong> <strong style="color: ${fillColor};">${obra.avance}%</strong>
          </div>

          <div style="margin-top: 8px; pt: 6px; border-top: 1px solid #e2e8f0; display: flex; gap: 4px;">
            <a 
              href="${obra.enlaceInfobras}" 
              target="_blank" 
              style="display: inline-block; background: #0f172a; color: #fff; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 4px; text-decoration: none;"
            >
              Ficha Infobras ↗
            </a>
            ${
              obra.enlaceSsi
                ? `<a href="${obra.enlaceSsi}" target="_blank" style="display: inline-block; background: #0284c7; color: #fff; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 4px; text-decoration: none;">SSI MEF ↗</a>`
                : ''
            }
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => setObraSeleccionada(obra));
      group.addLayer(marker);
    });
  };

  // Toggle estado en leyenda
  const toggleEstado = (estado: string) => {
    setEstadosActivos((prev) => ({
      ...prev,
      [estado]: !prev[estado],
    }));
  };

  // Botón buscar: si hay un código, enfocar el marcador
  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCodigo) {
      const match = obras.find((o) => o.codigo.toString() === searchCodigo.trim());
      if (match && leafletMapRef.current) {
        leafletMapRef.current.flyTo([match.lat, match.lng], 17, { duration: 1.5 });
        setObraSeleccionada(match);
      }
    }
  };

  const handleLimpiar = () => {
    setSearchTexto('municipalidad distrital de carhuamayo');
    setSearchCodigo('');
    setOrdenarPor('');
    setEstadosActivos({
      'SIN EJECUCIÓN': true,
      'PARALIZADAS': true,
      'EN EJECUCIÓN': true,
      'FINALIZADAS': true,
    });
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([-10.9185, -76.0428], 15, { duration: 1 });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-0">
      {/* Barra de Selección de Visor: Mapa Interactivo HD vs Portal Oficial Infobras */}
      <div className="bg-slate-900 text-white px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-red-600 rounded-lg text-white font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              Infobras Contraloría — Mapa Territorial de Carhuamayo
            </h3>
            <span className="text-[11px] text-slate-400">
              34 obras georreferenciadas con código Infobras y CUI oficial
            </span>
          </div>
        </div>

        {/* Conmutador de Visor */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setModoVisor('mapa_interactivo')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              modoVisor === 'mapa_interactivo'
                ? 'bg-muni-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Visor Interactivo HD (34 Obras)</span>
          </button>

          <button
            onClick={() => setModoVisor('portal_oficial')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              modoVisor === 'portal_oficial'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Portal en Vivo Contraloría</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODO 1: VISOR INTERACTIVO LEAFLET IDÉNTICO A INFOBRAS     */}
      {/* ======================================================== */}
      {modoVisor === 'mapa_interactivo' && (
        <div className="relative w-full h-[620px] bg-slate-100 overflow-hidden">
          {/* Contenedor del Mapa Leaflet */}
          <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />

          {/* ================================================== */}
          {/* FLOATING CARD: ZONA DE BÚSQUEDA (Top Left)         */}
          {/* ================================================== */}
          <div className="absolute top-3 left-3 z-10 w-full max-w-[320px] sm:max-w-[340px] pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden transition-all">
              {/* Header de la tarjeta */}
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    ZONA DE BÚSQUEDA
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>BÁSICA</span>
                </div>
              </div>

              {/* Formulario de búsqueda básica Infobras */}
              <form onSubmit={handleBuscar} className="p-3.5 space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Entidad, Ejecutor, nombre de obra o lugar de la obra
                  </label>
                  <input
                    type="text"
                    value={searchTexto}
                    onChange={(e) => setSearchTexto(e.target.value)}
                    placeholder="municipalidad distrital de carhuamayo"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Código de INFOBRAS
                  </label>
                  <input
                    type="text"
                    value={searchCodigo}
                    onChange={(e) => setSearchCodigo(e.target.value)}
                    placeholder="Ej. 546268, 510079..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Ordenar por:
                  </label>
                  <select
                    value={ordenarPor}
                    onChange={(e) => setOrdenarPor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs"
                  >
                    <option value="">- Seleccionar -</option>
                    <option value="1">Con mayor monto</option>
                    <option value="2">Iniciadas recientemente</option>
                    <option value="3">Actualizadas recientemente</option>
                    <option value="5">Finalizadas recientemente</option>
                  </select>
                </div>

                {/* Botones BUSCAR y LIMPIAR idénticos al screenshot */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-white border border-red-500 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm transition"
                  >
                    <Search className="w-3.5 h-3.5 text-red-600" />
                    <span>BUSCAR</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLimpiar}
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>LIMPIAR</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ================================================== */}
          {/* FLOATING PILLS: ACCESOS RÁPIDOS (Top Right)        */}
          {/* ================================================== */}
          <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-2 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 px-3 py-1.5 flex items-center gap-3 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Search className="w-3.5 h-3.5 text-slate-500" /> ZONA DE BÚSQUEDA
              </span>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => {
                  const estadisticasTexto = `Obras Carhuamayo en Infobras: Total: 34\nFinalizadas: ${conteoPorEstado['FINALIZADAS']}\nEn Ejecución: ${conteoPorEstado['EN EJECUCIÓN']}\nSin Ejecución: ${conteoPorEstado['SIN EJECUCIÓN']}\nParalizadas: ${conteoPorEstado['PARALIZADAS']}`;
                  alert(estadisticasTexto);
                }}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition"
              >
                <BarChart2 className="w-3.5 h-3.5 text-slate-500" /> ESTADÍSTICAS
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={handleLimpiar}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition"
              >
                <Home className="w-3.5 h-3.5 text-slate-500" /> INICIO
              </button>
              <span className="text-slate-300">|</span>
              <a
                href="https://infobras.contraloria.gob.pe/InfobrasWeb/Mapa/Index#"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-red-600 hover:text-red-800 transition"
              >
                <Menu className="w-3.5 h-3.5" /> MENÚ
              </a>
            </div>
          </div>

          {/* ================================================== */}
          {/* FLOATING TOOLBAR DERECHO: HERRAMIENTAS DE MAPA     */}
          {/* ================================================== */}
          <div className="absolute top-16 sm:top-14 right-3 z-10 flex flex-col gap-2 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/90 p-1 flex flex-col items-center gap-1">
              {/* Tooltip Estado de Ejecución activo */}
              <button
                className="relative p-2 rounded-lg bg-red-600 text-white shadow transition group"
                title="Estado de Ejecución de Obras"
              >
                <Clock className="w-4 h-4" />
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  Estado de Ejecución de Obras
                </span>
              </button>

              <button
                onClick={() => {
                  if (leafletMapRef.current) {
                    leafletMapRef.current.flyTo([-10.9185, -76.0428], 16, { duration: 1 });
                  }
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition group relative"
                title="Centrar en Plaza Principal Carhuamayo"
              >
                <MapPin className="w-4 h-4" />
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  Centrar en Carhuamayo
                </span>
              </button>

              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    url: 'https://infobras.contraloria.gob.pe/InfobrasWeb/Mapa/Index#',
                  });
                  window.open('https://infobras.contraloria.gob.pe/InfobrasWeb/Mapa/Index#', '_blank');
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition group relative"
                title="Abrir enlace oficial en Contraloría"
              >
                <ExternalLink className="w-4 h-4 text-muni-600" />
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  Abrir Infobras Contraloría
                </span>
              </button>
            </div>
          </div>

          {/* ================================================== */}
          {/* FLOATING LEGEND: ESTADO DE EJECUCIÓN (Bottom Right) */}
          {/* ================================================== */}
          <div className="absolute bottom-3 right-3 z-10 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-3 sm:p-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800 mb-2.5">
                ESTADO DE EJECUCIÓN DE OBRAS
              </h4>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 text-xs">
                {/* SIN EJECUCIÓN */}
                <button
                  type="button"
                  onClick={() => toggleEstado('SIN EJECUCIÓN')}
                  className={`flex items-center gap-1.5 transition select-none ${
                    estadosActivos['SIN EJECUCIÓN'] ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                    {estadosActivos['SIN EJECUCIÓN'] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-bold text-slate-700 text-[11px]">
                    SIN EJECUCIÓN ({conteoPorEstado['SIN EJECUCIÓN']})
                  </span>
                </button>

                {/* PARALIZADAS */}
                <button
                  type="button"
                  onClick={() => toggleEstado('PARALIZADAS')}
                  className={`flex items-center gap-1.5 transition select-none ${
                    estadosActivos['PARALIZADAS'] ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shadow-sm">
                    {estadosActivos['PARALIZADAS'] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-bold text-slate-700 text-[11px]">
                    PARALIZADAS ({conteoPorEstado['PARALIZADAS']})
                  </span>
                </button>

                {/* EN EJECUCIÓN */}
                <button
                  type="button"
                  onClick={() => toggleEstado('EN EJECUCIÓN')}
                  className={`flex items-center gap-1.5 transition select-none ${
                    estadosActivos['EN EJECUCIÓN'] ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                    {estadosActivos['EN EJECUCIÓN'] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-bold text-slate-700 text-[11px]">
                    EN EJECUCIÓN ({conteoPorEstado['EN EJECUCIÓN']})
                  </span>
                </button>

                {/* FINALIZADAS */}
                <button
                  type="button"
                  onClick={() => toggleEstado('FINALIZADAS')}
                  className={`flex items-center gap-1.5 transition select-none ${
                    estadosActivos['FINALIZADAS'] ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                    {estadosActivos['FINALIZADAS'] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-bold text-slate-700 text-[11px]">
                    FINALIZADAS ({conteoPorEstado['FINALIZADAS']})
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* FLOATING BAR: COORDENADAS Y ESCALA (Bottom Left)    */}
          {/* ================================================== */}
          <div className="absolute bottom-3 left-3 z-10 hidden md:flex items-center gap-2 pointer-events-auto">
            <div className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-mono px-3 py-1 rounded-lg border border-slate-700 shadow flex items-center gap-3">
              <span className="font-bold text-amber-400">200 m</span>
              <span className="text-slate-500">|</span>
              <span>
                WGS 84: {coordenadasCursor.lng} (x), {coordenadasCursor.lat} (y)
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">UTM: Zona 18L, Carhuamayo, Junín</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODO 2: PORTAL OFICIAL EN VIVO DE CONTRALORÍA (IFRAME)   */}
      {/* ======================================================== */}
      {modoVisor === 'portal_oficial' && (
        <div className="relative w-full h-[650px] bg-slate-100">
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Conectado directamente a los servidores del <strong>Sistema INFOBRAS</strong> de la Contraloría General de la República.
              </span>
            </div>
            <a
              href="https://infobras.contraloria.gob.pe/InfobrasWeb/Mapa/Index#"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 underline"
            >
              <span>Abrir en ventana completa</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <iframe
            src="https://infobras.contraloria.gob.pe/InfobrasWeb/Mapa/Index#"
            title="Infobras Mapa Contraloria"
            className="w-full h-[600px] border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      )}
    </div>
  );
}
