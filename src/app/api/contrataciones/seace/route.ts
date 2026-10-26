import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const anio = body.anio || '2026';
    const mes = body.mes || '10';
    const modo = body.modo || 'all';

    const scriptPath = path.join(process.cwd(), 'scripts', 'seace_scraper.py');
    const jsonOutputPath = path.join(process.cwd(), 'scripts', 'carhuamayo_seace_live.json');

    // Ejecutar el scraper de SEACE (soporta modo 'all', 'procesos', 'ordenes')
    await new Promise<void>((resolve, reject) => {
      exec(`python "${scriptPath}" "${anio}" "${mes}" "${modo}"`, { timeout: 12000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('Error ejecutando scraper SEACE:', error, stderr);
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
      return NextResponse.json({
        success: true,
        fuente: 'SEACE - OSCE Plataforma ONGEI',
        anio,
        mes,
        data: parsed,
      });
    }

    return NextResponse.json(
      { success: false, error: 'No se generó el archivo de resultados de SEACE' },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al conectar con SEACE' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const anio = searchParams.get('anio') || '2026';
  const mes = searchParams.get('mes') || '10';
  const modo = searchParams.get('modo') || 'all';

  const scriptPath = path.join(process.cwd(), 'scripts', 'seace_scraper.py');
  const jsonOutputPath = path.join(process.cwd(), 'scripts', 'carhuamayo_seace_live.json');

  try {
    await new Promise<void>((resolve) => {
      exec(`python "${scriptPath}" "${anio}" "${mes}" "${modo}"`, () => resolve());
    });

    if (fs.existsSync(jsonOutputPath)) {
      const fileData = fs.readFileSync(jsonOutputPath, 'utf-8');
      const parsed = JSON.parse(fileData);
      return NextResponse.json({
        success: true,
        fuente: 'SEACE - OSCE Plataforma ONGEI',
        anio,
        mes,
        data: parsed,
      });
    }
  } catch (e) {
    // fallback
  }

  return NextResponse.json({ success: false, error: 'Error al consultar SEACE' }, { status: 500 });
}
