$ErrorActionPreference = "Stop"
$scripts = @(
  "check-source-coverage.ps1",
  "check-skill-frontmatter.ps1",
  "check-praxis-names.ps1",
  "check-frontend-skill-routing.ps1",
  "check-praxis-project-context.ps1",
  "check-workflow-skill-references.ps1",
  "check-reference-links.ps1",
  "check-no-claude-only-surfaces.ps1",
  "check-plugin-manifest.ps1",
  "check-install-dry-run.ps1"
)

foreach ($script in $scripts) {
  Write-Host "== $script =="
  & (Join-Path $PSScriptRoot $script)
}

Write-Host "All audits passed"
