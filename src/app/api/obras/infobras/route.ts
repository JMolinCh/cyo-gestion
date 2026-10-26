import { NextResponse } from 'next/server';
import { OBRAS_INFOBRAS_CARHUAMAYO } from '@/data/carhuamayoInfobrasMapa';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const estado = searchParams.get('estado') || 'TODOS';
    const codigo = searchParams.get('codigo') || '';

    let filtered = [...OBRAS_INFOBRAS_CARHUAMAYO];

    if (q) {
      filtered = filtered.filter(
        (o) =>
          o.nombre.toLowerCase().includes(q) ||
          o.cui.includes(q) ||
          o.sector.toLowerCase().includes(q) ||
          o.codigo.toString().includes(q)
      );
    }

    if (codigo) {
      filtered = filtered.filter((o) => o.codigo.toString().includes(codigo));
    }

    if (estado !== 'TODOS') {
      filtered = filtered.filter((o) => o.estado.toUpperCase() === estado.toUpperCase());
    }

    const conteo = {
      total: OBRAS_INFOBRAS_CARHUAMAYO.length,
      finalizadas: OBRAS_INFOBRAS_CARHUAMAYO.filter((o) => o.estado === 'FINALIZADAS').length,
      enEjecucion: OBRAS_INFOBRAS_CARHUAMAYO.filter((o) => o.estado === 'EN EJECUCIÓN').length,
      sinEjecucion: OBRAS_INFOBRAS_CARHUAMAYO.filter((o) => o.estado === 'SIN EJECUCIÓN').length,
      paralizadas: OBRAS_INFOBRAS_CARHUAMAYO.filter((o) => o.estado === 'PARALIZADAS').length,
    };

    return NextResponse.json({
      success: true,
      entidad: 'MUNICIPALIDAD DISTRITAL DE CARHUAMAYO',
      fuente: 'Sistema INFOBRAS — Contraloría General de la República del Perú',
      urlOficial: 'https://infobras.contraloria.gob.pe/InfobrasWeb/Mapa/Index#',
      resumen: conteo,
      totalResultados: filtered.length,
      data: filtered,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al procesar consulta de Infobras',
      },
      { status: 500 }
    );
  }
}
