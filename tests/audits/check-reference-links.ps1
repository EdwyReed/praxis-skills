$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "../..")
$mdFiles = Get-ChildItem $Root -Recurse -File -Filter "*.md" | Where-Object {
  $_.FullName -notmatch '\\tmp\\' -and
  $_.FullName -notmatch '\\plugin\\skills\\' -and
  $_.FullName -notmatch '\\references\\agents\\' -and
  $_.FullName -notmatch '\\references\\source-docs\\' -and
  (
    $_.FullName -match '\\docs\\' -or
    ($_.FullName -match '\\.agents\\skills\\praxis-' -and $_.FullName -notmatch '\\.agents\\skills\\praxis-(adr-template|api-contracts-template|design-template|owasp-top-10|security-audit-checklist|stoplight-docs|task-refinement|tdd-approach|test-design-techniques)\\') -or
    $_.Name -in @('README.md','AGENTS.md','ARCHITECTURE.md','CONTRIBUTING.md','CHANGELOG.md')
  )
}
$missing = @()

foreach ($file in $mdFiles) {
  $text = Get-Content -Raw $file.FullName
  $matches = [regex]::Matches($text, '\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)')
  foreach ($m in $matches) {
    $target = $m.Groups[1].Value.Split('#')[0].Trim()
    if (-not $target -or $target -match '^/codex/' -or $target -match '^\{') { continue }
    $candidate = Join-Path $file.DirectoryName $target
    if (-not (Test-Path $candidate)) { $missing += "$($file.FullName): $target" }
  }
}

if ($missing.Count -gt 0) { throw "Missing markdown links:`n$($missing -join "`n")" }
Write-Host "check-reference-links passed"
