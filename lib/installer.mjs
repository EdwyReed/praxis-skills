import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { detectAgents, parseAgentList, resolveAgentTarget } from "./agents.mjs";
import {
  applySlashCommandActions,
  buildSlashCommandPlan,
  buildSlashCommandUninstallPlan,
} from "./slash-commands.mjs";
import {
  detectTasteSkill,
  installTasteSkillFamily,
  loadTasteSkillCatalog,
  tasteSkillReceiptFields,
  writeTasteSkillPinNote,
} from "./taste-skill.mjs";

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
  if (!Array.isArray(manifest.agents) || !manifest.agents.length) {
    throw new Error("Distribution manifest must declare at least one agent target.");
  }
  const agentIds = new Set();
  for (const agent of manifest.agents) {
    if (!agent.id || !skillNamePattern.test(agent.id) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(agent.id)) {
      throw new Error(`Invalid agent id: ${agent?.id}`);
    }
    if (agentIds.has(agent.id)) throw new Error(`Duplicate agent id: ${agent.id}`);
    agentIds.add(agent.id);
    for (const field of ["userSkillsRel", "repoSkillsRel", "userReceiptRel", "repoReceiptRel", "detectHomes"]) {
      if (!Array.isArray(agent[field]) || !agent[field].length) {
        throw new Error(`Agent ${agent.id} missing ${field}`);
      }
    }
  }
  if (!Array.isArray(manifest.slashCommands)) {
    throw new Error("Distribution manifest slashCommands must be an array.");
  }
  for (const command of manifest.slashCommands) {
    if (!skillNamePattern.test(command.name)) {
      throw new Error(`Unsafe slash command name: ${command.name}`);
    }
    if (!command.name.startsWith("praxis-")) {
      throw new Error(`Slash command must use the praxis- prefix: ${command.name}`);
    }
    if (!manifest.skills.includes(command.skill)) {
      throw new Error(`Slash command ${command.name} references unknown skill ${command.skill}`);
    }
  }
  if (manifest.legacySlashCommands != null) {
    if (!Array.isArray(manifest.legacySlashCommands)) {
      throw new Error("Distribution manifest legacySlashCommands must be an array when present.");
    }
    for (const name of manifest.legacySlashCommands) {
      if (!skillNamePattern.test(name)) {
        throw new Error(`Unsafe legacy slash command name: ${name}`);
      }
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
    return { kind: "user", skillsRoot: path.join(agentsRoot, "skills"), agentsRoot, agent: "codex" };
  }
  if (options.repo !== undefined) {
    const repoRoot = path.resolve(options.repo || process.cwd());
    const agentsRoot = path.join(repoRoot, ".agents");
    return { kind: "repo", skillsRoot: path.join(agentsRoot, "skills"), agentsRoot, agent: "codex" };
  }
  return {
    kind: "target",
    skillsRoot: path.resolve(options.target),
    agentsRoot: null,
    agent: "custom",
  };
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
    actions.push({
      type: present ? (options.force ? "replace" : "skip") : "copy",
      name,
      source,
      destination,
      agent: target.agent,
    });
  }
  if (options.force) {
    for (const name of distribution.legacySkills) {
      const destination = ownedPath(target.skillsRoot, name);
      if (await exists(destination)) {
        actions.push({ type: "remove-legacy", name, destination, agent: target.agent });
      }
    }
  }

  const withSlash =
    options.slashCommands === true ||
    (options.slashCommands !== false && target.slashCommands && target.commandsRoot);
  if (withSlash && target.commandsRoot) {
    const commandActions = await buildSlashCommandPlan(distribution, target.commandsRoot, options);
    for (const action of commandActions) {
      actions.push({ ...action, agent: target.agent });
    }
  }
  return actions;
}

async function applySkillActions(actions, options) {
  if (options.dryRun) return;
  for (const action of actions) {
    if (action.type === "replace" || action.type === "remove-legacy") {
      await rm(action.destination, { recursive: true, force: true });
    }
    if (action.type === "copy" || action.type === "replace") {
      await mkdir(path.dirname(action.destination), { recursive: true });
      await cp(action.source, action.destination, { recursive: true, errorOnExist: true });
    }
  }
}

