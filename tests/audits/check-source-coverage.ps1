$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "../..")
$expectedPath = Join-Path $Root "tests/audits/expected-source-files.txt"
$matrixPath = Join-Path $Root "docs/porting/coverage-matrix.md"
if (-not (Test-Path $expectedPath)) { throw "Missing expected source file list" }
if (-not (Test-Path $matrixPath)) { throw "Missing coverage matrix" }

$matrix = Get-Content -Raw $matrixPath
$missing = @()
Get-Content $expectedPath | Where-Object { $_.Trim() } | ForEach-Object {
  if ($matrix -notlike "*$_*") { $missing += $_ }
}

if ($missing.Count -gt 0) {
  throw "Coverage matrix missing source files:`n$($missing -join "`n")"
}

Write-Host "check-source-coverage passed"
