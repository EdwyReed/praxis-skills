# Test Strategy

1. A repository with no external skill dependencies validates without `.praxis/skills.yaml`.
2. A valid manifest with required and recommended packages validates and emits a SHA-256.
3. `optional` requirement is rejected.
4. Duplicate package ids and duplicate roles are rejected.
5. Git sources without a pinned revision are rejected.
6. More than five required packages without overflow justification is rejected.
7. Bootstrap and workflow gates mention the conditional manifest and prohibit automatic installation.
8. Source, plugin, and user-global skill packages remain hash-identical.
