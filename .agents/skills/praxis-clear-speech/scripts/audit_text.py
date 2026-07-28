#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from collections import Counter
from dataclasses import asdict, dataclass
from pathlib import Path


TEXT_EXTENSIONS = {
    ".html",
    ".jsx",
    ".md",
    ".mdx",
    ".py",
    ".rst",
    ".svelte",
    ".text",
    ".ts",
    ".tsx",
    ".txt",
    ".vue",
}
CONTRACTION_RE = re.compile(
    r"\b(?:aren't|can't|couldn't|didn't|doesn't|don't|hadn't|hasn't|haven't|"
    r"isn't|shouldn't|wasn't|weren't|won't|wouldn't|it's|that's|there's|they're|"
    r"we're|you're|I've|we've|you've|they've|I'll|we'll|you'll|they'll)\b",
    re.IGNORECASE,
)
LATIN_RE = re.compile(r"(?<!\w)(?:e\.g\.|i\.e\.|etc\.)(?!\w)", re.IGNORECASE)
COMPLEX_VERB_RE = re.compile(
    r"\b(?:has|have|had)\s+(?:been\s+)?[a-z]+(?:ed|en)\b|"
    r"\b(?:am|are|is|was|were)\s+[a-z]+ing\b",
    re.IGNORECASE,
)
PASSIVE_RE = re.compile(
    r"\b(?:am|are|is|was|were|be|been|being)\s+"
    r"(?:\w+\s+){0,2}\w+(?:ed|en)\b",
    re.IGNORECASE,
)
WORD_RE = re.compile(r"\b[A-Za-z][A-Za-z'-]*\b")
SENTENCE_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9`*_(])")
FENCE_RE = re.compile(r"(?ms)^```.*?^```\s*$|^~~~.*?^~~~\s*$")
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")
URL_RE = re.compile(r"https?://\S+")
MARKDOWN_RE = re.compile(r"(?m)^\s{0,3}(?:#{1,6}|[-+*]|\d+[.)]|>|!\[[^\]]*\])\s*")
LIST_ITEM_RE = re.compile(r"^\s{0,3}(?:[-+*]|\d+[.)])\s+")


@dataclass(frozen=True)
class Finding:
    rule: str
    severity: str
    path: str
    line: int
    message: str
    excerpt: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Audit text with Praxis Clear Speech checks.")
    parser.add_argument("paths", nargs="+", help="Files or directories to audit.")
    parser.add_argument("--format", choices=("text", "json"), default="text")
    parser.add_argument("--output", help="Write the report to this path.")
    parser.add_argument("--approved-words", help="Authorized file with one approved English word per line.")
    parser.add_argument("--glossary", help="Project glossary with one permitted term per line.")
    parser.add_argument(
        "--sentence-limit",
        type=int,
        choices=(20, 25),
        default=25,
        help="Maximum words per sentence. Use 20 for procedures and 25 for descriptions.",
    )
    parser.add_argument("--fail-on", choices=("none", "error", "warning"), default="none")
    parser.add_argument("--include-duplicates", action="store_true")
    return parser.parse_args()


def collect_files(paths: list[str]) -> list[Path]:
    files: list[Path] = []
    for raw in paths:
        path = Path(raw).resolve()
        if path.is_file() and path.suffix.lower() in TEXT_EXTENSIONS:
            files.append(path)
        elif path.is_dir():
            files.extend(
                item
                for item in path.rglob("*")
                if item.is_file()
                and item.suffix.lower() in TEXT_EXTENSIONS
                and not any(part in {".git", "node_modules"} for part in item.parts)
            )
    return sorted(set(files))


def load_word_set(raw_path: str | None) -> set[str]:
    if not raw_path:
        return set()
    path = Path(raw_path)
    return {
        line.strip().lower()
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    }


def mask_protected_text(text: str) -> str:
    text = FENCE_RE.sub("", text)
    text = INLINE_CODE_RE.sub(" CODE ", text)
    text = URL_RE.sub(" URL ", text)
    return text


def plain_line(line: str) -> str:
    line = MARKDOWN_RE.sub("", line)
    line = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)
    line = re.sub(r"[*_~|]", "", line)
    return line.strip()


def excerpt(text: str, limit: int = 140) -> str:
    value = re.sub(r"\s+", " ", text).strip()
    return value if len(value) <= limit else value[: limit - 3] + "..."


def word_count(text: str) -> int:
    return len(WORD_RE.findall(text))


def audit_file(
    path: Path,
    approved: set[str],
    glossary: set[str],
    sentence_limit: int,
) -> list[Finding]:
    source = path.read_text(encoding="utf-8", errors="replace")
    text = mask_protected_text(source)
    findings: list[Finding] = []
    paragraphs: list[tuple[int, str]] = []
    current: list[str] = []
    start_line = 1

    def add(rule: str, severity: str, line: int, message: str, value: str) -> None:
        findings.append(Finding(rule, severity, str(path), line, message, excerpt(value)))

    for line_number, raw_line in enumerate(text.splitlines(), 1):
        is_list_item = bool(LIST_ITEM_RE.match(raw_line))
        line = plain_line(raw_line)
        if not line:
            if current:
                paragraphs.append((start_line, " ".join(current)))
                current = []
            continue
        if is_list_item and current:
            paragraphs.append((start_line, " ".join(current)))
            current = []
        if not current:
            start_line = line_number
        current.append(line)

        if ";" in line:
            add("PCS001", "error", line_number, "Do not use a semicolon in eligible English prose.", line)
        if CONTRACTION_RE.search(line):
            add("PCS002", "error", line_number, "Do not use contractions in English technical prose.", line)
        if LATIN_RE.search(line):
            add("PCS003", "warning", line_number, "Replace a Latin abbreviation with English words.", line)
        if COMPLEX_VERB_RE.search(line):
            add("PCS004", "warning", line_number, "Review this possible complex verb construction.", line)
        if PASSIVE_RE.search(line):
            add("PCS005", "warning", line_number, "Review this possible passive construction.", line)

        for sentence in SENTENCE_RE.split(line):
            count = word_count(sentence)
            if count > sentence_limit:
                add(
                    "PCS006",
                    "error",
                    line_number,
                    f"Sentence has {count} words. The maximum is {sentence_limit}.",
                    sentence,
                )

        if is_list_item:
            paragraphs.append((start_line, " ".join(current)))
            current = []

        if approved:
            unknown = sorted(
                {
                    word.lower()
                    for word in WORD_RE.findall(line)
                    if word.lower() not in approved and word.lower() not in glossary
                }
            )
            if unknown:
                add(
                    "PCS007",
                    "review",
                    line_number,
                    "Review words that are not in the supplied approved-word list or glossary: "
                    + ", ".join(unknown[:12]),
                    line,
                )

    if current:
        paragraphs.append((start_line, " ".join(current)))

    for line_number, paragraph in paragraphs:
        sentence_count = len([item for item in SENTENCE_RE.split(paragraph) if item.strip()])
        if sentence_count > 6:
            add(
                "PCS008",
                "warning",
                line_number,
                f"Paragraph has {sentence_count} sentences. The maximum is 6.",
                paragraph,
            )

    return findings


def render_text(report: dict[str, object]) -> str:
    lines = [
        "Praxis Clear Speech audit",
        f"Files: {report['files_scanned']}",
        f"Unique files: {report['unique_files_scanned']}",
        f"Findings: {report['finding_count']}",
    ]
    for severity, count in sorted(report["severity_counts"].items()):
        lines.append(f"{severity.upper()}: {count}")
    for finding in report["findings"]:
        lines.append(
            f"{finding['severity'].upper()} {finding['rule']} "
            f"{finding['path']}:{finding['line']} {finding['message']}"
        )
    return "\n".join(lines) + "\n"


def main() -> int:
    args = parse_args()
    files = collect_files(args.paths)
    approved = load_word_set(args.approved_words)
    glossary = load_word_set(args.glossary)
    seen_hashes: set[str] = set()
    unique_files: list[Path] = []

    for path in files:
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if args.include_duplicates or digest not in seen_hashes:
            seen_hashes.add(digest)
            unique_files.append(path)

    findings: list[Finding] = []
    for path in unique_files:
        findings.extend(audit_file(path, approved, glossary, args.sentence_limit))

    severity_counts = Counter(finding.severity for finding in findings)
    rule_counts = Counter(finding.rule for finding in findings)
    report: dict[str, object] = {
        "schema": "praxis-clear-speech-audit/v1",
        "files_scanned": len(files),
        "unique_files_scanned": len(unique_files),
        "finding_count": len(findings),
        "severity_counts": dict(sorted(severity_counts.items())),
        "rule_counts": dict(sorted(rule_counts.items())),
        "lexical_check": "enabled" if approved else "not-checked",
        "sentence_limit": args.sentence_limit,
        "findings": [asdict(finding) for finding in findings],
    }
    output = json.dumps(report, ensure_ascii=False, indent=2) + "\n" if args.format == "json" else render_text(report)

    if args.output:
        Path(args.output).write_text(output, encoding="utf-8")
    else:
        sys.stdout.write(output)

    if args.fail_on == "error" and severity_counts["error"]:
        return 1
    if args.fail_on == "warning" and (severity_counts["error"] or severity_counts["warning"]):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
