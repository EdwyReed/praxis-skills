$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path
$ruleRelativePath = "references/rules/frontend-skill-routing.md"
$rootRule = Join-Path $root $ruleRelativePath
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

$ruleContent = Get-Content -Raw -LiteralPath $rootRule
foreach ($requiredText in @(
  "exactly one primary visual skill",
  "repository instructions",
  "ask the user before installing",
  "design-taste-frontend",
  "frontend-app-builder"
)) {
  if ($ruleContent -notmatch [regex]::Escape($requiredText)) {
    throw "Frontend routing rule is missing required policy text: $requiredText"
  }
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
  if ((Get-Content -Raw -LiteralPath $path) -notmatch "Frontend Skill Gate") {
    throw "Feature scenario is missing Frontend Skill Gate: $path"
  }
}

Write-Host "Frontend skill routing audit passed"
