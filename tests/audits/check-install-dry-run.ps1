$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "../..")
& pwsh (Join-Path $Root "install.ps1") --repo --dry-run
& pwsh (Join-Path $Root "install.ps1") --user --dry-run
& pwsh (Join-Path $Root "install.ps1") --plugin --dry-run
& pwsh (Join-Path $Root "uninstall.ps1") --dry-run
& pwsh (Join-Path $Root "verify-install.ps1")
Write-Host "check-install-dry-run passed"
