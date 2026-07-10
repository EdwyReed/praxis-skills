$ErrorActionPreference = "Stop"
$Repo = $false
$User = $false
$Plugin = $false
$DryRun = $false
$Force = $false

foreach ($arg in $args) {
  switch ($arg) {
    { $_ -in @("--repo", "-Repo") } { $Repo = $true; continue }
    { $_ -in @("--user", "-User") } { $User = $true; continue }
    { $_ -in @("--plugin", "-Plugin") } { $Plugin = $true; continue }
    { $_ -in @("--dry-run", "-DryRun") } { $DryRun = $true; continue }
    { $_ -in @("--force", "-Force") } { $Force = $true; continue }
    default { throw "Unknown argument: $arg" }
  }
}

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillSource = Join-Path $Root ".agents/skills"
$PluginSource = Join-Path $Root "plugin"
$RepoMarketplace = Join-Path $Root ".agents/plugins/marketplace.json"
$UserSkillRoot = Join-Path $HOME ".agents/skills"
$LegacyPackageSkills = @(
  "adr-template", "api-contracts-template", "codex-ai-debug", "codex-design",
  "codex-docs-suite", "codex-feature-flow", "codex-implement", "codex-plan",
  "codex-pr", "codex-qa-checklist", "codex-refine", "codex-research",
  "codex-sentry-triage", "codex-skill-from-git", "codex-system-profile",
  "design-template", "owasp-top-10", "security-audit-checklist", "stoplight-docs",
  "task-refinement", "tdd-approach", "test-design-techniques"
)

if (-not $Repo -and -not $User -and -not $Plugin) {
  $Repo = $true
}

function Say($Message) { Write-Host $Message }
function EnsureDir($Path) {
  if ($DryRun) { Say "DRY mkdir $Path"; return }
  New-Item -ItemType Directory -Force -Path $Path | Out-Null
}
function CopyDirectory($Source, $Target) {
  if ($DryRun) { Say "DRY copy $Source -> $Target"; return }
  if ((Test-Path $Target) -and $Force) { Remove-Item -Recurse -Force -LiteralPath $Target }
  if (Test-Path $Target) { Say "SKIP existing $Target"; return }
  Copy-Item -Recurse -Force -Path $Source -Destination $Target
}

if ($Repo) {
  Say "Checking repo-local Codex skills at $SkillSource"
  if (-not (Test-Path $SkillSource)) { throw "Missing .agents/skills" }
}

if ($User) {
  EnsureDir $UserSkillRoot
  if ($Force) {
    foreach ($legacy in $LegacyPackageSkills) {
      $legacyPath = Join-Path $UserSkillRoot $legacy
      if (Test-Path $legacyPath) {
        if ($DryRun) { Say "DRY remove legacy $legacyPath" } else { Remove-Item -Recurse -Force -LiteralPath $legacyPath }
      }
    }
  }
  Get-ChildItem -Directory $SkillSource | ForEach-Object {
    CopyDirectory $_.FullName (Join-Path $UserSkillRoot $_.Name)
  }
}

if ($Plugin) {
  $manifest = Join-Path $PluginSource ".codex-plugin/plugin.json"
  if (-not (Test-Path $manifest)) { throw "Missing plugin manifest: $manifest" }
  EnsureDir (Split-Path -Parent $RepoMarketplace)
  $marketplace = [ordered]@{
    name = "praxis-skills-local"
    interface = @{ displayName = "Praxis Skills Local" }
    plugins = @(
      @{
        name = "praxis-skills"
        source = @{ source = "local"; path = "./plugin" }
        policy = @{ installation = "AVAILABLE"; authentication = "ON_INSTALL" }
        category = "Productivity"
      }
    )
  }
  if ($DryRun) {
    Say "DRY write marketplace $RepoMarketplace"
  } else {
    $marketplace | ConvertTo-Json -Depth 10 | Set-Content -Path $RepoMarketplace -Encoding UTF8
    Say "WROTE $RepoMarketplace"
  }
}

Say "Install step complete."
