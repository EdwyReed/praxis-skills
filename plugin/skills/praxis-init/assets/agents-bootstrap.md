<!-- praxis:project-context:start -->
## Praxis Project Context

Before any project-scoped work, read `.praxis/project.md` fully and treat its confirmed decisions as project constraints. If it is missing, initialize it before modifying the project. If its status is `needs-confirmation`, limit work to read-only reconnaissance, diagnostics, or profile correction until the user confirms it. If `.praxis/skills.yaml` exists, validate it with project context. Read package details only before you select, check, or install skills.

Never install an external package automatically. Explain any applicable missing package and ask for explicit approval. After context compaction, a direction-changing request, or a context hash change, read the affected file again.

Resolve `clear_speech` from the project profile before you write eligible text. A missing value means `default`. In `default` mode, apply Praxis Clear Speech Core to replies, documentation, human-readable code text, and interface copy. Apply its English Technical Profile to English technical text.

In `strict` mode, apply that English profile to all eligible English prose. In `off` mode, do not load or apply Praxis Clear Speech or its audits automatically. A current explicit user request can enable the skill for one task or require a different style. Load `praxis-clear-speech` when you need the full policy or an audit. Preserve identifiers, API fields, exact quotations, legal text, trademarks, external contracts, and approved project terms.
<!-- praxis:project-context:end -->
