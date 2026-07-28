# Praxis Clear Speech Baseline

Date: 2026-07-29

## Scope

The audit covered the canonical `.agents/skills` tree. It scanned 549 text files and reduced identical embedded copies to 77 unique files.

Command:

```text
python .agents/skills/praxis-clear-speech/scripts/audit_text.py .agents/skills --format json
```

## Result

| Measure | Count |
|---------|------:|
| Findings | 384 |
| Errors | 166 |
| Warnings | 218 |
| Semicolons (`PCS001`) | 65 |
| Contractions (`PCS002`) | 70 |
| Latin abbreviations (`PCS003`) | 38 |
| Complex verb reviews (`PCS004`) | 27 |
| Passive voice reviews (`PCS005`) | 141 |
| Sentences above 25 words (`PCS006`) | 31 |
| Paragraphs above 6 sentences (`PCS008`) | 12 |

Files with the most findings:

| Findings | File |
|---------:|------|
| 80 | `.agents/skills/praxis-test-design-techniques/SKILL.md` |
| 16 | `praxis-ai-debug/references/agents/engineering/quality-reviewer.md` |
| 16 | `praxis-ai-debug/references/agents/engineering/design-reviewer.md` |
| 13 | `praxis-ai-debug/references/agents/engineering/security-reviewer.md` |
| 12 | `praxis-ai-debug/references/agents/engineering/task-refiner.md` |

## Interpretation

This is a structural baseline, not a compliance certificate. The checker finds deterministic patterns and review candidates. Passive voice and complex verb findings require human review. Code, tables, examples, and protected terms can cause valid exceptions.

The lexical check is `not-checked`. Praxis does not bundle the ASD-STE100 controlled dictionary. A complete lexical review needs an authorized dictionary source and a project glossary.

New and changed English technical content should not add deterministic violations. Existing findings can be fixed in focused edits that preserve workflow meaning.
