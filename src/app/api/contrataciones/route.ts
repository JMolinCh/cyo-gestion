import { NextRequest, NextResponse } from 'next/server';
import { CONTRATACIONES_CARHUAMAYO } from '@/data/carhuamayoContrataciones';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tipo = searchParams.get('tipo');
  const menor8uit = searchParams.get('menor8uit');
  const query = searchParams.get('q');

  const soloOrdenes = searchParams.get('soloOrdenes');

  let results = [...CONTRATACIONES_CARHUAMAYO];

  if (soloOrdenes === 'true') {
    results = results.filter((c) => c.tipo === 'Orden de Compra' || c.tipo === 'Orden de Servicio');
  }

  if (tipo && tipo !== 'todos') {
    results = results.filter((c) => c.tipo.toLowerCase().includes(tipo.toLowerCase()));
  }

  if (menor8uit === 'true') {
    results = results.filter((c) => c.menorA8UIT);
  }

  if (query) {
    const qLower = query.toLowerCase();
    results = results.filter(
      (c) =>
        c.numeroDocumento.toLowerCase().includes(qLower) ||
        c.proveedorNombre.toLowerCase().includes(qLower) ||
        c.proveedorRuc.includes(qLower) ||
        c.descripcion.toLowerCase().includes(qLower)
    );
  }

  return NextResponse.json({
    success: true,
    totalRegistros: results.length,
    montoTotal: results.reduce((acc, c) => acc + c.monto, 0),
    data: results,
  });
}