async function writeReceipt(distribution, target, options, extras = {}) {
  if (options.dryRun || !target.agentsRoot) return;
  await mkdir(target.agentsRoot, { recursive: true });
  const receipt = {
    schema: "praxis-install-receipt/v1",
    package: distribution.packageName,
    version: distribution.version,
    agent: target.agent,
    target: target.skillsRoot,
    commandsTarget: target.commandsRoot ?? null,
    skills: distribution.skills,
    slashCommands:
      target.commandsRoot &&
      (options.slashCommands === true || (options.slashCommands !== false && target.slashCommands))
        ? distribution.slashCommands.map((command) => command.name)
        : [],
    tasteSkill: extras.tasteSkill ?? null,
    installedAt: new Date().toISOString(),
  };
  await writeFile(path.join(target.agentsRoot, distribution.receiptName), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
}

export async function install(distribution, target, options) {
  const actions = await buildInstallPlan(distribution, target, options);
  await requireConfirmation(
    actions.some((action) =>
      ["replace", "remove-legacy", "replace-command"].includes(action.type),
    ),
    options,
    "Replace existing Praxis skills or slash commands?",
    "Force replacement requires interactive confirmation or --yes.",
  );
  if (!options.dryRun) {
    await mkdir(target.skillsRoot, { recursive: true });
  }
  await applySkillActions(
    actions.filter((action) => ["copy", "replace", "skip", "remove-legacy"].includes(action.type)),
    options,
  );
  await applySlashCommandActions(
    actions.filter((action) => action.type.endsWith("command")),
    options,
  );

  let tasteSkillResult = null;
  if (options.tasteSkill) {
    const catalog = await loadTasteSkillCatalog();
    tasteSkillResult = await installTasteSkillFamily(target.skillsRoot, catalog, options);
    if (!options.dryRun && target.agentsRoot) {
      await writeTasteSkillPinNote(target.agentsRoot, catalog);
    }
    await writeReceipt(distribution, target, options, {
      tasteSkill: tasteSkillReceiptFields(catalog, tasteSkillResult),
    });
  } else {
    await writeReceipt(distribution, target, options, { tasteSkill: null });
  }

  const result = resultFromActions("install", target, actions, options.dryRun);
  if (tasteSkillResult) result.tasteSkill = tasteSkillResult;
  return result;
}

/**
 * Install into one or more agent destinations for a scope (user/repo).
 */
export async function installMany(distribution, targets, options) {
  if (!targets.length) throw new UsageError("No install targets selected.");
  const results = [];
  const allActions = [];
  for (const target of targets) {
    const actions = await buildInstallPlan(distribution, target, options);
    allActions.push(...actions);
  }
  await requireConfirmation(
    allActions.some((action) => ["replace", "remove-legacy", "replace-command"].includes(action.type)),
    options,
    "Replace existing Praxis skills or slash commands?",
    "Force replacement requires interactive confirmation or --yes.",
  );
  for (const target of targets) {
    const result = await install(distribution, target, { ...options, confirm: async () => true, yes: true });
    results.push(result);
  }
  return {
    command: "install",
    dryRun: Boolean(options.dryRun),
    targets: results,
    summary: summarizeMany(results),
  };
}

export async function uninstall(distribution, target, options) {
  const actions = [];
  for (const name of [...distribution.skills, ...distribution.legacySkills]) {
    const destination = ownedPath(target.skillsRoot, name);
    if (await exists(destination)) actions.push({ type: "remove", name, destination, agent: target.agent });
  }
  if (target.commandsRoot) {
    const commandActions = await buildSlashCommandUninstallPlan(distribution, target.commandsRoot);
    for (const action of commandActions) actions.push({ ...action, agent: target.agent });
  }
  await requireConfirmation(
    actions.length > 0,
    options,
    "Remove installed Praxis skills and slash commands?",
    "Uninstall requires interactive confirmation or --yes.",
  );
  if (!options.dryRun) {
    for (const action of actions) {
      if (action.type === "remove") await rm(action.destination, { recursive: true, force: true });
      if (action.type === "remove-command") await rm(action.destination, { force: true });
    }
    if (target.agentsRoot) await rm(path.join(target.agentsRoot, distribution.receiptName), { force: true });
  }
  return resultFromActions("uninstall", target, actions, options.dryRun);
}

export async function uninstallMany(distribution, targets, options) {
  if (!targets.length) throw new UsageError("No uninstall targets selected.");
  const results = [];
  const allActions = [];
  for (const target of targets) {
    const plan = await buildUninstallPlan(distribution, target);
    allActions.push(...plan);
  }
  await requireConfirmation(
    allActions.length > 0,
    options,
    "Remove installed Praxis skills and slash commands?",
    "Uninstall requires interactive confirmation or --yes.",
  );
  for (const target of targets) {
    const result = await uninstall(distribution, target, { ...options, confirm: async () => true, yes: true });
    results.push(result);
  }
  return {
    command: "uninstall",
    dryRun: Boolean(options.dryRun),
    targets: results,
    summary: summarizeMany(results),
  };
}

async function buildUninstallPlan(distribution, target) {
  const actions = [];
  for (const name of [...distribution.skills, ...distribution.legacySkills]) {
    const destination = ownedPath(target.skillsRoot, name);
    if (await exists(destination)) actions.push({ type: "remove", name, destination });
  }
  if (target.commandsRoot) {
    actions.push(...(await buildSlashCommandUninstallPlan(distribution, target.commandsRoot)));
  }
  return actions;
}

export async function doctor(distribution, target) {
  const checks = [];
  for (const name of distribution.skills) {
    const skillFile = path.join(ownedPath(target.skillsRoot, name), "SKILL.md");
    checks.push({ kind: "skill", name, healthy: await exists(skillFile), path: skillFile, agent: target.agent });
  }

  // Slash commands are verified only when a receipt records that they were installed.
  let expectedCommands = [];
  let receiptTasteSkill = null;
  if (target.agentsRoot) {
    try {
      const receipt = JSON.parse(await readFile(path.join(target.agentsRoot, distribution.receiptName), "utf8"));
      if (Array.isArray(receipt.slashCommands)) expectedCommands = receipt.slashCommands;
      if (receipt.tasteSkill) receiptTasteSkill = receipt.tasteSkill;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  if (target.commandsRoot && expectedCommands.length) {
    for (const name of expectedCommands) {
      const commandFile = path.join(target.commandsRoot, `${name}.md`);
      checks.push({
        kind: "command",
        name,
        healthy: await exists(commandFile),
        path: commandFile,
        agent: target.agent,
      });
    }
  }

  let tasteSkill = null;
  // Taste Skill is optional. Only fail doctor when a receipt claims it was installed.
  if (receiptTasteSkill?.installed) {
    const catalog = await loadTasteSkillCatalog();
    tasteSkill = await detectTasteSkill(target.skillsRoot, catalog);
    for (const item of tasteSkill.checks) {
      checks.push({
        kind: "taste-skill",
        name: item.installName,
        healthy: item.healthy,
        path: item.path,
        agent: target.agent,
      });
    }
  }

  return {
    command: "doctor",
    agent: target.agent,
    target: target.skillsRoot,
    commandsTarget: target.commandsRoot ?? null,
    healthy: checks.every((check) => check.healthy),
    checks,
    tasteSkill,
  };
}

export async function doctorMany(distribution, targets) {
  const results = [];
  for (const target of targets) results.push(await doctor(distribution, target));
  return {
    command: "doctor",
    healthy: results.every((result) => result.healthy),
    targets: results,
  };
}

export async function resolveInstallTargets(distribution, options) {
  // Custom single directory remains a raw skills-only target.
  if (options.target !== undefined) {
    return [
      {
        agent: "custom",
        label: "Custom target",
        kind: "target",
        skillsRoot: path.resolve(options.target),
        commandsRoot: options.commandsTarget ? path.resolve(options.commandsTarget) : null,
        agentsRoot: null,
        slashCommands: Boolean(options.slashCommands && options.commandsTarget),
      },
    ];
  }

  const scope = options.user ? "user" : "repo";
  const repoRoot = options.repo !== undefined ? path.resolve(options.repo || process.cwd()) : process.cwd();

  let agentIds;
  if (options.agents) {
    agentIds = parseAgentList(options.agents, distribution);
  } else if (options.allAgents) {
    agentIds = distribution.agents.map((agent) => agent.id);
  } else if (options.selectedAgents?.length) {
    agentIds = options.selectedAgents;
  } else {
    // Backward compatible default: Codex only when non-interactive selector path.
    agentIds = ["codex"];
  }

  return agentIds.map((agentId) => {
    const target = resolveAgentTarget(distribution, agentId, scope, repoRoot);
    if (options.slashCommands === false) target.slashCommands = false;
    if (options.slashCommands === true && target.commandsRoot) target.slashCommands = true;
    return target;
  });
}

export { detectAgents, parseAgentList, resolveAgentTarget };

function resultFromActions(command, target, actions, dryRun) {
  return {
    command,
    agent: target.agent,
    target: target.skillsRoot,
    commandsTarget: target.commandsRoot ?? null,
    dryRun: Boolean(dryRun),
    actions: actions.map(({ type, name, destination, skill }) => ({
      type,
      name,
      skill: skill ?? null,
      destination,
    })),
    summary: {
      copied: actions.filter((action) => action.type === "copy").length,
      replaced: actions.filter((action) => action.type === "replace").length,
      skipped: actions.filter((action) => action.type === "skip").length,
      removed: actions.filter((action) => action.type === "remove").length,
      legacyRemoved: actions.filter((action) => action.type === "remove-legacy").length,
      commandsWritten: actions.filter((action) => action.type === "write-command").length,
      commandsReplaced: actions.filter((action) => action.type === "replace-command").length,
      commandsSkipped: actions.filter((action) => action.type === "skip-command").length,
      commandsRemoved: actions.filter((action) => action.type === "remove-command").length,
    },
  };
}

function summarizeMany(results) {
  const summary = {
    copied: 0,
    replaced: 0,
    skipped: 0,
    removed: 0,
    legacyRemoved: 0,
    commandsWritten: 0,
    commandsReplaced: 0,
    commandsSkipped: 0,
    commandsRemoved: 0,
  };
  for (const result of results) {
    for (const key of Object.keys(summary)) summary[key] += result.summary[key] ?? 0;
  }
  return summary;
}

async function requireConfirmation(required, options, prompt, errorMessage) {
  if (!required || options.yes || options.dryRun) return;
  if (options.confirm && (await options.confirm(prompt))) return;
  throw new ConfirmationError(errorMessage);
}
