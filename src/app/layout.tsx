import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashLoader from '@/components/SplashLoader';

export const metadata: Metadata = {
  title: 'Municipalidad Distrital de Carhuamayo | Portal de Gestión Pública y Datos en Tiempo Real',
  description:
    'Observatorio cívico y ciudadano de Carhuamayo (Junín): Consulta en vivo la ejecución presupuestal MEF, órdenes y licitaciones SEACE, cartera de 45 obras públicas Invierte.pe y normas legales.',
  keywords: [
    'Carhuamayo',
    'Municipalidad Distrital de Carhuamayo',
    'Junín',
    'Presupuesto MEF Carhuamayo',
    'SIAF Carhuamayo',
    'SEACE Carhuamayo',
    'Obras Públicas Carhuamayo',
    'Capital de la Maca',
    'Transparencia Junín',
    'Jhann Chavez Molina',
  ],
  authors: [{ name: 'Jhann W. Chavez Molina' }],
  creator: 'Jhann W. Chavez Molina',
  openGraph: {
    title: 'Municipalidad Distrital de Carhuamayo | Portal de Gestión Pública',
    description:
      'Monitoreo cívico en tiempo real: Presupuesto MEF, Licitaciones SEACE, 45 Obras Públicas Invierte.pe y Normas Oficiales.',
    type: 'website',
    locale: 'es_PE',
    images: [
      {
        url: '/images/portada_carhuamayo.jpg',
        width: 1024,
        height: 571,
        alt: 'Bienvenidos a Carhuamayo - Portal de Gestión Pública',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Municipalidad Distrital de Carhuamayo | Portal de Gestión Pública',
    description:
      'Monitoreo cívico en tiempo real: Presupuesto MEF, Licitaciones SEACE, 45 Obras Públicas Invierte.pe.',
    images: ['/images/portada_carhuamayo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
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
