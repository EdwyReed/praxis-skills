$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "../..")
$manifestPath = Join-Path $Root "plugin/.codex-plugin/plugin.json"
if (-not (Test-Path $manifestPath)) { throw "Missing plugin manifest" }
$manifest = Get-Content -Raw $manifestPath | ConvertFrom-Json

foreach ($field in @("name", "version", "description", "skills", "interface")) {
  if (-not $manifest.$field) { throw "Plugin manifest missing $field" }
}
if (-not $manifest.author.name) { throw "Plugin manifest missing author.name" }
if ($manifest.PSObject.Properties.Name -contains "hooks") { throw "Plugin manifest uses unsupported hooks field" }
$skillsPath = Join-Path (Split-Path -Parent (Split-Path -Parent $manifestPath)) $manifest.skills
if (-not (Test-Path $skillsPath)) { throw "Plugin skills path missing: $skillsPath" }

Write-Host "check-plugin-manifest passed"
