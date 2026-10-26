import { NextResponse } from 'next/server';
import { OBRAS_CARHUAMAYO } from '@/data/carhuamayoObras';

export async function GET() {
  return NextResponse.json({
    success: true,
    totalObras: OBRAS_CARHUAMAYO.length,
    inversionTotal: OBRAS_CARHUAMAYO.reduce((sum, o) => sum + o.costoActualizado, 0),
    devengadoTotal: OBRAS_CARHUAMAYO.reduce((sum, o) => sum + o.devengadoAcumulado, 0),
    data: OBRAS_CARHUAMAYO,
  });
}
