@echo off
:: Demande les privilèges d'administrateur
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Demande des privilèges administrateur...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

:: Ajoute l'entrée dans le fichier hosts
echo.>> %windir%\System32\drivers\etc\hosts
echo 127.0.0.1 tempo.local>> %windir%\System32\drivers\etc\hosts

echo Entrée ajoutée avec succès !
echo Contenu actuel du fichier hosts :
type %windir%\System32\drivers\etc\hosts
pause 