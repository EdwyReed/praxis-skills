# ADR-002: Trusted npm publishing after secure bootstrap

## Status

Accepted with an external account-security prerequisite.

## Context

The npm account is authenticated in Chrome but has no 2FA. The local npm CLI is unauthenticated. The package name is unregistered. npm Trusted Publishing provides OIDC publication and provenance but requires npm-side package configuration.

## Decision

Prepare a tagged GitHub Actions publish workflow with `id-token: write`, exact repository metadata, tests, and pack inspection. Perform only the first package bootstrap after account 2FA is enabled and the final tarball is approved. Configure Trusted Publishing immediately afterward and use it for subsequent releases.

## Alternatives Considered

### Long-lived automation token

- Pros: simple initial CI setup.
- Cons: persistent credential, manual rotation, larger leakage impact, weaker desired release posture.

### Manual publish for every version

- Pros: direct human presence and simple infrastructure.
- Cons: inconsistent reproducibility and no automated release gate.

### Delay npm until a registry abstraction exists

- Pros: no immediate account or release work.
- Cons: loses the agreed npx onboarding benefit and leaves the package name unclaimed.

## Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Name claimed before bootstrap | medium | high | complete beta package promptly; publish only after checks |
| Workflow/repository metadata mismatch | medium | medium | exact `repository.url`, documented npm trusted-publisher fields |
| Tag/version mismatch | medium | high | workflow validation before `npm publish` |
| Compromised release workflow | low | high | minimal permissions, protected tags/environment, provenance |

## Consequences

- Public publication remains blocked until account security is enabled.
- Release automation is committed before it is activated in npm settings.
- No npm token is stored in the repository or planned CI path.
