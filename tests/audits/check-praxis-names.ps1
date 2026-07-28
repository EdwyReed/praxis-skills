$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path
$files = Get-ChildItem $Root -Recurse -File | Where-Object {
  $relative = [IO.Path]::GetRelativePath($Root, $_.FullName).Replace('\', '/')
  $relative -notmatch '^tmp/' -and
  $relative -notmatch '(^|/)__pycache__/' -and
  $relative -notmatch '^\.git/' -and
  $relative -notmatch '(^|/)install\.ps1$' -and
  $relative -notmatch '(^|/)uninstall\.ps1$' -and
  $relative -ne 'distribution/manifest.json' -and
  $relative -ne 'tests/audits/check-praxis-names.ps1'
}

$violations = @()
foreach ($file in $files) {
  $text = Get-Content -Raw $file.FullName -ErrorAction SilentlyContinue
  if ($null -eq $text) { continue }
  if ($text -match 'praxis-praxis-') { $violations += "$($file.FullName): double praxis prefix" }
  if ($text -match '(?<![/\\])codex-(feature-flow|refine|research|design|plan|implement|pr|docs-suite|sentry-triage|qa-checklist|system-profile|skill-from-git|ai-debug)') {
    $violations += "$($file.FullName): old codex workflow skill id"
  }
}

if ($violations.Count -gt 0) {
  throw "Praxis naming violations:`n$($violations -join "`n")"
}

Write-Host "check-praxis-names passed"
