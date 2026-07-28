$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "../..")
$workflowSkills = Get-ChildItem (Join-Path $Root ".agents/skills") -Directory | Where-Object {
  $_.Name -like "praxis-*" -and $_.Name -notin @(
    "praxis-adr-template",
    "praxis-api-contracts-template",
    "praxis-clear-speech",
    "praxis-design-template",
    "praxis-init",
    "praxis-owasp-top-10",
    "praxis-security-audit-checklist",
    "praxis-stoplight-docs",
    "praxis-task-refinement",
    "praxis-tdd-approach",
    "praxis-test-design-techniques"
  )
}
$missing = @()

foreach ($skill in $workflowSkills) {
  foreach ($required in @("references/agents", "references/contexts", "references/rules", "references/scenarios", "references/templates")) {
    $path = Join-Path $skill.FullName $required
    if (-not (Test-Path $path)) { $missing += "$($skill.Name): $required" }
  }
}

if ($missing.Count -gt 0) {
  throw "Workflow skill references missing:`n$($missing -join "`n")"
}

Write-Host "check-workflow-skill-references passed ($($workflowSkills.Count) workflow skills)"
