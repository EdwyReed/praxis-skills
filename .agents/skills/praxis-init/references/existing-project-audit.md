# Existing Project Audit

Audit read-only evidence before asking the user to describe what the repository already shows.

## Evidence order

1. Read root and applicable nested `AGENTS.md` files.
2. Read README, product documentation, architecture docs, ADRs, contribution guidance, and prior Praxis artifacts.
3. Inspect project structure, stack, entry points, configuration, tests, and canonical source paths.
4. For visual products, inspect rendered routes when safely runnable, then inspect tokens, shared components, typography, colors, assets, screenshots, and design links.
5. Inspect recent Git history when metadata exists. If unavailable, state that explicitly.
6. Inventory explicitly named skills, design systems, reference URLs, and prohibited approaches.

## Synthesis rules

- Separate evidence from inference.
- Describe the actual current direction, including inconsistencies.
- Do not manufacture target users, brand values, design references, or success metrics.
- Preserve exact URLs and canonical project paths.
- Select a primary visual skill only when evidence or the user supports it. Use `none` for non-visual projects.
- Keep audit detail out of `.praxis/project.md`; summarize only durable direction.
- Identify external skill candidates only from confirmed routing, repository instructions, repository-owned skills, and established workflow artifacts. Never import the user's full installed-skill inventory.
- For each candidate, verify that its absence would prevent or materially degrade reproducible project work. Record only required or recommended packages in `.praxis/skills.yaml` and preserve exact source URLs and pinned revisions.

## User checkpoint

Write the first profile as `needs-confirmation`. Report:

- one-paragraph project understanding;
- inferred product and experience direction;
- proposed design-skill routing;
- references and non-negotiables found;
- contradictions and open questions.

Ask whether the direction is correct and what should change. Mark `confirmed` only after an explicit response.

## Refresh mode

Compare evidence against the confirmed profile. Preserve still-valid decisions, list material drift, update only affected sections, and return status to `needs-confirmation` until the user approves the refresh.
