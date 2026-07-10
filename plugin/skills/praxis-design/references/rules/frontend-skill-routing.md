# Frontend Skill Routing

Use this rule whenever a Praxis workflow includes visually significant frontend design or implementation.

## Applicability

Run this gate for:

- new landing pages, portfolios, marketing pages, product surfaces, dashboards, games, or mobile/web UI;
- substantial redesigns, restyles, or new visual systems;
- image-first frontend work or visual concept generation.

Do not run it for backend-only work, documentation, infrastructure, non-visual bug fixes, or a small copy/layout correction inside an established design system unless the user explicitly requests a new visual direction.

## Precedence

Apply constraints in this order:

1. Explicit user instructions.
2. Repository instructions, including `AGENTS.md`, project skills, design-system rules, and prohibited tools or skills.
3. Approved design artifacts and established product conventions.
4. This routing policy.

Never use TasteSkill to override a higher-priority constraint. If repository instructions prohibit TasteSkill or require another design system, follow the repository and record that the gate was skipped.

## Mandatory Gate

For an applicable frontend task:

1. Inspect the available skill catalog and confirm which candidate skill files are readable.
2. Select exactly one primary visual skill. Do not activate a whole family or combine competing art-direction skills automatically.
3. Record the selected skill and a one-line rationale in the active Praxis artifact:
   - feature flow: `.workflows/{feature-id}/state.json`;
   - design: `design/architecture.md`;
   - plan: `plan/overview.md` or the single phase plan;
   - direct implementation: the phase implementation report.
4. Load and follow the selected skill before making visual design decisions or writing visually significant frontend code.
5. Treat engineering skills such as React performance, shadcn, accessibility, testing, or browser QA as supplements. They do not count as a second primary visual skill.

## Routing

| Task | Primary route |
|------|---------------|
| Landing page, portfolio, or marketing page | `design-taste-frontend` |
| Existing interface requiring targeted modernization | `redesign-existing-projects` |
| Explicit image-first design-to-code workflow | `image-to-code` |
| Explicit minimalist direction | `minimalist-ui` |
| Explicit industrial or brutalist direction | `industrial-brutalist-ui` |
| Explicit motion-heavy Awwwards/GSAP direction | `gpt-taste` |
| Web section reference images only | `imagegen-frontend-web` |
| Mobile screen reference images only | `imagegen-frontend-mobile` |
| Brand identity boards only | `brandkit` |
| Complex product UI, dashboard, or game outside TasteSkill scope | `frontend-app-builder`; do not force a TasteSkill unless one clearly matches the brief |

Style-specific variants are opt-in. Do not choose `gpt-taste`, `minimalist-ui`, or `industrial-brutalist-ui` merely because they are installed.

## When the Skill Is Unavailable

If the task is applicable and the exact recommended TasteSkill is not installed:

1. Ask the user before installing it. Name the exact skill and briefly explain why it fits.
2. Do not install the full TasteSkill family automatically.
3. Continue non-visual research or planning when useful, but pause before committing to a visual direction.
4. If the user declines, proceed with the best available non-TasteSkill workflow and record that decision.
5. If repository instructions prohibit TasteSkill, do not offer installation for that project.

Do not repeatedly ask after the user has declined within the same project or workflow.
