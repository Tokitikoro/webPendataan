@echo off

cd /d "C:\Users\THINKPAD_X230\Downloads\webPendataan-main"

timeout /t 30 /nobreak >nul

node scripts\sync-online-to-local.mjs >> database-backups\task-scheduler.log 2>&1
