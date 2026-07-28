$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path
$sourceSkill = Join-Path $root ".agents/skills/praxis-clear-speech"
$pluginSkill = Join-Path $root "plugin/skills/praxis-clear-speech"
$policy = Join-Path $root "references/rules/clear-speech.md"

foreach ($path in @(
  (Join-Path $sourceSkill "SKILL.md"),
  (Join-Path $sourceSkill "agents/openai.yaml"),
  (Join-Path $sourceSkill "references/policy.md"),
  (Join-Path $sourceSkill "scripts/audit_text.py"),
  $policy
)) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing Praxis Clear Speech file: $path"
  }
}

$sourceFiles = Get-ChildItem -LiteralPath $sourceSkill -File -Recurse | Where-Object {
  $_.FullName -notmatch '\\__pycache__\\'
} | ForEach-Object {
  $_.FullName.Substring($sourceSkill.Length).TrimStart('\', '/')
} | Sort-Object
$pluginFiles = Get-ChildItem -LiteralPath $pluginSkill -File -Recurse | Where-Object {
  $_.FullName -notmatch '\\__pycache__\\'
} | ForEach-Object {
  $_.FullName.Substring($pluginSkill.Length).TrimStart('\', '/')
} | Sort-Object
if (($sourceFiles -join "`n") -ne ($pluginFiles -join "`n")) {
  throw "Source/plugin file lists differ for praxis-clear-speech"
}
foreach ($relative in $sourceFiles) {
  $sourceHash = (Get-FileHash -LiteralPath (Join-Path $sourceSkill $relative) -Algorithm SHA256).Hash
  $pluginHash = (Get-FileHash -LiteralPath (Join-Path $pluginSkill $relative) -Algorithm SHA256).Hash
  if ($sourceHash -ne $pluginHash) {
    throw "Source/plugin content differs for praxis-clear-speech/$relative"
  }
}

$policyHash = (Get-FileHash -LiteralPath $policy -Algorithm SHA256).Hash
$skillPolicyHash = (Get-FileHash -LiteralPath (Join-Path $sourceSkill "references/policy.md") -Algorithm SHA256).Hash
if ($policyHash -ne $skillPolicyHash) {
  throw "Root and skill Praxis Clear Speech policies differ"
}

$embeddedSkills = @(
  "praxis-ai-debug",
  "praxis-design",
  "praxis-docs-suite",
  "praxis-feature-flow",
  "praxis-implement",
  "praxis-plan",
  "praxis-pr",
  "praxis-qa-checklist",
  "praxis-refine",
  "praxis-research",
  "praxis-sentry-triage",
  "praxis-skill-from-git",
  "praxis-system-profile"
)
foreach ($surface in @(".agents/skills", "plugin/skills")) {
  foreach ($skill in $embeddedSkills) {
    $embedded = Join-Path $root "$surface/$skill/references/rules/clear-speech.md"
    if (-not (Test-Path -LiteralPath $embedded)) {
      throw "Missing embedded Praxis Clear Speech policy: $embedded"
    }
    if ((Get-FileHash -LiteralPath $embedded -Algorithm SHA256).Hash -ne $policyHash) {
      throw "Embedded Praxis Clear Speech policy differs: $embedded"
    }
  }
}

$profileFiles = @(
  ".agents/skills/praxis-init/assets/project-template.md",
  ".agents/skills/praxis-init/references/project-schema.md",
  ".agents/skills/praxis-init/assets/agents-bootstrap.md"
)
foreach ($relative in $profileFiles) {
  $text = Get-Content -Raw -LiteralPath (Join-Path $root $relative)
  foreach ($required in @("clear_speech", "default", "strict", "off")) {
    if ($text -notmatch [regex]::Escape($required)) {
      throw "$relative does not define Praxis Clear Speech mode: $required"
    }
  }
}

$pdf = Get-ChildItem -Path @(
  (Join-Path $root ".agents"),
  (Join-Path $root "plugin"),
  (Join-Path $root "references"),
  (Join-Path $root "distribution")
) -File -Recurse -Filter "*.pdf"
if ($pdf) {
  throw "Official or other PDFs must not be bundled with Praxis Clear Speech: $($pdf.FullName -join ', ')"
}

$fixtureRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("praxis-clear-speech-" + [guid]::NewGuid().ToString("N"))
try {
  New-Item -ItemType Directory -Force -Path $fixtureRoot | Out-Null
  $good = Join-Path $fixtureRoot "good.md"
  $bad = Join-Path $fixtureRoot "bad.md"
  Set-Content -LiteralPath $good -Value "Open the settings page. Select Save." -Encoding UTF8
  Set-Content -LiteralPath $bad -Value "It isn't ready; this sentence contains more than twenty-five separate English words because the audit must detect an excessive sentence length in descriptive technical prose without any ambiguity today." -Encoding UTF8

  $auditor = Join-Path $sourceSkill "scripts/audit_text.py"
  $goodOutput = & python $auditor $good --format json
  if ($LASTEXITCODE -ne 0) {
    throw "Clear Speech auditor rejected the valid fixture: $goodOutput"
  }
  $goodResult = $goodOutput | ConvertFrom-Json
  if ($goodResult.finding_count -ne 0) {
    throw "Clear Speech auditor reported a finding for the valid fixture: $goodOutput"
  }

  $badOutput = & python $auditor $bad --format json
  $badResult = $badOutput | ConvertFrom-Json
  foreach ($rule in @("PCS001", "PCS002", "PCS006")) {
    if (-not $badResult.rule_counts.$rule) {
      throw "Clear Speech auditor did not report ${rule}: $badOutput"
    }
  }
} finally {
  if (Test-Path -LiteralPath $fixtureRoot) {
    Remove-Item -LiteralPath $fixtureRoot -Recurse -Force
  }
}

Write-Host "Praxis Clear Speech audit passed"
