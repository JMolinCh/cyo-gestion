'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

interface SplashLoaderProps {
  onFinish?: () => void;
}

export default function SplashLoader({ onFinish }: SplashLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [stepText, setStepText] = useState<string>('Iniciando sincronización...');
  const [isFinished, setIsFinished] = useState(false);

  const isCancelledRef = useRef<boolean>(false);

  const handleDismiss = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('carhuamayo_splash_dismissed', 'true');
      }
      if (onFinish) onFinish();
    }, 500);
  }, [onFinish]);

  const runSyncPipeline = useCallback(async () => {
    isCancelledRef.current = false;
    setIsVisible(true);
    setIsFadingOut(false);
    setIsFinished(false);
    setProgress(5);
    setStepText('Conectando con servidores del Estado...');

    // === PASO 1: MEF PRESUPUESTO ===
    setStepText('Sincronizando Presupuesto MEF...');
    setProgress(25);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);
      await fetch('/api/presupuesto/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ano: 2026 }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
    } catch {
      // fallback
    }

    if (isCancelledRef.current) return;
    setProgress(60);

    // === PASO 2: SEACE CONTRATACIONES ===
    setStepText('Extrayendo Contrataciones SEACE...');

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);
      await fetch('/api/contrataciones/seace?modo=all', {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);
    } catch {
      // fallback
    }

    if (isCancelledRef.current) return;
    setProgress(85);

    // === PASO 3: INVIERTE.PE OBRAS ===
    setStepText('Verificando Banco de Inversiones (Invierte.pe)...');

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);
      await fetch('/api/obras/invierte', {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);
    } catch {
      // fallback
    }

    if (isCancelledRef.current) return;
    setProgress(100);
    setStepText('¡Información actualizada con éxito!');
    setIsFinished(true);

    // Transición suave de salida tras completar
    setTimeout(() => {
      if (!isCancelledRef.current) {
        handleDismiss();
      }
    }, 800);
  }, [handleDismiss]);

  useEffect(() => {
    runSyncPipeline();

    const handleReopen = () => {
      runSyncPipeline();
    };

    window.addEventListener('open-carhuamayo-splash', handleReopen);
    return () => {
      isCancelledRef.current = true;
      window.removeEventListener('open-carhuamayo-splash', handleReopen);
    };
  }, [runSyncPipeline]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] w-screen h-screen select-none overflow-hidden transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* La imagen completa a pantalla completa sin ningún otro fondo */}
      <Image
        src="/images/portada_carhuamayo.jpg"
        alt="Portada Municipalidad Distrital de Carhuamayo"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Únicamente la barra de carga flotante en la parte inferior */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4 sm:px-6 space-y-2">
        {/* Fila con estado y porcentaje */}
        <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          <span className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15">
            {!isFinished && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
            {isFinished ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {stepText}
              </span>
            ) : (
              <span>{stepText}</span>
            )}
          </span>
          <span className="font-mono font-bold text-emerald-400 text-sm bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
            {progress}%
          </span>
        </div>

        {/* Barra de progreso con resplandor */}
        <div className="w-full h-3 sm:h-3.5 bg-black/70 backdrop-blur-md rounded-full overflow-hidden border border-white/30 p-0.5 shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.9)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Subtítulo discreto con opción de omitir */}
        <div className="flex justify-between items-center text-[11px] text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] px-1">
          <span className="bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded text-slate-200 border border-white/10">
            Municipalidad Distrital de Carhuamayo · Junín
          </span>
          <button
            onClick={handleDismiss}
            className="bg-black/50 backdrop-blur-md px-3 py-0.5 rounded text-slate-200 hover:text-white transition underline cursor-pointer flex items-center gap-1 border border-white/10"
          >
            <span>{isFinished ? 'Ingresar' : 'Omitir'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
