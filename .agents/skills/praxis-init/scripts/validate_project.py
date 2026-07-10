#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path


REQUIRED_FRONTMATTER = {
    "schema": r"praxis-project/v1",
    "status": r"(?:needs-confirmation|confirmed)",
    "project_id": r"[a-z0-9][a-z0-9-]*",
    "project_type": r"(?:new|existing)",
    "source": r"(?:interview|audit|refresh)",
    "visual_scope": r"(?:none|limited|significant)",
    "updated": r"\d{4}-\d{2}-\d{2}",
}

REQUIRED_HEADINGS = [
    "# Core Contract",
    "## Project Concept",
    "## Product Direction",
    "## Experience Direction",
    "## Design Skill Routing",
    "## Reference Designs and Projects",
    "## Existing System and Assets",
    "## Constraints and Non-Negotiables",
    "## Open Questions",
    "## Confirmation",
]

START_MARKER = "<!-- praxis:project-context:start -->"
END_MARKER = "<!-- praxis:project-context:end -->"
FLOATING_REVISIONS = {"main", "master", "head", "latest", "develop", "development"}


def words(text: str) -> list[str]:
    return re.findall(r"\b[\w'-]+\b", text, flags=re.UNICODE)


def scalar(value: str | None) -> str:
    if value is None:
        return ""
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def manifest_field(block: str, key: str, indent: int = 4) -> str:
    match = re.search(rf"(?m)^{' ' * indent}{re.escape(key)}:\s*(.*?)\s*$", block)
    return scalar(match.group(1) if match else None)


def parse_manifest(text: str) -> list[dict[str, object]]:
    starts = list(re.finditer(r"(?m)^  - id:\s*(.*?)\s*$", text))
    packages: list[dict[str, object]] = []
    for index, start in enumerate(starts):
        end = starts[index + 1].start() if index + 1 < len(starts) else len(text)
        block = text[start.start():end]
        skills_match = re.search(
            r"(?ms)^    skills:\s*\n(?P<body>(?:^      -\s+.*?\s*$\n?)+)", block
        )
        skill_values = (
            [scalar(value) for value in re.findall(r"(?m)^      -\s+(.*?)\s*$", skills_match.group("body"))]
            if skills_match
            else []
        )
        packages.append(
            {
                "id": scalar(start.group(1)),
                "requirement": manifest_field(block, "requirement"),
                "role": manifest_field(block, "role"),
                "source_type": manifest_field(block, "type", 6),
                "source_url": manifest_field(block, "url", 6),
                "source_revision": manifest_field(block, "revision", 6),
                "source_package": manifest_field(block, "package", 6),
                "source_command": manifest_field(block, "command", 6),
                "skills": skill_values,
                "rationale": manifest_field(block, "rationale"),
                "applies_when": manifest_field(block, "applies_when"),
                "overflow_justification": manifest_field(block, "overflow_justification"),
            }
        )
    return packages


