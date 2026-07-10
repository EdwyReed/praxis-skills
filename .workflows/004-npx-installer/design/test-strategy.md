# Test Strategy: npx installer

## Levels

| Level | Scope | Tool |
|---|---|---|
| Unit | argument and target resolution, containment, plan construction | Node test runner |
| Integration | install/doctor/uninstall in isolated temporary HOME and repo directories | spawned CLI process |
| Packaging | npm allowlist and tarball contents | `npm pack --dry-run --json` |
| Conformance | manifest vs source/plugin/script behavior | PowerShell audits |
| Release | workflow syntax, version/tag guard, npm audit | CI plus static audits |

## Cases

1. `list --json` returns all 23 exact manifest skills.
2. User install copies all payload skills and writes a receipt under an isolated HOME.
3. Repo install copies to `<repo>/.agents/skills` without touching unrelated `.agents` content.
4. Custom target installs directly to the supplied skills root.
5. Existing skill is skipped without force.
6. `--force` without `--yes` in noninteractive mode fails before mutation.
7. `--force --yes` replaces exact owned targets but preserves an unrelated skill.
8. `--dry-run` reports actions and changes no files.
9. Uninstall without confirmation fails before mutation.
10. `uninstall --yes` removes current and legacy manifest names but preserves unrelated content.
11. A crafted skill name or destination outside the selected root is rejected.
12. Doctor succeeds after installation and fails when an owned `SKILL.md` is removed.
13. JSON mode emits parseable stdout without progress noise.
14. Invalid/multiple target selectors exit 2.
15. Package tarball contains CLI, manifest, all plugin skill files, README, changelog, and license.
16. Package tarball excludes `.workflows`, `.praxis`, tests, local marketplace files, nested Git state, and secrets.
17. Package has no dependencies, lifecycle scripts, or writable bundled credentials.
18. PowerShell manifest skill names equal source and plugin skill directories.
19. Full Praxis audits remain green.

## Release Acceptance

- `npm test` passes on Windows and Linux.
- `npm audit --omit=dev` reports no production vulnerabilities.
- `npm pack --dry-run --json` matches the allowlist audit.
- A tarball-installed `npx` smoke test succeeds from a temporary directory.
- Public publish is not attempted until 2FA/trusted-publisher bootstrap is explicitly approved.
