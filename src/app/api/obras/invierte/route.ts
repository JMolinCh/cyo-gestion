import { NextResponse } from 'next/server';
import { PROYECTOS_INVIERTE_CARHUAMAYO } from '@/data/carhuamayoInvierte';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const estado = searchParams.get('estado') || 'TODOS';
    const funcion = searchParams.get('funcion') || 'TODOS';
    const situacion = searchParams.get('situacion') || 'TODOS';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let filtered = [...PROYECTOS_INVIERTE_CARHUAMAYO];

    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.cui.toLowerCase().includes(q) ||
          p.nombre.toLowerCase().includes(q) ||
          (p.codigoIdea && p.codigoIdea.toLowerCase().includes(q)) ||
          p.funcion.toLowerCase().includes(q) ||
          p.programa.toLowerCase().includes(q)
      );
    }

    if (estado !== 'TODOS') {
      filtered = filtered.filter((p) => p.estado.toUpperCase() === estado.toUpperCase());
    }

    if (situacion !== 'TODOS') {
      filtered = filtered.filter((p) => p.situacion.toUpperCase() === situacion.toUpperCase());
    }

    if (funcion !== 'TODOS') {
      filtered = filtered.filter((p) => p.funcion.toUpperCase() === funcion.toUpperCase());
    }

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Totales globales
    const totalMontoViable = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, p) => acc + (p.montoViable || 0), 0);
    const totalCostoActualizado = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, p) => acc + (p.costoActualizado || 0), 0);
    const totalDevengadoAcumulado = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, p) => acc + (p.devengadoAcumulado || 0), 0);
    const totalPimVigente = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, p) => acc + (p.pimVigente || 0), 0);
    const totalDevengadoVigente = PROYECTOS_INVIERTE_CARHUAMAYO.reduce((acc, p) => acc + (p.devengadoVigente || 0), 0);

    const totalActivos = PROYECTOS_INVIERTE_CARHUAMAYO.filter((p) => p.estado === 'ACTIVO').length;
    const totalCerrados = PROYECTOS_INVIERTE_CARHUAMAYO.filter((p) => p.estado === 'CERRADO').length;

    // Funciones únicas disponibles
    const funcionesDisponibles = Array.from(new Set(PROYECTOS_INVIERTE_CARHUAMAYO.map((p) => p.funcion).filter(Boolean))).sort();

    return NextResponse.json({
      success: true,
      entidad: 'MUNICIPALIDAD DISTRITAL DE CARHUAMAYO',
      fuente: 'Banco de Inversiones - Consulta Avanzada MEF (Invierte.pe)',
      urlOficial: 'https://ofi5.mef.gob.pe/inviertePub/ConsultaPublica/ConsultaAvanzada',
      fechaCorte: new Date().toISOString(),
      resumen: {
        totalProyectos: PROYECTOS_INVIERTE_CARHUAMAYO.length,
        totalActivos,
        totalCerrados,
        totalMontoViable,
        totalCostoActualizado,
        totalDevengadoAcumulado,
        totalPimVigente,
        totalDevengadoVigente,
        porcentajeEjecucionAcumulado: totalCostoActualizado > 0 ? (totalDevengadoAcumulado / totalCostoActualizado) * 100 : 0
      },
      funcionesDisponibles,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
        showingFrom: totalRecords === 0 ? 0 : startIndex + 1,
        showingTo: Math.min(startIndex + limit, totalRecords)
      },
      data: paginated
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error procesando consulta de Banco de Inversiones'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
