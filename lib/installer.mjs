import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class UsageError extends Error {
  exitCode = 2;
}

export class ConfirmationError extends Error {
  exitCode = 3;
}

export async function loadDistribution() {
  const manifestPath = path.join(packageRoot, "distribution", "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  validateDistribution(manifest);
  return { ...manifest, packageRoot };
}

export function validateDistribution(manifest) {
  if (manifest.schema !== "praxis-distribution/v1") {
    throw new Error(`Unsupported distribution manifest schema: ${manifest.schema}`);
  }
  if (!Array.isArray(manifest.skills) || !Array.isArray(manifest.legacySkills)) {
    throw new Error("Distribution manifest skill lists must be arrays.");
  }
  if (manifest.packageName !== "praxis-skills" || manifest.payload !== "plugin/skills") {
    throw new Error("Distribution manifest package identity or payload is invalid.");
  }
  if (manifest.receiptName !== "praxis-skills.json") {
    throw new Error("Distribution manifest receipt name is invalid.");
  }
  const allNames = [...manifest.skills, ...manifest.legacySkills];
  if (new Set(allNames).size !== allNames.length) {
    throw new Error("Distribution manifest skill names must be unique.");
  }
  for (const name of allNames) {
    if (!skillNamePattern.test(name)) {
      throw new Error(`Unsafe skill name in distribution manifest: ${name}`);
    }
  }
}

export function resolveTarget(options) {
  const selectors = [options.user, options.repo !== undefined, options.target !== undefined].filter(Boolean);
  if (selectors.length !== 1) {
    throw new UsageError("Choose exactly one target selector: --user, --repo [path], or --target <skills-dir>.");
  }
  if (options.user) {
    const agentsRoot = path.resolve(homedir(), ".agents");
    return { kind: "user", skillsRoot: path.join(agentsRoot, "skills"), agentsRoot };
  }
  if (options.repo !== undefined) {
    const repoRoot = path.resolve(options.repo || process.cwd());
    const agentsRoot = path.join(repoRoot, ".agents");
    return { kind: "repo", skillsRoot: path.join(agentsRoot, "skills"), agentsRoot };
  }
  return { kind: "target", skillsRoot: path.resolve(options.target), agentsRoot: null };
}

function ownedPath(root, name) {
  const destination = path.resolve(root, name);
  const relative = path.relative(path.resolve(root), destination);
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`Refusing path outside selected skills root: ${destination}`);
  }
  return destination;
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export async function buildInstallPlan(distribution, target, options) {
  const actions = [];
  const payloadRoot = path.join(distribution.packageRoot, distribution.payload);
  for (const name of distribution.skills) {
    const source = ownedPath(payloadRoot, name);
    const destination = ownedPath(target.skillsRoot, name);
    if (!(await exists(source))) throw new Error(`Bundled skill is missing: ${name}`);
    const present = await exists(destination);
    actions.push({ type: present ? (options.force ? "replace" : "skip") : "copy", name, source, destination });
  }
  if (options.force) {
    for (const name of distribution.legacySkills) {
      const destination = ownedPath(target.skillsRoot, name);
      if (await exists(destination)) actions.push({ type: "remove-legacy", name, destination });
    }
  }
  return actions;
}

export async function install(distribution, target, options) {
  const actions = await buildInstallPlan(distribution, target, options);
  await requireConfirmation(
    actions.some((action) => action.type === "replace" || action.type === "remove-legacy"),
    options,
    "Replace existing Praxis skills?",
    "Force replacement requires interactive confirmation or --yes.",
  );
  if (!options.dryRun) {
    await mkdir(target.skillsRoot, { recursive: true });
    for (const action of actions) {
      if (action.type === "replace" || action.type === "remove-legacy") {
        await rm(action.destination, { recursive: true, force: true });
      }
      if (action.type === "copy" || action.type === "replace") {
        await cp(action.source, action.destination, { recursive: true, errorOnExist: true });
      }
    }
    if (target.agentsRoot) {
      const receipt = {
        schema: "praxis-install-receipt/v1",
        package: distribution.packageName,
        version: distribution.version,
        target: target.skillsRoot,
        skills: distribution.skills,
        installedAt: new Date().toISOString(),
      };
      await writeFile(path.join(target.agentsRoot, distribution.receiptName), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
    }
  }
  return resultFromActions("install", target, actions, options.dryRun);
}

export async function uninstall(distribution, target, options) {
  const actions = [];
  for (const name of [...distribution.skills, ...distribution.legacySkills]) {
    const destination = ownedPath(target.skillsRoot, name);
    if (await exists(destination)) actions.push({ type: "remove", name, destination });
  }
  await requireConfirmation(
    actions.length > 0,
    options,
    "Remove installed Praxis skills?",
    "Uninstall requires interactive confirmation or --yes.",
  );
  if (!options.dryRun) {
    for (const action of actions) await rm(action.destination, { recursive: true, force: true });
    if (target.agentsRoot) await rm(path.join(target.agentsRoot, distribution.receiptName), { force: true });
  }
  return resultFromActions("uninstall", target, actions, options.dryRun);
}

export async function doctor(distribution, target) {
  const checks = [];
  for (const name of distribution.skills) {
    const skillFile = path.join(ownedPath(target.skillsRoot, name), "SKILL.md");
    checks.push({ name, healthy: await exists(skillFile), path: skillFile });
  }
  return {
    command: "doctor",
    target: target.skillsRoot,
    healthy: checks.every((check) => check.healthy),
    checks,
  };
}

function resultFromActions(command, target, actions, dryRun) {
  return {
    command,
    target: target.skillsRoot,
    dryRun: Boolean(dryRun),
    actions: actions.map(({ type, name, destination }) => ({ type, name, destination })),
    summary: {
      copied: actions.filter((action) => action.type === "copy").length,
      replaced: actions.filter((action) => action.type === "replace").length,
      skipped: actions.filter((action) => action.type === "skip").length,
      removed: actions.filter((action) => action.type === "remove").length,
      legacyRemoved: actions.filter((action) => action.type === "remove-legacy").length,
    },
  };
}

async function requireConfirmation(required, options, prompt, errorMessage) {
  if (!required || options.yes || options.dryRun) return;
  if (options.confirm && (await options.confirm(prompt))) return;
  throw new ConfirmationError(errorMessage);
}
