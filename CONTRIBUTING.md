# Contributing

- Add reusable workflows as Codex skills under `.agents/skills`.
- Keep source role/rule/context detail in `references`.
- Update `docs/porting/coverage-matrix.md` and `tests/audits/expected-source-files.txt` when source coverage changes.
- Run `pwsh tests/audits/run-all.ps1` before proposing a release.
- Do not introduce active install paths that require the legacy Claude home directory.
