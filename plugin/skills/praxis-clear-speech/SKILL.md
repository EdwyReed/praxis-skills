---
name: praxis-clear-speech
description: Apply or audit Praxis Clear Speech for LLM replies, technical documentation, human-readable code text, and user-interface copy. Use for clear-writing requests, ASD-STE100-aligned English technical writing, terminology control, copy review, or a Praxis Clear Speech compliance report.
---

# Praxis Clear Speech

Use clear language without changing technical meaning.

## Workflow

1. Read `.praxis/project.md` when the task is repository-scoped.
2. Resolve `clear_speech` from profile frontmatter:
   - `default`: Apply Core to all eligible text. Apply the English Technical Profile to English technical text.
   - `strict`: Apply the English Technical Profile to all eligible English prose.
   - `off`: Do not apply this skill automatically. Continue only when the user explicitly requests this skill for the current task.
   - Missing: Treat the value as `default` for backward compatibility.
3. Load [the Praxis Clear Speech policy](references/policy.md).
4. Identify the output surface and its protected content.
5. Write or revise the text. Preserve its technical meaning.
6. Run `scripts/audit_text.py` when the task requests an audit or produces a large English technical artifact.
7. Report automated findings as aids. Do not claim official ASD approval or certification.

## Protected Content

Do not change:

- Source-code syntax or identifiers.
- Public API names, schema fields, commands, and protocol values.
- Exact quotations, legal text, trademarks, titles, and user-provided strings.
- Established technical terms from the project glossary.

You can apply the policy to comments, docstrings, errors, logs, help text, documentation, and user-interface copy.

## Audit

Run a structural audit:

```text
python scripts/audit_text.py <path> --format text
```

Use `--sentence-limit 20` for procedures. The default limit is 25 words for descriptions.

Write a machine-readable report:

```text
python scripts/audit_text.py <path> --format json --output clear-speech-report.json
```

Add `--approved-words <path>` and `--glossary <path>` only when the user provides authorized lexical sources. The script does not bundle the ASD-STE100 dictionary.

Automated checks cannot prove full ASD-STE100 compliance. A complete review also needs the official standard, its controlled dictionary, a project glossary, and human review of meaning.

## Source Status

Praxis Clear Speech is an independent Praxis policy. ASD has not endorsed, approved, or certified it.
