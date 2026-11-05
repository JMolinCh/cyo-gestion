@echo off
cd /d "%~dp0\.."
echo ================================================================ >> scripts\registro_scraper.log
echo [%date% %time%] Iniciando sincronizacion diaria MEF y SEACE... >> scripts\registro_scraper.log
python scripts\run_scrapers.py >> scripts\registro_scraper.log 2>&1
git add scripts\*.json
git commit -m "chore(data): sincronizacion diaria MEF y SEACE (8:00 AM)" >> scripts\registro_scraper.log 2>&1
git push origin main >> scripts\registro_scraper.log 2>&1
echo [%date% %time%] Proceso finalizado y subido a GitHub / Vercel. >> scripts\registro_scraper.log
