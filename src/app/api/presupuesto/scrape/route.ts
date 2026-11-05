import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const ano = body.ano || 2026;

    const scriptPath = path.join(process.cwd(), 'scripts', 'mef_scraper.py');
    const jsonOutputPath = path.join(process.cwd(), 'scripts', 'carhuamayo_mef_live.json');

    // Ejecutar el scraper de Python con timeout de seguridad
    await new Promise<void>((resolve, reject) => {
      exec(`python "${scriptPath}" ${ano}`, { timeout: 12000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('Error ejecutando scraper:', error, stderr);
          // Si falla, intentamos devolver el último JSON disponible
          if (fs.existsSync(jsonOutputPath)) {
            resolve();
            return;
          }
          reject(error);
          return;
        }
        resolve();
      });
    });

    if (fs.existsSync(jsonOutputPath)) {
      const fileData = fs.readFileSync(jsonOutputPath, 'utf-8');
      const parsed = JSON.parse(fileData);

      const now = new Date();
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const fechaCorte = `${now.getDate()} de ${meses[now.getMonth()]} de ${now.getFullYear()}`;
      const horaStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
      const fechaTexto = `${fechaCorte} - ${horaStr}`;

      if (!parsed.fechaActualizacion) {
        parsed.fechaActualizacion = fechaTexto;
        parsed.fechaCorte = fechaCorte;
        parsed.ultimaActualizacion = `Sincronizado en vivo con MEF Consulta Amigable (${fechaTexto})`;
      }

      return NextResponse.json({
        success: true,
        fuente: 'MEF - Consulta Amigable (En Vivo)',
        fechaScraping: now.toISOString(),
        fechaTexto: parsed.fechaActualizacion,
        fechaCorte: parsed.fechaCorte || fechaCorte,
        data: parsed,
      });
    }

    return NextResponse.json(
      { success: false, error: 'No se generó el archivo de resultados' },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al ejecutar scraping' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // En GET devolvemos el último JSON scrapeado si existe
  const jsonOutputPath = path.join(process.cwd(), 'scripts', 'carhuamayo_mef_live.json');
  if (fs.existsSync(jsonOutputPath)) {
    const fileData = fs.readFileSync(jsonOutputPath, 'utf-8');
    const parsed = JSON.parse(fileData);

    const now = new Date();
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const fechaCorte = `${now.getDate()} de ${meses[now.getMonth()]} de ${now.getFullYear()}`;
    const horaStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
    const fechaTexto = `${fechaCorte} - ${horaStr}`;

    if (!parsed.fechaActualizacion) {
      parsed.fechaActualizacion = fechaTexto;
      parsed.fechaCorte = fechaCorte;
      parsed.ultimaActualizacion = `Sincronizado en vivo con MEF Consulta Amigable (${fechaTexto})`;
    }

    return NextResponse.json({
      success: true,
      fuente: 'MEF - Consulta Amigable (Caché reciente)',
      fechaTexto: parsed.fechaActualizacion,
      fechaCorte: parsed.fechaCorte || fechaCorte,
      data: parsed,
    });
  }

  return NextResponse.json(
    { success: false, error: 'No hay datos previos scrapeados' },
    { status: 404 }
  );
}
