# Stops anything listening on TCP 5555, then starts Prisma Studio on that port only.
$ErrorActionPreference = 'SilentlyContinue'
$port = 5555

$pids = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $pids) {
  if ($processId -and $processId -ne 0 -and $processId -ne 4) {
    Stop-Process -Id $processId -Force
  }
}

$serverRoot = Split-Path -Parent $PSScriptRoot
Set-Location $serverRoot
npx prisma studio --port $port
