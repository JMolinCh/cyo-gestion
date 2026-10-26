export interface PresupuestoRubro {
  id: string;
  rubro: string;
  codigoRubro: string;
  fuenteFinanciamiento: string;
  pia: number;
  pim: number;
  certificacion: number;
  compromisoAnual: number;
  devengado: number;
  girado: number;
  avancePorcentaje: number;
}

export interface PresupuestoIngresoRubro {
  id: string;
  rubro: string;
  codigoRubro: string;
  fuenteFinanciamiento: string;
  pia: number;
  pim: number;
  recaudado: number;
  saldoPorRecaudar: number;
  avancePorcentaje: number;
}

export interface PresupuestoGenerica {
  codigo: string;
  nombre: string;
  pia: number;
  pim: number;
  devengado: number;
  avancePorcentaje: number;
  categoria: 'Gasto Corriente' | 'Gasto de Capital' | 'Servicio de la Deuda';
}

export interface PresupuestoIngresoGenerica {
  codigo: string;
  nombre: string;
  pia: number;
  pim: number;
  recaudado: number;
  saldoPorRecaudar: number;
  avancePorcentaje: number;
  categoria: 'Ingresos Corrientes' | 'Ingresos de Capital' | 'Transferencias' | 'Financiamiento';
}

export interface PresupuestoMensual {
  mes: string;
  programado: number;
  ejecutado: number;
  acumulado: number;
}

export interface PresupuestoProyecto {
  codigo: string;
  nombre: string;
  esProyecto: boolean;
  cui?: string;
  enlaceSsi?: string;
  pia: number;
  pim: number;
  certificacion: number;
  compromisoAnual: number;
  atencionCompromisoMensual: number;
  devengado: number;
  girado: number;
  avancePorcentaje: number;
}

export interface Contratacion {
  id: string;
  numeroDocumento: string;
  numeroOrdenSeace?: string;
  tipo: 'Orden de Compra' | 'Orden de Servicio' | 'Adjudicación Simplificada' | 'Subasta Inversa' | 'Licitación Pública' | 'Contratación Directa' | 'Concurso Público' | 'Proceso de Selección';
  tipoContratacion?: string;
  fechaEmision: string;
  fechaCompromiso?: string;
  proveedorRuc: string;
  proveedorNombre: string;
  esProveedorLocal: boolean;
  descripcion: string;
  monto: number;
  moneda: 'PEN';
  estado: 'Pagado' | 'Devengado' | 'En Trámite' | 'Entregado' | 'Observado' | 'Comprometida' | 'Adjudicado';
  areaUsuaria: string;
  menorA8UIT: boolean;
  expedienteSiaf?: string;
  enlaceSeace?: string;
}

export interface ObraPublica {
  id: string;
  cui: string; // Código Único de Inversiones (Invierte.pe)
  nombre: string;
  sector: string; // Barrio Huando, Capillapata, Centro, Tambo del Sol, etc.
  coordenadas: {
    lat: number;
    lng: number;
  };
  montoViabilidad: number;
  costoActualizado: number;
  devengadoAcumulado: number;
  avanceFisico: number; // Porcentaje 0-100
  avanceFinanciero: number; // Porcentaje 0-100
  estado: 'En Plazo' | 'Con Retraso' | 'Paralizada' | 'Culminada';
  contratista: string;
  supervisor: string;
  fechaInicio: string;
  fechaFinPrevista: string;
  beneficiariosAprox: number;
  fotoUrl?: string;
}

export interface ObraInfobrasMapa {
  codigo: number;
  cui: string;
  nombre: string;
  estado: 'EN EJECUCIÓN' | 'FINALIZADAS' | 'PARALIZADAS' | 'SIN EJECUCIÓN';
  estadoRaw: string;
  color: string;
  lat: number;
  lng: number;
  sector: string;
  monto: number;
  avance: number;
  enlaceInfobras: string;
  enlaceSsi?: string | null;
}

export interface ProyectoInvierte {
  numero: number;
  cui: string;
  codigoSnip?: string;
  codigoIdea?: string;
  nombre: string;
  montoViable: number;
  costoActualizado: number;
  funcion: string;
  programa: string;
  subprograma?: string;
  situacion: string; // 'VIABLE' | 'APROBADO'
  estado: 'ACTIVO' | 'CERRADO' | string;
  nivelGobierno: string;
  sector: string;
  entidad: string;
  opmi?: string;
  uei?: string;
  uf?: string;
  responsableOpmi?: string;
  responsableUei?: string;
  responsableUf?: string;
  ejecutora?: string;
  fechaRegistro?: string;
  ultimoEstudio?: string;
  fechaViabilidad?: string;
  descripcionAlternativa?: string;
  beneficiarios?: number;
  piaVigente?: number;
  pimVigente?: number;
  devengadoVigente?: number;
  devengadoAcumulado?: number;
  tipoFormato?: string;
  avanceFisico?: number;
  avanceInversion?: number;
  situacionInversion?: string;
  problemasRestricciones?: string;
  proximosPasos?: string;
  saldoPorFinanciar?: number;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  enlaceInvierte?: string;
  enlaceSsi?: string;
}

export interface ExpedienteTramite {
  id: string;
  numeroExpediente: string;
  fechaIngreso: string;
  asunto: string;
  tipoTramite: string;
  canal: 'Mesa de Partes Digital' | 'Presencial';
  areaResponsable: string;
  estado: 'Atendido' | 'En Calificación' | 'En Trámite' | 'Observado';
  diasTranscurridos: number;
  plazoLegalDias: number;
}

export interface IndicadorModernizacion {
  titulo: string;
  valor: string | number;
  meta: string | number;
  porcentaje: number;
  estado: 'Excelente' | 'En Meta' | 'Atención' | 'Crítico';
  descripcion: string;
}
