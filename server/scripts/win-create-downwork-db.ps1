# Creates database "downwork" on local PostgreSQL (Windows EDB install).
# Run from repo: cd server; npm run db:create-db
# Or: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/win-create-downwork-db.ps1

$ErrorActionPreference = 'Stop'

$psql = $null
foreach ($ver in @(18, 17, 16, 15,14)) {
  $candidate = "C:\Program Files\PostgreSQL\$ver\bin\psql.exe"
  if (Test-Path $candidate) {
    $psql = $candidate
    break
  }
}

if (-not $psql) {
  Write-Host "psql.exe not found under C:\Program Files\PostgreSQL\<version>\bin\. Install PostgreSQL for Windows, then open a new terminal and run this script again." -ForegroundColor Red
  exit 1
}

$port = if ($env:PGPORT) { $env:PGPORT } else { '5432' }
$password = Read-Host "Password for PostgreSQL user 'postgres' (set during installation)"
if ([string]::IsNullOrWhiteSpace($password)) {
  Write-Host "Password is required." -ForegroundColor Red
  exit 1
}

$env:PGPASSWORD = $password
try {
  $out = & $psql -h localhost -p $port -U postgres -d postgres -c "CREATE DATABASE downwork;" 2>&1
  $exit = $LASTEXITCODE
  $text = ($out | Out-String)
  if ($exit -ne 0 -and $text -notmatch 'already exists') {
    Write-Host $text -ForegroundColor Red
    exit $exit
  }
  Write-Host "Database 'downwork' is ready (or was already present)." -ForegroundColor Green
  Write-Host "Set DATABASE_URL in server/.env to postgresql://postgres:<YOUR_PASSWORD>@localhost:${port}/downwork then run: npm run setup"
} finally {
  Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
