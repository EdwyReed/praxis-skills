$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "../..")
$skillFiles = Get-ChildItem (Join-Path $Root ".agents/skills") -Recurse -File -Filter "SKILL.md"
if ($skillFiles.Count -eq 0) { throw "No SKILL.md files found" }

foreach ($file in $skillFiles) {
  $text = Get-Content -Raw $file.FullName
  if ($text -notmatch '(?s)^---\s*(.*?)\s*---') { throw "Missing YAML frontmatter: $($file.FullName)" }
  $yaml = $matches[1]
  if ($yaml -notmatch '(?m)^name:\s*\S+') { throw "Missing name in $($file.FullName)" }
  if ($yaml -notmatch '(?m)^description:\s*.+') { throw "Missing description in $($file.FullName)" }
}

Write-Host "check-skill-frontmatter passed ($($skillFiles.Count) skills)"
