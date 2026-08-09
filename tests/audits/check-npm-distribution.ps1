$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "../..")

$package = Get-Content -Raw (Join-Path $Root "package.json") | ConvertFrom-Json
$distribution = Get-Content -Raw (Join-Path $Root "distribution/manifest.json") | ConvertFrom-Json
$plugin = Get-Content -Raw (Join-Path $Root "plugin/.codex-plugin/plugin.json") | ConvertFrom-Json

if ($distribution.schema -ne "praxis-distribution/v1") { throw "Unexpected distribution schema" }
if ($package.name -ne $distribution.packageName) { throw "Package name differs from distribution manifest" }
if ($package.version -ne $distribution.version) { throw "Package version differs from distribution manifest" }
if ($plugin.version -ne $distribution.version) { throw "Plugin version differs from distribution manifest" }
if ($package.dependencies) { throw "Runtime dependencies are not allowed" }
if (-not $distribution.agents -or $distribution.agents.Count -lt 1) { throw "Distribution manifest missing agents" }
if (-not ($distribution.agents | Where-Object { $_.id -eq "codex" })) { throw "Distribution agents must include codex" }
if (-not ($distribution.agents | Where-Object { $_.id -eq "claude-code" })) { throw "Distribution agents must include claude-code" }
if (-not $distribution.slashCommands) { throw "Distribution manifest missing slashCommands" }
foreach ($command in $distribution.slashCommands) {
  if ($distribution.skills -notcontains $command.skill) {
    throw "Slash command $($command.name) references unknown skill $($command.skill)"
  }
  if ($command.name -notlike 'praxis-*') {
    throw "Slash command must be Praxis-prefixed: $($command.name)"
  }
}
if (-not $distribution.legacySlashCommands) {
  throw "Distribution manifest missing legacySlashCommands for unprefixed cleanup"
}

$lifecycleNames = @("preinstall", "install", "postinstall", "prepublish", "prepublishOnly", "prepare")
foreach ($name in $lifecycleNames) {
  if ($package.scripts.PSObject.Properties.Name -contains $name) {
    throw "Lifecycle script is not allowed: $name"
  }
}

$sourceNames = @(Get-ChildItem -Directory (Join-Path $Root $distribution.sourceSkills) | ForEach-Object Name | Sort-Object)
$pluginNames = @(Get-ChildItem -Directory (Join-Path $Root $distribution.payload) | ForEach-Object Name | Sort-Object)
$manifestNames = @($distribution.skills | Sort-Object)
if (Compare-Object $manifestNames $sourceNames) { throw "Distribution skills differ from .agents/skills" }
if (Compare-Object $manifestNames $pluginNames) { throw "Distribution skills differ from plugin/skills" }

foreach ($name in $manifestNames) {
  if ($name -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') { throw "Unsafe manifest skill name: $name" }
  if (-not (Test-Path (Join-Path $Root "$($distribution.payload)/$name/SKILL.md"))) {
    throw "Plugin payload is missing $name/SKILL.md"
  }
}

$requiredFiles = @("bin/", "lib/", "distribution/", "plugin/skills/", "plugin/.codex-plugin/plugin.json", "README.md", "CHANGELOG.md", "LICENSE")
if (Compare-Object @($requiredFiles | Sort-Object) @($package.files | Sort-Object)) {
  throw "package.json files allowlist differs from the release contract"
}

$installPowerShell = Get-Content -Raw (Join-Path $Root "install.ps1")
$installBash = Get-Content -Raw (Join-Path $Root "install.sh")
if ($installPowerShell -notmatch "distribution[/\\]manifest.json") { throw "install.ps1 does not consume the distribution manifest" }
if ($installBash -notmatch "distribution/manifest.json") { throw "install.sh does not validate the distribution manifest" }

$publishWorkflowPath = Join-Path $Root ".github/workflows/publish-npm.yml"
if (-not (Test-Path $publishWorkflowPath)) { throw "Missing npm publish workflow" }
$publishWorkflow = Get-Content -Raw $publishWorkflowPath
if ($publishWorkflow -notmatch "id-token:\s*write") { throw "npm publish workflow lacks OIDC permission" }
if ($publishWorkflow -notmatch "npm publish.+--provenance") { throw "npm publish workflow lacks provenance" }
if ($publishWorkflow -match "NODE_AUTH_TOKEN|NPM_TOKEN") { throw "npm publish workflow must not use a long-lived npm token" }

Write-Host "npm distribution contract passed ($($manifestNames.Count) skills, version $($package.version))"
