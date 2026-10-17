$ErrorActionPreference='Stop'
Set-Location "$env:USERPROFILE\Desktop\veil-receipt"
New-Item -ItemType Directory -Force -Path '.\data' | Out-Null
$keyFile='.\data\operator-key.txt'
if(!(Test-Path $keyFile)) { $bytes=New-Object byte[] 32; $rng=[System.Security.Cryptography.RandomNumberGenerator]::Create(); $rng.GetBytes($bytes); $rng.Dispose(); [IO.File]::WriteAllText((Join-Path (Get-Location).Path 'data\operator-key.txt'),[Convert]::ToBase64String($bytes)) }
$env:OPERATOR_SECRET=[IO.File]::ReadAllText((Join-Path (Get-Location).Path 'data\operator-key.txt'))
node server.mjs