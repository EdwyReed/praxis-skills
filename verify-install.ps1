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

# Multi-agent installs may document ~/.claude, ~/.cursor, and ~/.grok paths.
# Guard only against hard-requiring Claude for the default Codex fallback scripts.
$codexFallback = @("install.ps1", "install.sh") | ForEach-Object { Join-Path $Root $_ }
foreach ($file in $codexFallback) {
  $text = Get-Content -Raw $file
  if ($text -match 'throw.*\.claude|Error:.*\.claude') {
    throw "Codex fallback installer hard-requires Claude home: $file"
  }
}

$cli = Join-Path $Root "bin/praxis-skills.mjs"
if (-not (Test-Path $cli)) { throw "Missing npm CLI: $cli" }
$manifest = Get-Content -Raw (Join-Path $Root "distribution/manifest.json") | ConvertFrom-Json
if (-not ($manifest.agents | Where-Object { $_.id -eq "claude-code" })) {
  throw "Distribution manifest missing claude-code agent"
}
if (-not $manifest.slashCommands -or $manifest.slashCommands.Count -lt 1) {
  throw "Distribution manifest missing slashCommands"
}

Write-Host "verify-install passed"
