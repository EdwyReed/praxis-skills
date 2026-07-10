$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

$requiredSkills = @(
  "praxis-init", "praxis-feature-flow", "praxis-refine", "praxis-research", "praxis-design", "praxis-plan",
  "praxis-implement", "praxis-pr", "praxis-docs-suite", "praxis-sentry-triage",
  "praxis-qa-checklist", "praxis-system-profile", "praxis-skill-from-git", "praxis-ai-debug"
)

foreach ($skill in $requiredSkills) {
  $path = Join-Path $Root ".agents/skills/$skill/SKILL.md"
  if (-not (Test-Path $path)) { throw "Missing required skill: $path" }
}

$manifestPath = Join-Path $Root "plugin/.codex-plugin/plugin.json"
if (-not (Test-Path $manifestPath)) { throw "Missing plugin manifest" }
$manifest = Get-Content -Raw $manifestPath | ConvertFrom-Json
if ($manifest.name -ne "praxis-skills") { throw "Unexpected plugin name: $($manifest.name)" }
if (-not $manifest.skills) { throw "Plugin manifest missing skills path" }

$activeFiles = @("install.ps1", "install.sh", "verify-install.ps1", "README.md", "docs/how/install.md") |
  ForEach-Object { Join-Path $Root $_ }
foreach ($file in $activeFiles) {
  $text = Get-Content -Raw $file
  $legacy = '~' + '/.claude'
  if ($text -match [regex]::Escape($legacy)) { throw "Active install surface references legacy Claude home: $file" }
}

Write-Host "verify-install passed"
