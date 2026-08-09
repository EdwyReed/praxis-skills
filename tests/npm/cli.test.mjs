import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateDistribution } from "../../lib/installer.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cliPath = path.join(repoRoot, "bin", "praxis-skills.mjs");
const expectedSkills = [
  "praxis-adr-template",
  "praxis-ai-debug",
  "praxis-api-contracts-template",
  "praxis-clear-speech",
  "praxis-design",
  "praxis-design-template",
  "praxis-docs-suite",
  "praxis-feature-flow",
  "praxis-implement",
  "praxis-init",
  "praxis-owasp-top-10",
  "praxis-plan",
  "praxis-pr",
  "praxis-qa-checklist",
  "praxis-refine",
  "praxis-research",
  "praxis-security-audit-checklist",
  "praxis-sentry-triage",
  "praxis-skill-from-git",
  "praxis-stoplight-docs",
  "praxis-system-profile",
  "praxis-task-refinement",
  "praxis-tdd-approach",
  "praxis-test-design-techniques",
];

function runCli(args, options = {}) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    env: { ...process.env, ...options.env },
    input: options.input,
  });
}

function jsonOutput(result) {
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

async function temporaryDirectory(t) {
  const directory = await mkdtemp(path.join(tmpdir(), "praxis-skills-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test("list --json returns the exact manifest-owned skill set", () => {
  const result = jsonOutput(runCli(["list", "--json"]));
  assert.equal(result.command, "list");
  assert.deepEqual(result.skills, expectedSkills);
});

test("version --json reports the beta package version", () => {
  const result = jsonOutput(runCli(["version", "--json"]));
  assert.equal(result.version, "0.4.0-beta.6");
});

test("user install uses the isolated home and writes a receipt", async (t) => {
  const home = await temporaryDirectory(t);
  const env = { HOME: home, USERPROFILE: home };
  const installed = jsonOutput(runCli(["install", "--user", "--json"], { env }));
  assert.equal(installed.summary.copied, expectedSkills.length);
  const agentsRoot = path.join(home, ".agents");
  assert.equal(
    JSON.parse(await readFile(path.join(agentsRoot, "praxis-skills.json"), "utf8")).version,
    "0.4.0-beta.6",
  );
  assert.equal(
    await readFile(path.join(agentsRoot, "skills", "praxis-init", "SKILL.md"), "utf8").then(Boolean),
    true,
  );
});

test("repo install, doctor, and uninstall preserve unrelated content", async (t) => {
  const project = await temporaryDirectory(t);
  const unrelated = path.join(project, ".agents", "skills", "my-own-skill");
  await mkdir(unrelated, { recursive: true });
  await writeFile(path.join(unrelated, "SKILL.md"), "# Mine\n");

  const installed = jsonOutput(runCli(["install", "--repo", project, "--json"]));
  assert.equal(installed.summary.copied, expectedSkills.length);
  assert.equal(
    await readFile(path.join(project, ".agents", "skills", "praxis-init", "SKILL.md"), "utf8").then(Boolean),
    true,
  );
  assert.equal(
    JSON.parse(await readFile(path.join(project, ".agents", "praxis-skills.json"), "utf8")).version,
    "0.4.0-beta.6",
  );

  const doctor = jsonOutput(runCli(["doctor", "--repo", project, "--json"]));
  assert.equal(doctor.healthy, true);

  const refused = runCli(["uninstall", "--repo", project, "--json"]);
  assert.equal(refused.status, 3);
  assert.match(refused.stderr, /--yes/);

  const removed = jsonOutput(runCli(["uninstall", "--repo", project, "--yes", "--json"]));
  assert.equal(removed.summary.removed, expectedSkills.length);
  assert.equal(await readFile(path.join(unrelated, "SKILL.md"), "utf8"), "# Mine\n");
});

test("install skips existing skills and force requires explicit consent", async (t) => {
  const target = path.join(await temporaryDirectory(t), "skills");
  const existing = path.join(target, "praxis-init");
  await mkdir(existing, { recursive: true });
  await writeFile(path.join(existing, "SKILL.md"), "# Customized\n");

  const skipped = jsonOutput(runCli(["install", "--target", target, "--json"]));
  assert.equal(skipped.summary.skipped, 1);
  assert.equal(await readFile(path.join(existing, "SKILL.md"), "utf8"), "# Customized\n");

  const refused = runCli(["install", "--target", target, "--force", "--json"]);
  assert.equal(refused.status, 3);
  assert.match(refused.stderr, /--yes/);

  const replaced = jsonOutput(
    runCli(["install", "--target", target, "--force", "--yes", "--json"]),
  );
  assert.equal(replaced.summary.replaced, expectedSkills.length);
  assert.notEqual(await readFile(path.join(existing, "SKILL.md"), "utf8"), "# Customized\n");
});

test("dry-run reports actions without mutating the target", async (t) => {
  const target = path.join(await temporaryDirectory(t), "skills");
  const result = jsonOutput(runCli(["install", "--target", target, "--dry-run", "--json"]));
  assert.equal(result.dryRun, true);
  assert.equal(result.summary.copied, expectedSkills.length);
  await assert.rejects(readFile(path.join(target, "praxis-init", "SKILL.md"), "utf8"));
});

test("doctor fails when an installed skill is damaged", async (t) => {
  const target = path.join(await temporaryDirectory(t), "skills");
  jsonOutput(runCli(["install", "--target", target, "--json"]));
  await rm(path.join(target, "praxis-init", "SKILL.md"));

  const result = runCli(["doctor", "--target", target, "--json"]);
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).healthy, false);
});

