# Script para registrar la tarea diaria a las 8:00 AM en Windows
$taskName = "CarhuamayoScraperDiario"
$batPath = "D:\SOFT\GESTION_CARHUAMAYO\scripts\ejecutar_diario_8am.bat"

$action = New-ScheduledTaskAction -Execute $batPath
$trigger = New-ScheduledTaskTrigger -Daily -At 8:00AM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Sincronizacion automatica diaria MEF y SEACE para Carhuamayo a las 8:00 AM" -Force

Write-Host "Tarea programada registrada exitosamente: $taskName a las 8:00 AM todos los dias." -ForegroundColor Green
