import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashLoader from '@/components/SplashLoader';

export const metadata: Metadata = {
  title: 'MDC Carhuamayo | Portal de Gestión Pública en Tiempo Real',
  description:
    'Portal de inteligencia pública, ejecución presupuestal MEF, contrataciones SEACE, obras públicas y modernización de la Municipalidad Distrital de Carhuamayo - Junín, Perú.',
  keywords: [
    'Carhuamayo',
    'Municipalidad de Carhuamayo',
    'Junín',
    'Presupuesto MEF',
    'SIAF',
    'SEACE',
    'Obras Públicas',
    'Maca',
    'Transparencia Perú',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-muni-500 selection:text-white">
        <SplashLoader />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
