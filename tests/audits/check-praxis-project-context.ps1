$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path
$skillName = "praxis-init"
$surfaces = @(".agents/skills", "plugin/skills")
$requiredFiles = @(
  "SKILL.md",
  "agents/openai.yaml",
  "references/project-schema.md",
  "references/skill-manifest-schema.md",
  "references/new-project-interview.md",
  "references/existing-project-audit.md",
  "assets/project-template.md",
  "assets/skills-template.yaml",
  "assets/agents-bootstrap.md",
  "scripts/validate_project.py"
)

foreach ($surface in $surfaces) {
  $skillRoot = Join-Path $root "$surface/$skillName"
  foreach ($relative in $requiredFiles) {
    $path = Join-Path $skillRoot $relative
    if (-not (Test-Path -LiteralPath $path)) {
      throw "Missing $skillName package file: $path"
    }
  }
}

$sourceRoot = Join-Path $root ".agents/skills/$skillName"
$pluginRoot = Join-Path $root "plugin/skills/$skillName"
$sourceFiles = Get-ChildItem -LiteralPath $sourceRoot -File -Recurse | Where-Object {
  $_.FullName -notmatch '\\__pycache__\\'
} | ForEach-Object {
  $_.FullName.Substring($sourceRoot.Length).TrimStart('\', '/')
} | Sort-Object
$pluginFiles = Get-ChildItem -LiteralPath $pluginRoot -File -Recurse | Where-Object {
  $_.FullName -notmatch '\\__pycache__\\'
} | ForEach-Object {
  $_.FullName.Substring($pluginRoot.Length).TrimStart('\', '/')
} | Sort-Object

if (($sourceFiles -join "`n") -ne ($pluginFiles -join "`n")) {
  throw "Source/plugin file lists differ for $skillName"
}
foreach ($relative in $sourceFiles) {
  $sourceHash = (Get-FileHash -LiteralPath (Join-Path $sourceRoot $relative) -Algorithm SHA256).Hash
  $pluginHash = (Get-FileHash -LiteralPath (Join-Path $pluginRoot $relative) -Algorithm SHA256).Hash
  if ($sourceHash -ne $pluginHash) {
    throw "Source/plugin content differs for $skillName/$relative"
  }
}

$skillText = Get-Content -Raw -LiteralPath (Join-Path $sourceRoot "SKILL.md")
foreach ($requiredText in @(
  ".praxis/project.md",
  ".praxis/skills.yaml",
  "needs-confirmation",
  "managed `AGENTS.md` bootstrap",
  "validate_project.py",
  "profile_sha256"
)) {
  if ($skillText -notmatch [regex]::Escape($requiredText)) {
    throw "praxis-init SKILL.md missing required text: $requiredText"
  }
}
if ($skillText -match "TODO") { throw "praxis-init SKILL.md contains TODO" }

$template = Get-Content -Raw -LiteralPath (Join-Path $sourceRoot "assets/project-template.md")
foreach ($requiredText in @(
  "schema: praxis-project/v1",
  "status: needs-confirmation",
  "clear_speech: default",
  "# Core Contract",
  "## Project Concept",
  "## Product Direction",
  "## Experience Direction",
  "## Communication Profile",
  "## Design Skill Routing",
  "## Reference Designs and Projects",
  "## Constraints and Non-Negotiables",
  "## Open Questions",
  "## Confirmation"
)) {
  if ($template -notmatch [regex]::Escape($requiredText)) {
    throw "Project template missing required text: $requiredText"
  }
}

$bootstrap = Get-Content -Raw -LiteralPath (Join-Path $sourceRoot "assets/agents-bootstrap.md")
foreach ($marker in @("<!-- praxis:project-context:start -->", "<!-- praxis:project-context:end -->", ".praxis/project.md", ".praxis/skills.yaml", "clear_speech", "default", "strict", "off", "Never install")) {
  if ($bootstrap -notmatch [regex]::Escape($marker)) {
    throw "AGENTS bootstrap missing marker: $marker"
  }
}

$projectSkills = @(
  "praxis-feature-flow",
  "praxis-refine",
  "praxis-research",
  "praxis-design",
  "praxis-plan",
  "praxis-implement",
  "praxis-pr",
  "praxis-docs-suite",
  "praxis-sentry-triage",
  "praxis-system-profile",
  "praxis-skill-from-git"
)
foreach ($skill in ($projectSkills + @("praxis-qa-checklist"))) {
  $sourceSkill = Join-Path $root ".agents/skills/$skill/SKILL.md"
  $pluginSkill = Join-Path $root "plugin/skills/$skill/SKILL.md"
  if ((Get-FileHash -LiteralPath $sourceSkill -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $pluginSkill -Algorithm SHA256).Hash) {
    throw "Source/plugin SKILL.md differs for $skill"
  }
}
foreach ($surface in $surfaces) {
  foreach ($skill in $projectSkills) {
    $path = Join-Path $root "$surface/$skill/SKILL.md"
    $text = Get-Content -Raw -LiteralPath $path
    foreach ($requiredText in @("Project Context Gate", ".praxis/project.md", ".praxis/skills.yaml", "praxis-init", "Never install")) {
      if ($text -notmatch [regex]::Escape($requiredText)) {
        throw "$path missing project gate text: $requiredText"
      }
    }
  }

  $qaPath = Join-Path $root "$surface/praxis-qa-checklist/SKILL.md"
  $qaText = Get-Content -Raw -LiteralPath $qaPath
  foreach ($requiredText in @("Project Context Gate", "repository-scoped", "standalone artifact", ".praxis/skills.yaml", "Never install")) {
    if ($qaText -notmatch [regex]::Escape($requiredText)) {
      throw "$qaPath missing conditional gate text: $requiredText"
    }
  }
}

$rootAgents = Get-Content -Raw -LiteralPath (Join-Path $root "AGENTS.md")
if ($rootAgents -notmatch [regex]::Escape("<!-- praxis:project-context:start -->")) {
  throw "Root AGENTS.md is missing the managed Praxis bootstrap"
}

$stateSchemaFiles = @(
  ".agents/skills/praxis-feature-flow/references/state-schema.md",
  "plugin/skills/praxis-feature-flow/references/state-schema.md"
)
foreach ($relative in $stateSchemaFiles) {
  $text = Get-Content -Raw -LiteralPath (Join-Path $root $relative)
  foreach ($stateField in @("project_context.profile_sha256", "project_context.skills_manifest_sha256")) {
    if ($text -notmatch [regex]::Escape($stateField)) {
      throw "$relative missing state field: $stateField"
    }
  }
}

$readme = Get-Content -Raw -LiteralPath (Join-Path $root "README.md")
if ($readme -notmatch [regex]::Escape('$praxis-init')) {
  throw "README.md does not document explicit `$praxis-init invocation"
}
if ($readme -notmatch [regex]::Escape('.praxis/skills.yaml')) {
  throw "README.md does not document the project skill dependency manifest"
}

$validator = Join-Path $sourceRoot "scripts/validate_project.py"
$validOutput = & python $validator $root
if ($LASTEXITCODE -ne 0) {
  throw "Praxis repository project profile failed validation: $validOutput"
}
$validResult = $validOutput | ConvertFrom-Json
if (-not $validResult.valid -or -not $validResult.profile_sha256) {
  throw "Valid profile result lacks valid=true or profile_sha256"
}
if ($validResult.clear_speech_mode -ne "default") {
  throw "Legacy profile without clear_speech must resolve to default"
}

$fixtureRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("praxis-project-audit-" + [guid]::NewGuid().ToString("N"))
try {
  New-Item -ItemType Directory -Force -Path (Join-Path $fixtureRoot ".praxis") | Out-Null
  Copy-Item -LiteralPath (Join-Path $root ".praxis/project.md") -Destination (Join-Path $fixtureRoot ".praxis/project.md")
  Copy-Item -LiteralPath (Join-Path $root "AGENTS.md") -Destination (Join-Path $fixtureRoot "AGENTS.md")

  $profilePath = Join-Path $fixtureRoot ".praxis/project.md"
  $baseProfile = Get-Content -Raw -LiteralPath $profilePath
  $offProfile = $baseProfile `
    -replace "(?m)^(visual_scope:\s*\S+\s*)$", "`$1`nclear_speech: off" `
    -replace "(?m)^## Design Skill Routing", "## Communication Profile`n`n| Field | Value |`n|---|---|`n| Praxis Clear Speech | off |`n`n## Design Skill Routing"
  Set-Content -LiteralPath $profilePath -Value $offProfile -Encoding UTF8
  $offOutput = & python $validator $fixtureRoot
  if ($LASTEXITCODE -ne 0) {
    throw "Validator rejected clear_speech off: $offOutput"
  }
  $offResult = $offOutput | ConvertFrom-Json
  if ($offResult.clear_speech_mode -ne "off") {
    throw "Validator did not return clear_speech_mode=off: $offOutput"
  }

  $invalidModeProfile = $offProfile -replace "clear_speech: off", "clear_speech: sometimes"
  Set-Content -LiteralPath $profilePath -Value $invalidModeProfile -Encoding UTF8
  $invalidModeOutput = & python $validator $fixtureRoot
  if ($LASTEXITCODE -eq 0) {
    throw "Validator accepted an invalid clear_speech mode: $invalidModeOutput"
  }
  if ((($invalidModeOutput | ConvertFrom-Json).errors -join "`n") -notmatch "invalid frontmatter field: clear_speech") {
    throw "Invalid clear_speech mode did not report the expected error: $invalidModeOutput"
  }
  Set-Content -LiteralPath $profilePath -Value $offProfile -Encoding UTF8

  $validManifest = Get-Content -Raw -LiteralPath (Join-Path $sourceRoot "assets/skills-template.yaml")
  Set-Content -LiteralPath (Join-Path $fixtureRoot ".praxis/skills.yaml") -Value $validManifest -Encoding UTF8
  $manifestOutput = & python $validator $fixtureRoot
  if ($LASTEXITCODE -ne 0) {
    throw "Validator rejected valid skill manifest: $manifestOutput"
  }
  $manifestResult = $manifestOutput | ConvertFrom-Json
  if (-not $manifestResult.skills_manifest_present -or -not $manifestResult.skills_manifest_sha256 -or $manifestResult.skills_package_count -ne 1) {
    throw "Valid skill manifest result lacks presence, hash, or package count: $manifestOutput"
  }

  function Assert-InvalidManifest([string]$Content, [string]$ExpectedError) {
    Set-Content -LiteralPath (Join-Path $fixtureRoot ".praxis/skills.yaml") -Value $Content -Encoding UTF8
    $output = & python $validator $fixtureRoot
    if ($LASTEXITCODE -eq 0) {
      throw "Validator accepted invalid skill manifest: $output"
    }
    $result = $output | ConvertFrom-Json
    if (($result.errors -join "`n") -notmatch [regex]::Escape($ExpectedError)) {
      throw "Invalid skill manifest did not report '$ExpectedError': $output"
    }
  }

  Assert-InvalidManifest ($validManifest -replace "requirement: required", "requirement: optional") "invalid requirement: optional"
  Assert-InvalidManifest ($validManifest -replace "revision: v1.0.0", "revision: main") "requires a pinned revision"

  $duplicateRoleManifest = $validManifest + @"

  - id: second-family
    requirement: recommended
    role: primary-project-responsibility
    source:
      type: website
      url: https://example.com/skills
    skills:
      - second-entrypoint
    rationale: Reproduces a secondary project behavior.
    applies_when: The secondary behavior is requested.
"@
  Assert-InvalidManifest $duplicateRoleManifest "duplicate role: primary-project-responsibility"

  $duplicateIdManifest = $duplicateRoleManifest -replace "id: second-family", "id: package-family" -replace "role: primary-project-responsibility(?=\r?\n    source:\r?\n      type: website)", "role: secondary-project-responsibility"
  Assert-InvalidManifest $duplicateIdManifest "duplicate package id: package-family"

  $overflowPackages = for ($i = 1; $i -le 6; $i++) {
@"
  - id: required-family-$i
    requirement: required
    role: project-role-$i
    source:
      type: git
      url: https://github.com/example/required-family-$i
      revision: v1.0.$i
    skills:
      - required-entrypoint-$i
    rationale: Required project capability $i.
    applies_when: Project capability $i is in scope.
"@
  }
  $overflowManifest = "schema: praxis-skills/v1`n`npackages:`n" + ($overflowPackages -join "`n")
  Assert-InvalidManifest $overflowManifest "exceeds the normal limit of 5"

  $justifiedOverflowManifest = $overflowManifest -replace "(applies_when: Project capability 6 is in scope\.)", "`$1`n    overflow_justification: This sixth responsibility cannot be represented by the first five packages."
  Set-Content -LiteralPath (Join-Path $fixtureRoot ".praxis/skills.yaml") -Value $justifiedOverflowManifest -Encoding UTF8
  $justifiedOutput = & python $validator $fixtureRoot
  if ($LASTEXITCODE -ne 0) {
    throw "Validator rejected justified required-package overflow: $justifiedOutput"
  }

  Remove-Item -LiteralPath (Join-Path $fixtureRoot ".praxis/skills.yaml")
  Add-Content -LiteralPath (Join-Path $fixtureRoot ".praxis/project.md") -Value ((" overflow" * 2600)) -Encoding UTF8
  $invalidOutput = & python $validator $fixtureRoot
  if ($LASTEXITCODE -eq 0) {
    throw "Validator accepted a project profile above 2500 words: $invalidOutput"
  }
  $invalidResult = $invalidOutput | ConvertFrom-Json
  if ($invalidResult.errors -notmatch "exceeds 2500 words") {
    throw "Oversized profile did not report the expected error: $invalidOutput"
  }
} finally {
  if (Test-Path -LiteralPath $fixtureRoot) {
    Remove-Item -LiteralPath $fixtureRoot -Recurse -Force
  }
}

Write-Host "Praxis project context audit passed"
