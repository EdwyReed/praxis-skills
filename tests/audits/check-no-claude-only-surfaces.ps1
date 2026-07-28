$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path
$patterns = @('~/.claude', '\.claude/skills', 'CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS', 'TeamCreate', 'TeamDelete', 'SendMessage')
$allowed = @(
  '^tmp/',
  '^references/source-docs/',
  '(^|/)references/agents/',
  '(^|/)references/scenarios/',
  '(^|/)references/templates/',
  '^docs/how/migrate-from-claude-code\.md$',
  '^docs/comparisons/claude-code-vs-codex-surfaces\.md$',
  '^docs/porting/coverage-matrix\.md$',
  '^docs/porting/source-inventory\.md$',
  '^docs/porting/codex-architecture\.md$',
  '^docs/porting/tool-dependencies\.md$',
  '^tests/audits/check-no-claude-only-surfaces\.ps1$',
  '^verify-install\.ps1$'
)

$violations = @()
foreach ($file in Get-ChildItem $Root -Recurse -File | Where-Object {
  $relative = [IO.Path]::GetRelativePath($Root, $_.FullName).Replace('\', '/')
  $relative -notmatch '^\.git/' -and $relative -notmatch '(^|/)__pycache__/'
}) {
  $relative = [IO.Path]::GetRelativePath($Root, $file.FullName).Replace('\', '/')
  $isAllowed = $false
  foreach ($a in $allowed) { if ($relative -match $a) { $isAllowed = $true; break } }
  if ($isAllowed) { continue }
  $text = Get-Content -Raw $file.FullName -ErrorAction SilentlyContinue
  foreach ($p in $patterns) {
    if ($text -match $p) { $violations += "$($file.FullName): $p" }
  }
}

if ($violations.Count -gt 0) { throw "Claude-only active surface references found:`n$($violations -join "`n")" }
Write-Host "check-no-claude-only-surfaces passed"
