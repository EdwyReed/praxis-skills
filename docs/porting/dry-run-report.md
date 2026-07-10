# Dry Run Report

This report records the local fixture dry-runs used to prove Codex workflow parity.

Current status: fixture and audit scripts are present. Run:

```powershell
pwsh tests/audits/run-all.ps1
```

Expected dry-run coverage:

- Feature flow initializes, checks status, and resumes from state.
- Research, design, and plan skills describe their artifact contracts.
- Docs-suite supports full and update modes.
- Sentry triage artifacts can feed feature flow through `--from`.
- Skill-from-git writes `.agents/skills/{project}-patterns`.
