import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

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
    throw new Error(`Refusing path outside selected commands root: ${destination}`);
  }
  return destination;
}

function yamlEscape(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

/**
 * Thin Claude Code slash-command adapter.
 * The skill package remains the source of truth; the command only routes invocation.
 */
export function renderSlashCommand(command, skillDescription) {
  const description = command.description || skillDescription || `Invoke Praxis skill ${command.skill}`;
  const argumentHint = command.argumentHint ?? "";
  const frontmatter = [
    "---",
    `description: "${yamlEscape(description)}"`,
    argumentHint ? `argument-hint: "${yamlEscape(argumentHint)}"` : null,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  return `${frontmatter}

# /${command.name} → ${command.skill}

You are running a Praxis slash-command adapter. Do **not** invent a parallel workflow.

## Instructions

1. Locate the skill package **${command.skill}** (directory containing \`SKILL.md\`) from Claude Code skill paths:
   - project: \`.claude/skills/${command.skill}/SKILL.md\`
   - user: \`~/.claude/skills/${command.skill}/SKILL.md\`
2. Read that \`SKILL.md\` fully and follow it as the source of truth.
3. Load only the skill's referenced files as the skill instructs (progressive disclosure).
4. Apply the skill's Project Context Gate before repository mutations.
5. Pass through the user arguments below.

## User arguments

\`\`\`text
$ARGUMENTS
\`\`\`

## Codex-compatible note

The same workflow is also available as a Codex skill invocation (\`$${command.skill}\` / skill discovery). Slash commands are an additional Claude Code entrypoint; they do not replace the skill package.
`;
}

export async function readSkillDescription(payloadRoot, skillName) {
  const skillFile = path.join(payloadRoot, skillName, "SKILL.md");
  if (!(await exists(skillFile))) return "";
  const text = await readFile(skillFile, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return "";
  const desc = match[1].match(/^description:\s*(.+)$/m);
  if (!desc) return "";
  return desc[1].trim().replace(/^["']|["']$/g, "");
}

export async function buildSlashCommandPlan(distribution, commandsRoot, options) {
  const actions = [];
  const payloadRoot = path.join(distribution.packageRoot, distribution.payload);
  for (const command of distribution.slashCommands) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(command.name)) {
      throw new Error(`Unsafe slash command name: ${command.name}`);
    }
    if (!command.name.startsWith("praxis-")) {
      throw new Error(`Slash command must be Praxis-prefixed (got ${command.name})`);
    }
    if (!distribution.skills.includes(command.skill)) {
      throw new Error(`Slash command ${command.name} references unknown skill ${command.skill}`);
    }
    const destination = ownedPath(commandsRoot, `${command.name}.md`);
    const present = await exists(destination);
    const description = await readSkillDescription(payloadRoot, command.skill);
    const content = renderSlashCommand(command, description);
    actions.push({
      type: present ? (options.force ? "replace-command" : "skip-command") : "write-command",
      name: command.name,
      skill: command.skill,
      destination,
      content,
    });
  }
  // Always clean unprefixed legacy adapters that collide with native Claude commands (e.g. /init).
  const legacyNames = distribution.legacySlashCommands ?? [];
  for (const name of legacyNames) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      throw new Error(`Unsafe legacy slash command name: ${name}`);
    }
    const destination = ownedPath(commandsRoot, `${name}.md`);
    if (await exists(destination)) {
      actions.push({ type: "remove-command", name, destination, legacy: true });
    }
  }
  return actions;
}

export async function applySlashCommandActions(actions, options) {
  if (options.dryRun) return;
  for (const action of actions) {
    if (action.type === "skip-command") continue;
    if (action.type === "replace-command") {
      await rm(action.destination, { force: true });
    }
    if (action.type === "write-command" || action.type === "replace-command") {
      await mkdir(path.dirname(action.destination), { recursive: true });
      await writeFile(action.destination, action.content, "utf8");
    }
    if (action.type === "remove-command") {
      await rm(action.destination, { force: true });
    }
  }
}

export async function buildSlashCommandUninstallPlan(distribution, commandsRoot) {
  const actions = [];
  if (!commandsRoot) return actions;
  const names = [
    ...distribution.slashCommands.map((command) => command.name),
    ...(distribution.legacySlashCommands ?? []),
  ];
  for (const name of new Set(names)) {
    const destination = ownedPath(commandsRoot, `${name}.md`);
    if (await exists(destination)) {
      actions.push({ type: "remove-command", name, destination });
    }
  }
  return actions;
}
