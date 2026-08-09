import { cp, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(packageRoot, "distribution", "taste-skill.json");

export async function loadTasteSkillCatalog() {
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  if (catalog.schema !== "praxis-taste-skill/v1") {
    throw new Error(`Unsupported taste-skill catalog schema: ${catalog.schema}`);
  }
  if (!catalog.revision || !catalog.repository || !Array.isArray(catalog.skills)) {
    throw new Error("Taste Skill catalog is missing repository, revision, or skills.");
  }
  return catalog;
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

function ownedPath(root, name) {
  const destination = path.resolve(root, name);
  const relative = path.relative(path.resolve(root), destination);
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`Refusing path outside selected skills root: ${destination}`);
  }
  return destination;
}

/**
 * Detect Taste Skill family presence under a skills root.
 * Presence of design-taste-frontend means the default v2 primary is available.
 */
export async function detectTasteSkill(skillsRoot, catalog) {
  const checks = [];
  for (const skill of catalog.skills) {
    const skillFile = path.join(ownedPath(skillsRoot, skill.installName), "SKILL.md");
    checks.push({
      installName: skill.installName,
      folder: skill.folder,
      role: skill.role,
      healthy: await exists(skillFile),
      path: skillFile,
    });
  }
  const primary = checks.find((item) => item.installName === catalog.defaultPrimaryInstallName);
  const presentCount = checks.filter((item) => item.healthy).length;
  return {
    packageId: catalog.packageId,
    revision: catalog.revision,
    channel: catalog.channel,
    defaultPrimary: catalog.defaultPrimaryInstallName,
    primaryPresent: Boolean(primary?.healthy),
    fullFamilyPresent: presentCount === catalog.skills.length,
    presentCount,
    expectedCount: catalog.skills.length,
    checks,
  };
}

function runGit(args, options = {}) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    cwd: options.cwd,
    env: process.env,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "git failed").trim();
    throw new Error(`git ${args.join(" ")} failed: ${detail}`);
  }
  return result.stdout;
}

/**
 * Install the full Taste Skill family at the pinned revision into skillsRoot.
 * Uses git clone + checkout for a reproducible pin (no automatic network via npx skills).
 */
export async function installTasteSkillFamily(skillsRoot, catalog, options = {}) {
  const actions = [];
  for (const skill of catalog.skills) {
    const destination = ownedPath(skillsRoot, skill.installName);
    const present = await exists(destination);
    actions.push({
      type: present ? (options.force ? "replace-taste" : "skip-taste") : "copy-taste",
      name: skill.installName,
      folder: skill.folder,
      destination,
      source: skill.folder,
    });
  }

  if (options.dryRun) {
    return {
      dryRun: true,
      packageId: catalog.packageId,
      revision: catalog.revision,
      channel: catalog.channel,
      skillsRoot,
      actions,
      summary: summarizeTasteActions(actions),
    };
  }

  const needsWrite = actions.some((action) => action.type === "copy-taste" || action.type === "replace-taste");
  if (!needsWrite) {
    return {
      dryRun: false,
      packageId: catalog.packageId,
      revision: catalog.revision,
      channel: catalog.channel,
      skillsRoot,
      actions,
      summary: summarizeTasteActions(actions),
    };
  }

  const tempRoot = await mkdtemp(path.join(tmpdir(), "praxis-taste-skill-"));
  try {
    runGit(["clone", "--filter=blob:none", "--no-checkout", catalog.repository, tempRoot]);
    runGit(["checkout", catalog.revision], { cwd: tempRoot });

    for (const action of actions) {
      if (action.type === "skip-taste") continue;
      const source = path.join(tempRoot, "skills", action.folder);
      if (!(await exists(source))) {
        throw new Error(`Pinned Taste Skill source folder missing: skills/${action.folder}`);
      }
      if (action.type === "replace-taste") {
        await rm(action.destination, { recursive: true, force: true });
      }
      await cp(source, action.destination, { recursive: true, errorOnExist: true });
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }

  return {
    dryRun: false,
    packageId: catalog.packageId,
    revision: catalog.revision,
    channel: catalog.channel,
    skillsRoot,
    actions,
    summary: summarizeTasteActions(actions),
  };
}

export function tasteSkillReceiptFields(catalog, installResult) {
  return {
    packageId: catalog.packageId,
    homepage: catalog.homepage,
    repository: catalog.repository,
    revision: catalog.revision,
    channel: catalog.channel,
    mode: catalog.installMode,
    defaultPrimary: catalog.defaultPrimaryInstallName,
    installed: Boolean(installResult && !installResult.dryRun),
    dryRun: Boolean(installResult?.dryRun),
    summary: installResult?.summary ?? null,
  };
}

export async function writeTasteSkillPinNote(agentsRoot, catalog) {
  if (!agentsRoot) return;
  const note = {
    schema: "praxis-taste-skill-pin/v1",
    packageId: catalog.packageId,
    repository: catalog.repository,
    revision: catalog.revision,
    channel: catalog.channel,
    defaultPrimary: catalog.defaultPrimaryInstallName,
    homepage: catalog.homepage,
    docs: catalog.docs,
    updatedAt: new Date().toISOString(),
  };
  await writeFile(path.join(agentsRoot, "praxis-taste-skill.json"), `${JSON.stringify(note, null, 2)}\n`, "utf8");
}

function summarizeTasteActions(actions) {
  return {
    copied: actions.filter((action) => action.type === "copy-taste").length,
    replaced: actions.filter((action) => action.type === "replace-taste").length,
    skipped: actions.filter((action) => action.type === "skip-taste").length,
  };
}

/** Official install names for audits and docs. */
export function tasteSkillInstallNames(catalog) {
  return catalog.skills.map((skill) => skill.installName);
}