def validate_manifest(path: Path, errors: list[str]) -> tuple[str | None, int]:
    if not path.is_file():
        return None, 0

    text = path.read_text(encoding="utf-8")
    if not re.search(r"(?m)^schema:\s*praxis-skills/v1\s*$", text):
        errors.append("skills manifest has invalid or missing schema")
    if not re.search(r"(?m)^packages:\s*$", text):
        errors.append("skills manifest is missing packages")

    packages = parse_manifest(text)
    if not packages:
        errors.append("skills manifest must contain at least one package; remove the file when none apply")

    seen_ids: set[str] = set()
    seen_roles: set[str] = set()
    required_packages: list[dict[str, object]] = []
    for package in packages:
        package_id = str(package["id"])
        requirement = str(package["requirement"])
        role = str(package["role"])
        source_type = str(package["source_type"])

        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", package_id):
            errors.append(f"skills manifest package has invalid id: {package_id or '<missing>'}")
        elif package_id in seen_ids:
            errors.append(f"skills manifest has duplicate package id: {package_id}")
        seen_ids.add(package_id)

        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", role):
            errors.append(f"skills manifest package {package_id} has invalid role")
        elif role in seen_roles:
            errors.append(f"skills manifest has duplicate role: {role}")
        seen_roles.add(role)

        if requirement not in {"required", "recommended"}:
            errors.append(f"skills manifest package {package_id} has invalid requirement: {requirement or '<missing>'}")
        if requirement == "required":
            required_packages.append(package)

        if source_type not in {"git", "marketplace", "website", "local-generation"}:
            errors.append(f"skills manifest package {package_id} has invalid source type: {source_type or '<missing>'}")
        elif source_type == "git":
            url = str(package["source_url"])
            revision = str(package["source_revision"])
            if not re.match(r"https://", url):
                errors.append(f"skills manifest git package {package_id} requires an HTTPS url")
            if not revision or revision.lower() in FLOATING_REVISIONS:
                errors.append(f"skills manifest git package {package_id} requires a pinned revision")
        elif source_type == "website" and not re.match(r"https://", str(package["source_url"])):
            errors.append(f"skills manifest website package {package_id} requires an HTTPS url")
        elif source_type == "marketplace" and not str(package["source_package"]):
            errors.append(f"skills manifest marketplace package {package_id} requires source.package")
        elif source_type == "local-generation" and not str(package["source_command"]):
            errors.append(f"skills manifest local-generation package {package_id} requires source.command")

        if not package["skills"]:
            errors.append(f"skills manifest package {package_id} requires at least one selected skill")
        if not str(package["rationale"]):
            errors.append(f"skills manifest package {package_id} requires rationale")
        if not str(package["applies_when"]):
            errors.append(f"skills manifest package {package_id} requires applies_when")

    if len(required_packages) > 5:
        for package in required_packages[5:]:
            if not str(package["overflow_justification"]):
                errors.append(
                    f"skills manifest required package {package['id']} exceeds the normal limit of 5 and needs overflow_justification"
                )

    return hashlib.sha256(text.encode("utf-8")).hexdigest(), len(packages)


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    profile_path = root / ".praxis" / "project.md"
    manifest_path = root / ".praxis" / "skills.yaml"
    agents_path = root / "AGENTS.md"
    errors: list[str] = []

    if not profile_path.is_file():
        errors.append(f"missing profile: {profile_path}")
        return finish(errors, None, None, 0, 0, 0)

    text = profile_path.read_text(encoding="utf-8")
    frontmatter_match = re.match(r"\A---\s*\n(.*?)\n---\s*\n", text, flags=re.DOTALL)
    if not frontmatter_match:
        errors.append("missing YAML frontmatter")
        frontmatter = ""
    else:
        frontmatter = frontmatter_match.group(1)

    for key, pattern in REQUIRED_FRONTMATTER.items():
        if not re.search(rf"(?m)^{re.escape(key)}:\s*{pattern}\s*$", frontmatter):
            errors.append(f"invalid or missing frontmatter field: {key}")

    positions: list[int] = []
    for heading in REQUIRED_HEADINGS:
        position = text.find(heading)
        if position < 0:
            errors.append(f"missing heading: {heading}")
        positions.append(position)
    valid_positions = [position for position in positions if position >= 0]
    if valid_positions and valid_positions != sorted(valid_positions):
        errors.append("required headings are out of order")

    word_count = len(words(text))
    if word_count > 2500:
        errors.append(f"profile exceeds 2500 words: {word_count}")

    core_start = text.find("# Core Contract")
    project_start = text.find("## Project Concept")
    core_word_count = 0
    if core_start >= 0 and project_start > core_start:
        core_word_count = len(words(text[core_start:project_start]))
        if core_word_count > 400:
            errors.append(f"Core Contract exceeds 400 words: {core_word_count}")
    else:
        errors.append("cannot determine Core Contract boundary")

    if not agents_path.is_file():
        errors.append(f"missing AGENTS.md bootstrap: {agents_path}")
    else:
        agents_text = agents_path.read_text(encoding="utf-8")
        if agents_text.count(START_MARKER) != 1 or agents_text.count(END_MARKER) != 1:
            errors.append("AGENTS.md must contain exactly one managed Praxis bootstrap block")
        if ".praxis/project.md" not in agents_text:
            errors.append("AGENTS.md bootstrap does not reference .praxis/project.md")
        if ".praxis/skills.yaml" not in agents_text:
            errors.append("AGENTS.md bootstrap does not reference optional .praxis/skills.yaml")

    manifest_digest, package_count = validate_manifest(manifest_path, errors)
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return finish(errors, digest, manifest_digest, package_count, word_count, core_word_count)


def finish(
    errors: list[str],
    digest: str | None,
    manifest_digest: str | None,
    package_count: int,
    word_count: int,
    core_word_count: int,
) -> int:
    result = {
        "valid": not errors,
        "profile_sha256": digest,
        "skills_manifest_present": manifest_digest is not None,
        "skills_manifest_sha256": manifest_digest,
        "skills_package_count": package_count,
        "word_count": word_count,
        "core_word_count": core_word_count,
        "errors": errors,
    }
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
