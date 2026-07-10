# Challenge Report: npx installer

## Summary

- Challenges raised: 5
- Critical: 0
- Significant: 3
- Minor: 2

## Challenges

### First publish cannot assume Trusted Publishing

**Severity:** SIGNIFICANT
**Target:** Release Contract
**Issue:** The package does not yet exist, while trusted-publisher configuration is package-scoped.
**Resolution:** Treat first publish as an explicit external gate; account 2FA is now enabled, so bootstrap the package only after approval and then configure OIDC immediately.

### Three installers can still drift

**Severity:** SIGNIFICANT
**Target:** Distribution manifest
**Issue:** Bash cannot safely parse arbitrary JSON without an extra dependency.
**Resolution:** Node and PowerShell consume the manifest; Bash remains a directory-enumerating fallback. Audits compare the exact source, plugin, manifest, and dry-run owned sets.

### Repo-mode naming differs from the current script

**Severity:** SIGNIFICANT
**Target:** CLI Contract
**Issue:** Existing `install.ps1 --repo` validates the checkout, while `npx ... install --repo` installs into a target repository.
**Resolution:** Document the distinction explicitly and test both surfaces; do not silently delegate one command to the other.

### Package payload duplicates repository content

**Severity:** MINOR
**Target:** Packaging Contract
**Issue:** `plugin/skills` is a mirror rather than the authoring source.
**Resolution:** Reuse it intentionally because it is non-hidden and already installable; make full-tree parity a package gate.

### Receipt can become stale after manual edits

**Severity:** MINOR
**Target:** Doctor
**Issue:** Contributors can modify installed skills after installation.
**Resolution:** Receipt is informational; doctor checks actual `SKILL.md` presence and reports drift rather than overwriting automatically.

## Implicit Assumptions

| Assumption | Risk if wrong |
|---|---|
| Node 22 is acceptable for npx users | Some environments must continue using checkout scripts |
| npm tarball preserves all plugin references | Runtime skills fail after installation; pack allowlist test blocks release |
| Exact directory ownership is sufficient for safe uninstall | Manual files inside owned skill folders are removed; plan and confirmation make this visible |

## Verdict

PASS WITH CONDITIONS. Account security and tarball verification now pass; public publication remains gated on explicit approval.
