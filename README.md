# 🏛️ Portal de Datos Abiertos y Gestión Pública en Tiempo Real
### Municipalidad Distrital de Carhuamayo (Provincia de Junín, Región Junín, Perú)

Plataforma cívica e institucional desarrollada para el monitoreo en tiempo real, transparencia activa y rendición de cuentas de la gestión municipal de Carhuamayo (Ubigeo: 120502, Altitud: 4,125 m.s.n.m. — Capital Mundial de la Maca).

---

## 🚀 Módulos Implementados

1. **📊 Módulo de Presupuesto Público (MEF / SIAF / Consulta Amigable):**
   - Seguimiento del PIA (S/. 8.45M), PIM (S/. 14.82M), Certificación, Devengado (S/. 10.67M) y Girado.
   - Indicador de % de ejecución presupuestal en tiempo real.
   - Desglose por Gasto Corriente (84.0%) vs. Gasto de Capital / Inversiones (65.3%).
   - Análisis interactivo por Fuentes de Financiamiento (Canon, Foncomun, RO, RDR, Impuestos).
   - Gráfica de evolución mensual programado vs devengado.

2. **📦 Módulo de Abastecimiento y Contrataciones (SEACE / OSCE):**
   - Registro transparente de adquisiciones menores a 8/9 UIT (Órdenes de Compra y Órdenes de Servicio).
   - Licitaciones y Adjudicaciones Simplificadas publicadas en SEACE.
   - Buscador inteligente en vivo por N° de orden, RUC, proveedor, área solicitante y descripción.
   - Estadísticas de impulso al comercio local vs proveedores regionales.
   - Descarga directa de datos en CSV y JSON.

3. **🏗️ Módulo de Obras Públicas e Inversiones (Invierte.pe / Infobras):**
   - Mapa interactivo del distrito con geolocalización de obras (Barrio Huando, Tambo del Sol, Jr. Comercio, Capillapata, San Martín).
   - Ficha técnica completa por proyecto con Código Único de Inversiones (CUI).
   - Semáforo de alerta ciudadana: *En Plazo*, *Con Retraso*, *Culminada*.
   - Medición comparativa entre Avance Físico (%) vs Avance Financiero (%).

4. **🏛️ Módulo de Modernización de la Gestión y TUPA (PCM / SGP):**
   - Estado de digitalización de trámites según la Ley N° 27444.
   - Consulta ciudadana de expedientes ingresados por Mesa de Partes Virtual.
   - Catálogo TUPA interactivo con tasas y requisitos.
   - Indicadores de integridad y transparencia (PTE 96.8 / 100).

5. **📥 Centro de Datos Abiertos (Open Data):**
   - Descarga de datasets completos en formatos abiertos (CSV, JSON).
   - Diccionario de variables conforme a los estándares de la Plataforma Nacional de Datos Abiertos (`datosabiertos.gob.pe`).
   - Documentación de APIs REST públicas para consumo en Python, JavaScript o PowerBI.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Estilos & UI:** Tailwind CSS + Lucide Icons
- **Visualización de Datos:** Recharts (Gráficos interactivos de barras, líneas y donas)
- **APIs:** Endpoints REST nativos en `/api/presupuesto`, `/api/contrataciones`, `/api/obras`

---

## 💻 Instrucciones de Ejecución

### 1. Iniciar en Modo Desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 2. Compilar para Producción:
```bash
npm run build
npm run start
```

### 3. Endpoints de la API REST:
- `GET /api/presupuesto` - Retorna KPIs, desglose por rubro y ejecución mensual.
- `GET /api/contrataciones` - Retorna catálogo de compras y procesos (soporta filtros `?tipo=`, `?menor8uit=true`, `?q=termino`).
- `GET /api/obras` - Retorna las inversiones con coordenadas geográficas y CUI.

---

## 📜 Base Legal y Normativa
- **Ley N° 27806:** Ley de Transparencia y Acceso a la Información Pública.
- **Decreto Legislativo N° 1412:** Ley de Gobierno Digital y Datos Abiertos.
- **Decreto Supremo N° 054-2018-PCM:** Lineamientos de Organización del Estado y Modernización de la Gestión Pública.
- **Ley N° 30225:** Ley de Contrataciones del Estado (OSCE / SEACE).
