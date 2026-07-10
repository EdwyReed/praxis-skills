# CLI Contract: `praxis-skills`

## Exit codes

| Code | Meaning |
|---|---|
| 0 | command completed or dry-run plan produced |
| 1 | validation, filesystem, doctor, or cancelled destructive operation |
| 2 | invalid command-line usage |

## Target selection

Exactly one selector is accepted:

- `--user` → `<home>/.agents/skills`
- `--repo [path]` → `<path-or-cwd>/.agents/skills`
- `--target <skills-dir>` → exact custom skills root

## `install`

```text
praxis-skills install (--user | --repo [path] | --target <dir>)
                      [--force] [--dry-run] [--yes] [--json]
```

Result contains target, version, copied, skipped, removed legacy, receipt, and dry-run state. Existing targets are skipped unless forced. Force is destructive and requires confirmation or `--yes`.

## `uninstall`

```text
praxis-skills uninstall (--user | --repo [path] | --target <dir>)
                        [--dry-run] [--yes] [--json]
```

Only manifest-owned current skills and explicit legacy names are eligible. Confirmation or `--yes` is mandatory unless dry-run.

## `doctor`

```text
praxis-skills doctor (--user | --repo [path] | --target <dir>) [--json]
```

Checks manifest-owned `SKILL.md` files and the optional receipt. Missing or inconsistent required skills produces exit 1.

## `list`

```text
praxis-skills list [--json]
```

Returns package version and the ordered manifest skill list without filesystem mutation.

## JSON output

With `--json`, stdout contains one JSON object and progress text is suppressed. Errors are JSON on stderr with `error`, `code`, and optional details.
