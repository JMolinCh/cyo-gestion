'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  ShoppingBag, 
  HardHat, 
  Cpu, 
  Database, 
  Menu, 
  X, 
  Activity, 
  Layers,
  Sparkles,
  Scale
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Resumen General', icon: Layers },
  { href: '/presupuesto', label: 'Presupuesto (MEF)', icon: BarChart3 },
  { href: '/abastecimiento', label: 'Abastecimiento (SEACE)', icon: ShoppingBag },
  { href: '/obras', label: 'Obras Públicas', icon: HardHat },
  { href: '/modernizacion', label: 'Modernización & Normas', icon: Scale },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Banner Institucional */}
      <div className="bg-gradient-to-r from-muni-900 via-muni-800 to-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              DATOS EN LÍNEA · PERIODO 2026
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-slate-200 font-medium">
              Ubigeo: 120502 · Carhuamayo - Junín - Perú (4,125 m.s.n.m.)
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-carhuamayo-splash'));
                }
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 px-2.5 py-0.5 rounded-full font-medium text-[11px] border border-emerald-500/40 transition cursor-pointer shadow-sm active:scale-95"
              title="Abrir portada oficial y ejecutar sincronización de scrapers en tiempo real"
            >
              <Activity className="w-3 h-3 text-amber-300 animate-pulse" />
              <span>Sincronizar Scrapers (Portada)</span>
            </button>
            <span className="hidden md:inline bg-maca-700/60 text-amber-200 px-2 py-0.5 rounded font-medium text-[11px] border border-amber-500/30">
              🌟 Capital Mundial de la Maca
            </span>
            <span className="text-[11px] text-slate-400">
              Fuente: SIAF-MEF · SEACE · INVIERTE.PE
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-md border-2 border-amber-400/40 group-hover:scale-105 transition-transform flex-shrink-0 bg-slate-900">
              <Image
                src="/images/logo_carhuamayo.png"
                alt="Logo Municipalidad Distrital de Carhuamayo"
                fill
                sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg leading-tight flex items-center gap-1.5">
                MUNICIPALIDAD DISTRITAL DE CARHUAMAYO
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                Portal de Inteligencia y Gestión Pública en Tiempo Real
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-muni-50 text-muni-700 border border-muni-200 shadow-sm'
                      : 'text-slate-600 hover:text-muni-700 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-muni-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-muni-50 text-muni-700 font-bold border border-muni-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-muni-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
