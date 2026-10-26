import { NextResponse } from 'next/server';
import { 
  PRESUPUESTO_GENERAL_INFO, 
  RUBROS_PRESUPUESTO, 
  GENERICAS_GASTO, 
  EJECUCION_MENSUAL_2026 
} from '@/data/carhuamayoPresupuesto';

export async function GET() {
  return NextResponse.json({
    success: true,
    entidad: PRESUPUESTO_GENERAL_INFO.entidad,
    ubigeo: PRESUPUESTO_GENERAL_INFO.ubigeo,
    anoFiscal: PRESUPUESTO_GENERAL_INFO.ano,
    resumen: {
      pia: PRESUPUESTO_GENERAL_INFO.piaTotal,
      pim: PRESUPUESTO_GENERAL_INFO.pimTotal,
      certificacion: PRESUPUESTO_GENERAL_INFO.certificacionTotal,
      compromiso: PRESUPUESTO_GENERAL_INFO.compromisoTotal,
      devengado: PRESUPUESTO_GENERAL_INFO.devengadoTotal,
      girado: PRESUPUESTO_GENERAL_INFO.giradoTotal,
      porcentajeEjecucion: PRESUPUESTO_GENERAL_INFO.porcentajeEjecucion,
      gastoCorrientePim: PRESUPUESTO_GENERAL_INFO.gastoCorrientePim,
      gastoCapitalPim: PRESUPUESTO_GENERAL_INFO.gastoCapitalPim,
      ultimaActualizacion: PRESUPUESTO_GENERAL_INFO.ultimaActualizacion,
    },
    rubros: RUBROS_PRESUPUESTO,
    genericas: GENERICAS_GASTO,
    evolucionMensual: EJECUCION_MENSUAL_2026,
  });
}
