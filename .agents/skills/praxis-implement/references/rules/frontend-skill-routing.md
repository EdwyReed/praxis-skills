# Frontend Skill Routing

Use this rule whenever a Praxis workflow includes visually significant frontend design or implementation.

Taste Skill is the recommended visual family for marketing and many product surfaces. Source of truth for install names and channels: [tasteskill.dev](https://www.tasteskill.dev/) and [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill). Praxis pins the family revision in `distribution/taste-skill.json`.

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

Never use Taste Skill to override a higher-priority constraint. If repository instructions prohibit Taste Skill or require another design system, follow the repository and record that the gate was skipped.

## Core policy

1. **Missing Taste Skill never blocks work.** Continue research, planning, and implementation with the best available approach when the family or the exact skill is absent.
2. **Present Taste Skill must be used.** When the recommended skill is readable, load it and follow it for visual decisions. Do not ignore an installed primary skill that applies to the task.
3. **If the skill is missing, offer install proactively.** Name the package, pin, and install path. Prefer the full family install Praxis documents. Do not install without user consent.
4. **Exactly one primary visual skill** for art direction. Technical supplements (React, accessibility, testing, browser QA, `full-output-enforcement`) may run with it. Do not activate competing style primaries together.
5. **Default primary is v2 experimental:** install name `design-taste-frontend` (folder `taste-skill` on GitHub). Channel `v2-experimental` until upstream cuts v2.0.0 stable. Use `design-taste-frontend-v1` only when the user requires legacy v1 behavior.

## Mandatory Gate

For an applicable frontend task:

1. Inspect the available skill catalog and confirm which candidate skill files are readable.
2. Select exactly one primary visual skill using the routing table and project profile. Prefer the project `Design Skill Routing` entry when confirmed.
3. If the selected skill is missing, **offer** installation of the pinned Taste Skill full family (or the single missing skill if the user prefers). Use:
   - `praxis-skills install --user --with-taste-skill` (or the matching scope), or
   - the upstream command for a single skill when appropriate.
   Record `frontend.status = awaiting-install-consent` until the user answers.
4. If the user declines install, set `frontend.status = declined`, continue without Taste Skill, and record the fallback approach. Do not re-prompt in the same workflow after an explicit decline.
5. If the skill is present, set `frontend.status = selected`, load it, and follow it before visual design decisions or visually significant code.
6. Record skill name, channel when known (`v2-experimental` for `design-taste-frontend`), and a one-line rationale in:
   - feature flow: `.workflows/{feature-id}/state.json` under `frontend`;
   - design: `design/architecture.md` section `Frontend Skill Selection`;
   - plan: `plan/overview.md` or the single phase plan;
   - direct implementation: the phase implementation report.

## Routing table (install names)

Install names match Taste Skill frontmatter `name:` fields and `npx skills add --skill "…"`.

| Task | Primary install name | Notes |
|------|----------------------|--------|
| Landing page, portfolio, or marketing page | `design-taste-frontend` | **Default. v2 experimental.** |
| Existing interface needing modernization | `redesign-existing-projects` | Upstream folder `redesign-skill` |
| Image-first design-to-code | `image-to-code` | Upstream folder `image-to-code-skill` |
| Explicit soft / premium agency direction | `high-end-visual-design` | Upstream folder `soft-skill` |
| Explicit minimalist direction | `minimalist-ui` | Upstream folder `minimalist-skill` |
| Explicit industrial or brutalist direction | `industrial-brutalist-ui` | Upstream folder `brutalist-skill` |
| Explicit GPT/Codex stricter motion layout | `gpt-taste` | Upstream folder `gpt-tasteskill` |
| Google Stitch / DESIGN.md export | `stitch-design-taste` | Upstream folder `stitch-skill` |
| Web section reference images only | `imagegen-frontend-web` | Image generation only |
| Mobile screen reference images only | `imagegen-frontend-mobile` | Image generation only |
| Brand identity boards only | `brandkit` | Image generation only |
| Legacy v1 behavior required by user | `design-taste-frontend-v1` | Opt-in only |
| Complex product UI, dashboard, or game outside Taste Skill scope | See **Out of Taste Skill scope** | Do not force a Taste Skill primary |

Style-specific variants (`high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`) are opt-in. Do not choose them only because they are installed.

`full-output-enforcement` is a **supplement**, never a primary visual skill.

### Out of Taste Skill scope (detail)

Taste Skill states that its default skill targets landing pages, portfolios, and redesigns. It is **not** the primary tool for dense dashboards, multi-step product admin UI, data tables, or game engine UI.

When the task is outside that scope:

1. Prefer repository design systems and existing product UI patterns.
2. Prefer technical frontend skills that match the stack (component libraries, a11y, performance).
3. Use a Taste Skill primary only when the brief clearly matches one row above (for example a marketing shell around a product).
4. **Do not block** the workflow if no Taste Skill primary fits.
5. Record `frontend.primary_skill` as the chosen non-Taste direction or `none` with rationale `out-of-taste-skill-scope`.

There is no required install name for this fallback. Inventing a fake required skill id is forbidden.

## Pin and full-family install

Praxis documents a pinned revision of the full Taste Skill family in `distribution/taste-skill.json`.

- Channel for the default skill: `v2-experimental`
- Default primary install name: `design-taste-frontend`
- Full-family optional installer flag: `--with-taste-skill` (default **off**)
- Homepage: https://www.tasteskill.dev/

Agents may also install via upstream:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill
```

For a single skill:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

When Praxis installs the family, prefer the pinned revision from `distribution/taste-skill.json` so projects stay reproducible.

## When the skill is unavailable

1. State that the recommended skill is missing.
2. Offer to install the **pinned full Taste Skill family** (or the exact skill). Explain why it fits.
3. Do not install without consent.
4. Continue non-visual work while waiting.
5. If declined, continue without Taste Skill and record the decision.
6. If the repository prohibits Taste Skill, do not offer install for that project. Set `frontend.status = prohibited`.

## When the skill is available

1. Load the selected skill file before visual decisions.
2. Follow its pre-flight and anti-slop rules for the surfaces it covers.
3. Do not silently switch to a different primary mid-workflow without recording a new gate decision.
4. Keep technical supplements secondary to the primary visual direction.

## State fields

Optional `frontend` object in feature-flow `state.json`:

- `frontend.applicable`: boolean
- `frontend.status`: `not-applicable` | `selected` | `prohibited` | `declined` | `awaiting-install-consent` | `missing-continued`
- `frontend.primary_skill`: install name string or null
- `frontend.channel`: e.g. `v2-experimental`, `stable`, `legacy-v1`, or null
- `frontend.rationale`: short string
- `frontend.taste_skill_offered`: boolean when an install offer was made

Use `missing-continued` when the skill was absent, the user was offered install or could not be prompted, and work continued without blocking.
