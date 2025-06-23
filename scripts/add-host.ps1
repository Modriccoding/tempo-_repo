# Ajouter l'entrée tempo.local temporairement
$hostEntry = "127.0.0.1 tempo.local"
$null = New-NetIPAddress -InterfaceAlias "Loopback Pseudo-Interface 1" -IPAddress 127.0.0.1 -PrefixLength 8 -ErrorAction SilentlyContinue
Add-Content -Path $env:windir\System32\drivers\etc\hosts -Value "`n$hostEntry" -ErrorAction SilentlyContinue

Write-Host "Tentative d'ajout de l'entrée host pour tempo.local..."
Write-Host "Si vous voyez des erreurs, lancez PowerShell en tant qu'administrateur et réessayez."

# Afficher le contenu actuel du fichier hosts
Get-Content $env:windir\System32\drivers\etc\hosts 