test("invalid target selector combinations exit with usage status", async (t) => {
  const target = path.join(await temporaryDirectory(t), "skills");
  const result = runCli(["install", "--user", "--target", target, "--json"]);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /exactly one target selector|Choose exactly one target/i);

  const listResult = runCli(["list", "--target", target, "--json"]);
  assert.equal(listResult.status, 2);
  assert.match(listResult.stderr, /not valid for list/i);
});

test("non-interactive install without target explains how to proceed", () => {
  const result = runCli(["install", "--json"], {
    env: { CI: "1", FORCE_COLOR: "0" },
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /--user|TTY|install/i);
});

test("ui formatPath collapses home prefixes", async () => {
  const { formatPath } = await import("../../lib/ui.mjs");
  const home = process.env.USERPROFILE || process.env.HOME;
  if (!home) return;
  assert.equal(formatPath(path.join(home, ".agents", "skills")).startsWith("~"), true);
});

test("distribution validation rejects path traversal skill names", () => {
  assert.throws(
    () =>
      validateDistribution({
        schema: "praxis-distribution/v1",
        packageName: "praxis-skills",
        payload: "plugin/skills",
        receiptName: "praxis-skills.json",
        skills: ["../outside"],
        legacySkills: [],
        agents: [
          {
            id: "codex",
            label: "Codex",
            description: "test",
            detectHomes: [".agents"],
            userSkillsRel: [".agents", "skills"],
            repoSkillsRel: [".agents", "skills"],
            userReceiptRel: [".agents"],
            repoReceiptRel: [".agents"],
            slashCommands: false,
            defaultSelected: true,
          },
        ],
        slashCommands: [],
      }),
    /Unsafe skill name/,
  );
});

test("detect --json reports known agents", () => {
  const result = jsonOutput(runCli(["detect", "--json"]));
  assert.equal(result.command, "detect");
  const ids = result.agents.map((agent) => agent.id);
  assert.deepEqual(ids, ["codex", "claude-code", "cursor", "grok"]);
});

test("claude-code user install writes skills and slash-command adapters", async (t) => {
  const home = await temporaryDirectory(t);
  const env = { HOME: home, USERPROFILE: home };
  const installed = jsonOutput(
    runCli(["install", "--user", "--agents", "claude-code", "--json"], { env }),
  );
  assert.equal(installed.targets.length, 1);
  assert.equal(installed.targets[0].agent, "claude-code");
  assert.equal(installed.summary.copied, expectedSkills.length);
  assert.equal(installed.summary.commandsWritten, 15);

  const skill = path.join(home, ".claude", "skills", "praxis-feature-flow", "SKILL.md");
  const command = path.join(home, ".claude", "commands", "praxis-feature.md");
  assert.equal(await readFile(skill, "utf8").then(Boolean), true);
  const commandBody = await readFile(command, "utf8");
  assert.match(commandBody, /praxis-feature-flow/);
  assert.match(commandBody, /\/praxis-feature/);
  assert.match(commandBody, /\$ARGUMENTS/);
  // Unprefixed names must not be installed (they collide with Claude natives like /init).
  await assert.rejects(readFile(path.join(home, ".claude", "commands", "init.md"), "utf8"));
  await assert.rejects(readFile(path.join(home, ".claude", "commands", "feature.md"), "utf8"));

  const receipt = JSON.parse(await readFile(path.join(home, ".claude", "praxis-skills.json"), "utf8"));
  assert.equal(receipt.agent, "claude-code");
  assert.equal(receipt.slashCommands.includes("praxis-feature"), true);

  const doctor = jsonOutput(runCli(["doctor", "--user", "--agents", "claude-code", "--json"], { env }));
  assert.equal(doctor.healthy, true);

  const removed = jsonOutput(
    runCli(["uninstall", "--user", "--agents", "claude-code", "--yes", "--json"], { env }),
  );
  assert.equal(removed.summary.removed, expectedSkills.length);
  assert.equal(removed.summary.commandsRemoved, 15);
});

test("multi-agent install can target codex and claude-code together", async (t) => {
  const home = await temporaryDirectory(t);
  const env = { HOME: home, USERPROFILE: home };
  const installed = jsonOutput(
    runCli(["install", "--user", "--agents", "codex,claude-code", "--json"], { env }),
  );
  assert.equal(installed.targets.length, 2);
  assert.equal(
    await readFile(path.join(home, ".agents", "skills", "praxis-init", "SKILL.md"), "utf8").then(Boolean),
    true,
  );
  assert.equal(
    await readFile(path.join(home, ".claude", "skills", "praxis-init", "SKILL.md"), "utf8").then(Boolean),
    true,
  );
  assert.equal(
    await readFile(path.join(home, ".claude", "commands", "praxis-init.md"), "utf8").then(Boolean),
    true,
  );
});

test("claude install removes unprefixed legacy slash commands", async (t) => {
  const home = await temporaryDirectory(t);
  const env = { HOME: home, USERPROFILE: home };
  const commandsRoot = path.join(home, ".claude", "commands");
  await mkdir(commandsRoot, { recursive: true });
  await writeFile(path.join(commandsRoot, "init.md"), "# legacy\n");
  await writeFile(path.join(commandsRoot, "feature.md"), "# legacy\n");

  jsonOutput(runCli(["install", "--user", "--agents", "claude-code", "--json"], { env }));
  await assert.rejects(readFile(path.join(commandsRoot, "init.md"), "utf8"));
  await assert.rejects(readFile(path.join(commandsRoot, "feature.md"), "utf8"));
  assert.equal(await readFile(path.join(commandsRoot, "praxis-init.md"), "utf8").then(Boolean), true);
});
