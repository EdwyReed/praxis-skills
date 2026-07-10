$ErrorActionPreference = "Stop"
$User = $false
$Plugin = $false
$DryRun = $false

foreach ($arg in $args) {
  switch ($arg) {
    { $_ -in @("--user", "-User") } { $User = $true; continue }
    { $_ -in @("--plugin", "-Plugin") } { $Plugin = $true; continue }
    { $_ -in @("--dry-run", "-DryRun") } { $DryRun = $true; continue }
    default { throw "Unknown argument: $arg" }
  }
}

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillSource = Join-Path $Root ".agents/skills"
$UserSkillRoot = Join-Path $HOME ".agents/skills"
$RepoMarketplace = Join-Path $Root ".agents/plugins/marketplace.json"
$LegacyPackageSkills = @(
  "adr-template", "api-contracts-template", "codex-ai-debug", "codex-design",
  "codex-docs-suite", "codex-feature-flow", "codex-implement", "codex-plan",
  "codex-pr", "codex-qa-checklist", "codex-refine", "codex-research",
  "codex-sentry-triage", "codex-skill-from-git", "codex-system-profile",
  "design-template", "owasp-top-10", "security-audit-checklist", "stoplight-docs",
  "task-refinement", "tdd-approach", "test-design-techniques"
)

function RemoveSafe($Path) {
  if (-not (Test-Path $Path)) { return }
  if ($DryRun) { Write-Host "DRY remove $Path"; return }
  Remove-Item -Recurse -Force -LiteralPath $Path
  Write-Host "REMOVED $Path"
}

if (-not $User -and -not $Plugin) {
  $User = $true
  $Plugin = $true
}

if ($User) {
  Get-ChildItem -Directory $SkillSource | ForEach-Object {
    RemoveSafe (Join-Path $UserSkillRoot $_.Name)
  }
  foreach ($legacy in $LegacyPackageSkills) {
    RemoveSafe (Join-Path $UserSkillRoot $legacy)
  }
}

if ($Plugin) {
  RemoveSafe $RepoMarketplace
}

Write-Host "Uninstall step complete."
