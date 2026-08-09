$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path
$ruleRelativePath = "references/rules/frontend-skill-routing.md"
$rootRule = Join-Path $root $ruleRelativePath
$catalogPath = Join-Path $root "distribution/taste-skill.json"
$workflowSkills = @(
  "praxis-feature-flow",
  "praxis-design",
  "praxis-plan",
  "praxis-implement"
)
$surfaces = @(
  ".agents/skills",
  "plugin/skills"
)

if (-not (Test-Path -LiteralPath $rootRule)) {
  throw "Missing frontend skill routing rule: $rootRule"
}
if (-not (Test-Path -LiteralPath $catalogPath)) {
  throw "Missing Taste Skill pin catalog: $catalogPath"
}

$catalog = Get-Content -Raw -LiteralPath $catalogPath | ConvertFrom-Json
if ($catalog.schema -ne "praxis-taste-skill/v1") {
  throw "Taste Skill catalog schema must be praxis-taste-skill/v1"
}
if (-not $catalog.revision) {
  throw "Taste Skill catalog must pin a revision"
}
if ($catalog.defaultPrimaryInstallName -ne "design-taste-frontend") {
  throw "Default primary install name must be design-taste-frontend (v2 experimental)"
}
if ($catalog.channel -ne "v2-experimental") {
  throw "Pinned channel must be v2-experimental for the default family"
}

$requiredInstallNames = @(
  "design-taste-frontend",
  "design-taste-frontend-v1",
  "gpt-taste",
  "image-to-code",
  "redesign-existing-projects",
  "high-end-visual-design",
  "minimalist-ui",
  "industrial-brutalist-ui",
  "full-output-enforcement",
  "stitch-design-taste",
  "imagegen-frontend-web",
  "imagegen-frontend-mobile",
  "brandkit"
)
$catalogNames = @($catalog.skills | ForEach-Object { $_.installName })
foreach ($name in $requiredInstallNames) {
  if ($catalogNames -notcontains $name) {
    throw "Taste Skill catalog missing install name: $name"
  }
}

$ruleContent = Get-Content -Raw -LiteralPath $rootRule
foreach ($requiredText in @(
  "exactly one primary visual skill",
  "repository instructions",
  "design-taste-frontend",
  "v2-experimental",
  "Missing Taste Skill never blocks work",
  "Present Taste Skill must be used",
  "offer install proactively",
  "high-end-visual-design",
  "stitch-design-taste",
  "Out of Taste Skill scope",
  "--with-taste-skill"
)) {
  if ($ruleContent -notmatch [regex]::Escape($requiredText)) {
    throw "Frontend routing rule is missing required policy text: $requiredText"
  }
}

# Removed legacy invent-required skill
if ($ruleContent -match [regex]::Escape("frontend-app-builder")) {
  throw "Frontend routing rule must not require frontend-app-builder"
}

foreach ($surface in $surfaces) {
  foreach ($skill in $workflowSkills) {
    $skillRoot = Join-Path $root "$surface/$skill"
    $skillFile = Join-Path $skillRoot "SKILL.md"
    $embeddedRule = Join-Path $skillRoot $ruleRelativePath

    if (-not (Test-Path -LiteralPath $skillFile)) {
      throw "Missing workflow skill: $skillFile"
    }
    if (-not (Test-Path -LiteralPath $embeddedRule)) {
      throw "Missing embedded frontend routing rule: $embeddedRule"
    }
    if ((Get-Content -Raw -LiteralPath $skillFile) -notmatch "frontend-skill-routing\.md") {
      throw "Workflow skill does not load frontend routing: $skillFile"
    }
    if ((Get-Content -Raw -LiteralPath $embeddedRule) -ne $ruleContent) {
      throw "Embedded frontend routing rule differs from root rule: $embeddedRule"
    }
  }
}

$scenarioFiles = @(
  "references/scenarios/delivery/feature-development.md",
  ".agents/skills/praxis-feature-flow/references/scenarios/delivery/feature-development.md",
  "plugin/skills/praxis-feature-flow/references/scenarios/delivery/feature-development.md"
)
foreach ($scenario in $scenarioFiles) {
  $path = Join-Path $root $scenario
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing feature scenario: $path"
  }
  $scenarioText = Get-Content -Raw -LiteralPath $path
  if ($scenarioText -notmatch "Frontend Skill Gate") {
    throw "Feature scenario is missing Frontend Skill Gate: $path"
  }
  if ($scenarioText -notmatch "must not block") {
    throw "Feature scenario must state missing Taste Skill must not block: $path"
  }
}

Write-Host "Frontend skill routing audit passed"
