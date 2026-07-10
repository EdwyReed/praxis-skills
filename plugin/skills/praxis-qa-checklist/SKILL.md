---
name: praxis-qa-checklist
description: Use to generate structured QA checklists from feature descriptions, URLs, images, PDFs, documents, or text using test design techniques.
---

# Codex QA Checklist

Load `references/agents/engineering/qa-engineer.md`, `references/rules/qa-checklist-selection.md`, and `.agents/skills/praxis-test-design-techniques/SKILL.md`.

Route spreadsheets, PDFs, documents, and images to available Codex document/media capabilities. Produce `.workflows/{feature-id}/qa/checklist.md` when a feature id is known, and include a concise checklist in the response.

## Project Context Gate

For repository-scoped QA work, check `.praxis/project.md`, invoke `praxis-init` when it is missing, read it fully, and require `status: confirmed` before writing project artifacts. Record `project_context.profile_sha256` in the checklist. If `.praxis/skills.yaml` exists, validate it and record `project_context.skills_manifest_sha256`, but load package details only when QA requires skill selection or availability checks. Never install external packages automatically; ask for explicit approval when an applicable required package is missing. Skip this gate when the request concerns a standalone artifact, URL, image, PDF, document, or text that is not part of a repository project.
